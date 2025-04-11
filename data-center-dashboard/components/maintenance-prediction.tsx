"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { WrenchIcon, CheckCircle, Calendar, RefreshCw, ClipboardList, Clock } from "lucide-react"

// Replace the mock data imports with imports from our centralized mock data file
import { MOCK_MAINTENANCE_DATA } from "@/lib/mock-data"

// Mock data for maintenance predictions
// const MOCK_MAINTENANCE_DATA = [
//   {
//     id: "maint_01",
//     deviceId: "ac_01",
//     deviceName: "Server Room A - AC Unit",
//     deviceType: "Air Conditioner",
//     healthScore: 87,
//     nextMaintenanceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days from now
//     maintenanceType: "Filter Replacement",
//     priority: "medium",
//     estimatedDowntime: 30, // minutes
//     lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 75).toISOString(), // 75 days ago
//   },
//   {
//     id: "maint_02",
//     deviceId: "door_01",
//     deviceName: "Main Entrance - Access Control",
//     deviceType: "Door Controller",
//     healthScore: 92,
//     nextMaintenanceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days from now
//     maintenanceType: "Routine Inspection",
//     priority: "low",
//     estimatedDowntime: 15, // minutes
//     lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
//   },
//   {
//     id: "maint_03",
//     deviceId: "ups_01",
//     deviceName: "UPS System",
//     deviceType: "Power Supply",
//     healthScore: 68,
//     nextMaintenanceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
//     maintenanceType: "Battery Check",
//     priority: "high",
//     estimatedDowntime: 60, // minutes
//     lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 85).toISOString(), // 85 days ago
//   },
//   {
//     id: "maint_04",
//     deviceId: "sensor_01",
//     deviceName: "Temperature Sensors - Server Room",
//     deviceType: "Sensor Array",
//     healthScore: 95,
//     nextMaintenanceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days from now
//     maintenanceType: "Calibration",
//     priority: "low",
//     estimatedDowntime: 45, // minutes
//     lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
//   },
// ]

export function MaintenancePrediction() {
  // Update the useState calls to use the imported mock data
  const [maintenanceData, setMaintenanceData] = useState(MOCK_MAINTENANCE_DATA)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Simulate loading data
  useEffect(() => {
    const loadData = () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setMaintenanceData(MOCK_MAINTENANCE_DATA)
        setLoading(false)
      }, 1000)
    }

    loadData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntil = (dateString: string) => {
    const now = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="default">Medium Priority</Badge>
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleScheduleMaintenance = (id: string) => {
    toast({
      title: "Maintenance Scheduled",
      description: "The maintenance task has been added to the schedule.",
    })
  }

  const handleRefresh = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Predictions Updated",
        description: "Maintenance predictions have been refreshed",
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Maintenance Prediction</h2>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceData.length}</div>
            <p className="text-sm text-muted-foreground">Monitored for maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(maintenanceData.reduce((acc, item) => acc + item.healthScore, 0) / maintenanceData.length)}%
            </div>
            <p className="text-sm text-muted-foreground">Across all devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceData.filter((item) => getDaysUntil(item.nextMaintenanceDate) <= 30).length}
            </div>
            <p className="text-sm text-muted-foreground">Tasks in next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {maintenanceData.filter((item) => item.priority === "high").length}
            </div>
            <p className="text-sm text-muted-foreground">Tasks requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Predicted Maintenance Schedule</CardTitle>
          <CardDescription>AI-powered maintenance predictions for your equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceData
              .sort((a, b) => new Date(a.nextMaintenanceDate).getTime() - new Date(b.nextMaintenanceDate).getTime())
              .map((item) => {
                const daysUntil = getDaysUntil(item.nextMaintenanceDate)
                return (
                  <div key={item.id} className="flex flex-col space-y-2 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <WrenchIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">{item.deviceName}</h3>
                      </div>
                      {getPriorityBadge(item.priority)}
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground">Health Score:</span>
                      <div className="w-full max-w-[200px]">
                        <Progress value={item.healthScore} className="h-2" />
                      </div>
                      <span className={getHealthColor(item.healthScore)}>{item.healthScore}%</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Next Maintenance:</span>
                        <span>{formatDate(item.nextMaintenanceDate)}</span>
                        <Badge
                          variant="outline"
                          className={
                            daysUntil <= 7 ? "text-red-500" : daysUntil <= 30 ? "text-amber-500" : "text-green-500"
                          }
                        >
                          {daysUntil} days
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Type:</span>
                        <span>{item.maintenanceType}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Est. Downtime:</span>
                        <span>{item.estimatedDowntime} minutes</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Last Maintenance:</span>
                        <span>{formatDate(item.lastMaintenance)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleScheduleMaintenance(item.id)}>
                        Schedule Maintenance
                      </Button>
                    </div>
                  </div>
                )
              })}

            {maintenanceData.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <CheckCircle className="mx-auto h-12 w-12 mb-2" />
                <p>No maintenance tasks predicted at this time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
