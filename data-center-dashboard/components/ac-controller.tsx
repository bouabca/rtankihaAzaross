"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  ThermometerIcon,
  Droplets,
  Wind,
  Power,
  RefreshCw,
  TrendingUp,
  Zap,
  Clock,
  Snowflake,
  Flame,
} from "lucide-react"

// Replace the mock data imports with imports from our centralized mock data file
import { MOCK_AC_ZONES, MOCK_ENERGY_DATA, MOCK_AI_RECOMMENDATIONS } from "@/lib/mock-data"

// Mock data for AC zones
// const MOCK_AC_ZONES = [
//   {
//     id: "ac_01",
//     name: "Server Room A",
//     location: "Building A, Floor 2",
//     status: "running",
//     currentTemp: 21.5,
//     targetTemp: 21.0,
//     humidity: 45,
//     power: 3.2, // kW
//     mode: "cooling",
//     fanSpeed: 2, // 1-3
//     isAuto: true,
//   },
//   {
//     id: "ac_02",
//     name: "Server Room B",
//     location: "Building A, Floor 2",
//     status: "running",
//     currentTemp: 22.1,
//     targetTemp: 21.0,
//     humidity: 48,
//     power: 2.8, // kW
//     mode: "cooling",
//     fanSpeed: 2, // 1-3
//     isAuto: true,
//   },
//   {
//     id: "ac_03",
//     name: "Network Room",
//     location: "Building B, Floor 1",
//     status: "idle",
//     currentTemp: 23.4,
//     targetTemp: 23.0,
//     humidity: 52,
//     power: 0.2, // kW (standby)
//     mode: "cooling",
//     fanSpeed: 1, // 1-3
//     isAuto: true,
//   },
//   {
//     id: "ac_04",
//     name: "UPS Room",
//     location: "Building A, Floor 1",
//     status: "running",
//     currentTemp: 24.7,
//     targetTemp: 24.0,
//     humidity: 55,
//     power: 2.1, // kW
//     mode: "cooling",
//     fanSpeed: 1, // 1-3
//     isAuto: false,
//   },
// ]

// Mock data for energy usage
// const MOCK_ENERGY_DATA = {
//   today: 78.4, // kWh
//   yesterday: 82.1, // kWh
//   thisWeek: 542.6, // kWh
//   lastWeek: 561.3, // kWh
//   thisMonth: 2345.8, // kWh
//   savingsPercent: 3.2, // %
// }

// Mock data for AI recommendations
// const MOCK_AI_RECOMMENDATIONS = [
//   {
//     id: "rec_01",
//     zoneId: "ac_01",
//     zoneName: "Server Room A",
//     recommendation: "Increase target temperature by 1°C to save energy",
//     potentialSavings: 5.2, // %
//     impact: "low", // low, medium, high
//   },
//   {
//     id: "rec_02",
//     zoneId: "ac_02",
//     zoneName: "Server Room B",
//     recommendation: "Schedule maintenance - filter efficiency decreasing",
//     potentialSavings: 3.8, // %
//     impact: "medium", // low, medium, high
//   },
//   {
//     id: "rec_03",
//     zoneId: "ac_04",
//     zoneName: "UPS Room",
//     recommendation: "Enable auto mode for optimal efficiency",
//     potentialSavings: 7.5, // %
//     impact: "high", // low, medium, high
//   },
// ]

export function ACController() {
  // Update the useState calls to use the imported mock data
  const [acZones, setAcZones] = useState(MOCK_AC_ZONES)
  const [energyData, setEnergyData] = useState(MOCK_ENERGY_DATA)
  const [recommendations, setRecommendations] = useState(MOCK_AI_RECOMMENDATIONS)
  const [loading, setLoading] = useState(false)
  const [selectedZone, setSelectedZone] = useState(MOCK_AC_ZONES[0])
  const { toast } = useToast()

  // Simulate loading data
  useEffect(() => {
    const loadData = () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setAcZones(MOCK_AC_ZONES)
        setEnergyData(MOCK_ENERGY_DATA)
        setRecommendations(MOCK_AI_RECOMMENDATIONS)
        setLoading(false)
      }, 1000)
    }

    loadData()
    // Refresh data every minute
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  const handlePowerToggle = (zoneId: string) => {
    setAcZones(
      acZones.map((zone) => {
        if (zone.id === zoneId) {
          const newStatus = zone.status === "running" ? "idle" : "running"
          toast({
            title: `${zone.name} ${newStatus === "running" ? "Started" : "Stopped"}`,
            description: `AC unit is now ${newStatus}`,
          })
          return { ...zone, status: newStatus }
        }
        return zone
      }),
    )
  }

  const handleAutoToggle = (zoneId: string) => {
    setAcZones(
      acZones.map((zone) => {
        if (zone.id === zoneId) {
          const newAuto = !zone.isAuto
          toast({
            title: `${zone.name} Auto Mode ${newAuto ? "Enabled" : "Disabled"}`,
            description: `Auto temperature control is now ${newAuto ? "enabled" : "disabled"}`,
          })
          return { ...zone, isAuto: newAuto }
        }
        return zone
      }),
    )
  }

  const handleTemperatureChange = (zoneId: string, temp: number) => {
    setAcZones(
      acZones.map((zone) => {
        if (zone.id === zoneId) {
          return { ...zone, targetTemp: temp }
        }
        return zone
      }),
    )
  }

  const handleFanSpeedChange = (zoneId: string, speed: number) => {
    setAcZones(
      acZones.map((zone) => {
        if (zone.id === zoneId) {
          toast({
            title: `${zone.name} Fan Speed Changed`,
            description: `Fan speed set to ${speed === 1 ? "Low" : speed === 2 ? "Medium" : "High"}`,
          })
          return { ...zone, fanSpeed: speed }
        }
        return zone
      }),
    )
  }

  const handleModeChange = (zoneId: string, mode: string) => {
    setAcZones(
      acZones.map((zone) => {
        if (zone.id === zoneId) {
          toast({
            title: `${zone.name} Mode Changed`,
            description: `Mode set to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
          })
          return { ...zone, mode }
        }
        return zone
      }),
    )
  }

  const handleApplyRecommendation = (recId: string) => {
    const recommendation = recommendations.find((rec) => rec.id === recId)
    if (!recommendation) return

    toast({
      title: "Recommendation Applied",
      description: `Applied: ${recommendation.recommendation}`,
    })

    // Remove the recommendation from the list
    setRecommendations(recommendations.filter((rec) => rec.id !== recId))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Air Conditioning Control</h2>
        <Button variant="outline" onClick={() => {}} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <Tabs defaultValue="zones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zones">AC Zones</TabsTrigger>
          <TabsTrigger value="energy">Energy Usage</TabsTrigger>
          <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {acZones.map((zone) => (
              <Card
                key={zone.id}
                className={`cursor-pointer hover:border-primary transition-colors ${selectedZone.id === zone.id ? "border-primary" : ""}`}
                onClick={() => setSelectedZone(zone)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{zone.name}</CardTitle>
                    <Badge variant={zone.status === "running" ? "default" : "secondary"}>{zone.status}</Badge>
                  </div>
                  <CardDescription>{zone.location}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <ThermometerIcon
                        className={zone.currentTemp > zone.targetTemp ? "text-red-500" : "text-blue-500"}
                      />
                      <span className="text-2xl font-bold">{zone.currentTemp.toFixed(1)}°C</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Target: {zone.targetTemp.toFixed(1)}°C</div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 mr-1" />
                      {zone.humidity}%
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      {zone.power.toFixed(1)} kW
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 mr-1" />
                      {zone.fanSpeed === 1 ? "Low" : zone.fanSpeed === 2 ? "Med" : "High"}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="w-full flex items-center justify-between">
                    <Button
                      variant={zone.status === "running" ? "default" : "secondary"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePowerToggle(zone.id)
                      }}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      {zone.status === "running" ? "On" : "Off"}
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`auto-${zone.id}`} className="text-xs">
                        Auto
                      </Label>
                      <Switch
                        id={`auto-${zone.id}`}
                        checked={zone.isAuto}
                        onCheckedChange={() => handleAutoToggle(zone.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Zone Control: {selectedZone.name}</CardTitle>
              <CardDescription>{selectedZone.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-muted-foreground">{selectedZone.targetTemp.toFixed(1)}°C</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Snowflake className="h-4 w-4 text-blue-500" />
                  <Slider
                    id="temperature"
                    disabled={selectedZone.isAuto}
                    min={16}
                    max={30}
                    step={0.5}
                    value={[selectedZone.targetTemp]}
                    onValueChange={(value) => handleTemperatureChange(selectedZone.id, value[0])}
                    className="flex-1"
                  />
                  <Flame className="h-4 w-4 text-red-500" />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fan-speed">Fan Speed</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedZone.fanSpeed === 1 ? "default" : "outline"}
                    onClick={() => handleFanSpeedChange(selectedZone.id, 1)}
                    disabled={selectedZone.isAuto}
                  >
                    Low
                  </Button>
                  <Button
                    variant={selectedZone.fanSpeed === 2 ? "default" : "outline"}
                    onClick={() => handleFanSpeedChange(selectedZone.id, 2)}
                    disabled={selectedZone.isAuto}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={selectedZone.fanSpeed === 3 ? "default" : "outline"}
                    onClick={() => handleFanSpeedChange(selectedZone.id, 3)}
                    disabled={selectedZone.isAuto}
                  >
                    High
                  </Button>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="mode">Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedZone.mode === "cooling" ? "default" : "outline"}
                    onClick={() => handleModeChange(selectedZone.id, "cooling")}
                    disabled={selectedZone.isAuto}
                  >
                    <Snowflake className="h-4 w-4 mr-2" />
                    Cool
                  </Button>
                  <Button
                    variant={selectedZone.mode === "heating" ? "default" : "outline"}
                    onClick={() => handleModeChange(selectedZone.id, "heating")}
                    disabled={selectedZone.isAuto}
                  >
                    <Flame className="h-4 w-4 mr-2" />
                    Heat
                  </Button>
                  <Button
                    variant={selectedZone.mode === "fan" ? "default" : "outline"}
                    onClick={() => handleModeChange(selectedZone.id, "fan")}
                    disabled={selectedZone.isAuto}
                  >
                    <Wind className="h-4 w-4 mr-2" />
                    Fan
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-control">Auto Temperature Control</Label>
                <Switch
                  id="auto-control"
                  checked={selectedZone.isAuto}
                  onCheckedChange={() => handleAutoToggle(selectedZone.id)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">Current Power: {selectedZone.power.toFixed(1)} kW</div>
              <Button variant="destructive" onClick={() => handlePowerToggle(selectedZone.id)}>
                <Power className="h-4 w-4 mr-2" />
                {selectedZone.status === "running" ? "Turn Off" : "Turn On"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Today's Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="text-2xl font-bold">{energyData.today.toFixed(1)}</span>
                    <span className="ml-1 text-muted-foreground">kWh</span>
                  </div>
                  <Badge variant="outline" className="text-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {energyData.savingsPercent.toFixed(1)}% saved
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  vs. Yesterday: {energyData.yesterday.toFixed(1)} kWh
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-2xl font-bold">{energyData.thisWeek.toFixed(1)}</span>
                  <span className="ml-1 text-muted-foreground">kWh</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  vs. Last Week: {energyData.lastWeek.toFixed(1)} kWh
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-2xl font-bold">{energyData.thisMonth.toFixed(1)}</span>
                  <span className="ml-1 text-muted-foreground">kWh</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Projected savings: {((energyData.thisMonth * energyData.savingsPercent) / 100).toFixed(1)} kWh
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Energy Usage Trends</CardTitle>
              <CardDescription>AC system power consumption over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 mb-4" />
                <p>Energy usage chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Smart suggestions to optimize your AC system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        rec.impact === "high"
                          ? "bg-green-100 text-green-600"
                          : rec.impact === "medium"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {rec.impact === "high" ? (
                        <Zap className="h-5 w-5" />
                      ) : rec.impact === "medium" ? (
                        <ThermometerIcon className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{rec.zoneName}</p>
                        <Badge variant="outline" className="text-green-500">
                          {rec.potentialSavings.toFixed(1)}% potential savings
                        </Badge>
                      </div>
                      <p className="text-sm">{rec.recommendation}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleApplyRecommendation(rec.id)}>
                      Apply
                    </Button>
                  </div>
                ))}

                {recommendations.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <ThermometerIcon className="mx-auto h-12 w-12 mb-2" />
                    <p>No recommendations available at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
