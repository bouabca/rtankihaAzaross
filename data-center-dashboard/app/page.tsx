"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getDevices,
  getAccessLogs,
  getTemperatureData,
  type Device,
  type AccessLog,
  type TelemetryData,
} from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Activity, ThermometerIcon, DoorOpen, ShieldAlert, Server, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format, subDays } from "date-fns"
import { CameraFeed } from "@/components/camera-feed"
import { ACController } from "@/components/ac-controller"
import { MaintenancePrediction } from "@/components/maintenance-prediction"
import { AlertSystem } from "@/components/alert-system"

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [temperatureData, setTemperatureData] = useState<TelemetryData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)

        // Get data for the last 7 days
        const fromDate = format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss'Z'")

        const [devicesData, logsData, tempData] = await Promise.all([
          getDevices(),
          getAccessLogs(fromDate),
          getTemperatureData(fromDate),
        ])

        setDevices(devicesData)
        setAccessLogs(logsData)
        setTemperatureData(tempData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  // Calculate statistics
  const totalDevices = devices.length
  const onlineDevices = devices.filter((device) => device.system && device.system.wifi_signal > -80).length

  const totalAccesses = accessLogs.length
  const deniedAccesses = accessLogs.filter((log) => !log.access_granted).length

  const latestTemperature =
    temperatureData.length > 0 ? temperatureData[temperatureData.length - 1].sensors.temperature : null

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Clock className="mr-1 h-3 w-3" />
            {format(new Date(), "PPP")}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="climate">Climate Control</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDevices}</div>
                <p className="text-xs text-muted-foreground">
                  {onlineDevices} online ({Math.round((onlineDevices / totalDevices) * 100) || 0}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Access Events</CardTitle>
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAccesses}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Access Denied</CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deniedAccesses}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((deniedAccesses / totalAccesses) * 100) || 0}% of total access attempts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Temperature</CardTitle>
                <ThermometerIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestTemperature !== null ? `${latestTemperature.toFixed(1)}°C` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Latest reading</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 10 access events across all devices</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {accessLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={log.access_granted ? "default" : "destructive"}
                            className="h-2 w-2 rounded-full p-1"
                          />
                          <span className="font-medium">{log.user_name || "Unknown User"}</span>
                          <span className="text-sm text-muted-foreground">at {log.device_name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(log.timestamp * 1000), "MMM d, h:mm a")}
                        </div>
                      </div>
                    ))}

                    {accessLogs.length === 0 && (
                      <div className="py-4 text-center text-muted-foreground">No recent activity</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Device Status</CardTitle>
                <CardDescription>Current status of all devices</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {devices.slice(0, 6).map((device) => (
                      <div key={device.device_id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={device.system && device.system.wifi_signal > -80 ? "default" : "secondary"}
                            className="h-2 w-2 rounded-full p-1"
                          />
                          <span className="font-medium">{device.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{device.location}</div>
                      </div>
                    ))}

                    {devices.length === 0 && (
                      <div className="py-4 text-center text-muted-foreground">No devices found</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <CameraFeed />
        </TabsContent>

        <TabsContent value="climate" className="space-y-4">
          <ACController />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <MaintenancePrediction />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertSystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}
