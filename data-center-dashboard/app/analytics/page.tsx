"use client"

import { useState, useEffect } from "react"
import { getAccessLogs, getTemperatureData, getMotionData, type AccessLog, type TelemetryData } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { format, subDays } from "date-fns"
import { BarChart3, RefreshCw, ThermometerIcon, Activity, DoorOpen, Clock } from "lucide-react"

export default function AnalyticsPage() {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [temperatureData, setTemperatureData] = useState<TelemetryData[]>([])
  const [motionData, setMotionData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  async function fetchAnalyticsData() {
    try {
      setLoading(true)

      // Get data for the last 30 days
      const fromDate = format(subDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss'Z'")

      const [logsData, tempData, motionData] = await Promise.all([
        getAccessLogs(fromDate),
        getTemperatureData(fromDate),
        getMotionData(fromDate),
      ])

      setAccessLogs(logsData)
      setTemperatureData(tempData)
      setMotionData(motionData)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalAccesses = accessLogs.length
  const deniedAccesses = accessLogs.filter((log) => !log.access_granted).length
  const accessRate = totalAccesses > 0 ? (((totalAccesses - deniedAccesses) / totalAccesses) * 100).toFixed(1) : "0"

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>

      <Tabs defaultValue="access" className="space-y-4">
        <TabsList>
          <TabsTrigger value="access">Access Analytics</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="motion">Motion Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Access Events</CardTitle>
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAccesses}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Access Success Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accessRate}%</div>
                <p className="text-xs text-muted-foreground">{deniedAccesses} denied access attempts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Access Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9:00 AM</div>
                <p className="text-xs text-muted-foreground">Most activity between 8-10 AM</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Access Trends</CardTitle>
              <CardDescription>Access patterns over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              {loading ? (
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                  <p>Access trend visualization is under development</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temperature Trends</CardTitle>
              <CardDescription>Temperature readings over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              {loading ? (
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ThermometerIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>Temperature trend visualization is under development</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Motion Detection</CardTitle>
              <CardDescription>Motion detection events over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              {loading ? (
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Activity className="mx-auto h-12 w-12 mb-4" />
                  <p>Motion detection visualization is under development</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
