"use client"

import { useState, useEffect } from "react"
import { getDevices, controlRelay, controlBuzzer, controlLed, deleteDevice, type Device } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  RefreshCw,
  MoreVertical,
  KeyRound,
  Settings,
  Trash2,
  Server,
  DoorOpen,
  Bell,
  Lightbulb,
} from "lucide-react"

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDevices()
  }, [])

  async function fetchDevices() {
    try {
      setLoading(true)
      const data = await getDevices()
      setDevices(data)
    } catch (error) {
      console.error("Error fetching devices:", error)
      toast({
        title: "Error",
        description: "Failed to load devices. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleControlRelay(deviceId: string, state: boolean) {
    try {
      await controlRelay(deviceId, state)

      // Update local state
      setDevices(
        devices.map((device) => {
          if (device.device_id === deviceId) {
            return {
              ...device,
              status: {
                ...device.status,
                relay: state,
              },
            }
          }
          return device
        }),
      )

      toast({
        title: "Success",
        description: `Door ${state ? "opened" : "closed"} successfully`,
      })
    } catch (error) {
      console.error("Error controlling relay:", error)
      toast({
        title: "Error",
        description: "Failed to control door. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleControlBuzzer(deviceId: string, state: boolean) {
    try {
      await controlBuzzer(deviceId, state, state ? 2 : undefined) // 2 second duration if turning on

      // Update local state
      setDevices(
        devices.map((device) => {
          if (device.device_id === deviceId) {
            return {
              ...device,
              status: {
                ...device.status,
                buzzer: state,
              },
            }
          }
          return device
        }),
      )

      toast({
        title: "Success",
        description: `Buzzer ${state ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error controlling buzzer:", error)
      toast({
        title: "Error",
        description: "Failed to control buzzer. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleControlLed(deviceId: string, state: boolean) {
    try {
      await controlLed(deviceId, state)

      // Update local state
      setDevices(
        devices.map((device) => {
          if (device.device_id === deviceId) {
            return {
              ...device,
              status: {
                ...device.status,
                led: state,
              },
            }
          }
          return device
        }),
      )

      toast({
        title: "Success",
        description: `LED ${state ? "turned on" : "turned off"} successfully`,
      })
    } catch (error) {
      console.error("Error controlling LED:", error)
      toast({
        title: "Error",
        description: "Failed to control LED. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteDevice() {
    if (!deviceToDelete) return

    try {
      await deleteDevice(deviceToDelete)
      setDevices(devices.filter((device) => device.device_id !== deviceToDelete))
      toast({
        title: "Success",
        description: "Device deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting device:", error)
      toast({
        title: "Error",
        description: "Failed to delete device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeviceToDelete(null)
    }
  }

  async function handleSyncRFID(deviceId: string) {
    try {
      // This would call the syncRFIDCards function from the API
      toast({
        title: "Success",
        description: "RFID cards synced successfully",
      })
    } catch (error) {
      console.error("Error syncing RFID cards:", error)
      toast({
        title: "Error",
        description: "Failed to sync RFID cards. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Devices</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <Card key={device.device_id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleSyncRFID(device.device_id)}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Sync RFID Cards
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeviceToDelete(device.device_id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{device.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">ID: {device.device_id}</span>
                    </div>
                    <Badge variant="outline">v{device.firmware_version}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={device.system && device.system.wifi_signal > -80 ? "default" : "secondary"}
                        className="h-2 w-2 rounded-full p-1"
                      />
                      <span className="text-sm">
                        {device.system && device.system.wifi_signal > -80 ? "Online" : "Offline"}
                      </span>
                    </div>
                    {device.system && (
                      <span className="text-sm text-muted-foreground">Signal: {device.system.wifi_signal} dBm</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="grid w-full gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DoorOpen className="h-4 w-4" />
                      <span>Door</span>
                    </div>
                    <Switch
                      checked={device.status?.relay || false}
                      onCheckedChange={(state) => handleControlRelay(device.device_id, state)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Buzzer</span>
                    </div>
                    <Switch
                      checked={device.status?.buzzer || false}
                      onCheckedChange={(state) => handleControlBuzzer(device.device_id, state)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>LED</span>
                    </div>
                    <Switch
                      checked={device.status?.led || false}
                      onCheckedChange={(state) => handleControlLed(device.device_id, state)}
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}

          {devices.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              <Server className="mx-auto h-12 w-12 mb-4" />
              <p>No devices found</p>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Register Device
              </Button>
            </div>
          )}
        </div>
      )}

      <AlertDialog open={!!deviceToDelete} onOpenChange={(open) => !open && setDeviceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the device and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDevice} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
