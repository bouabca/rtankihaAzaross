"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Bell, AlertCircle, CheckCircle, RefreshCw, ThermometerIcon, Shield, Zap } from "lucide-react"

// Replace the mock data imports with imports from our centralized mock data file
import { MOCK_ALERTS, MOCK_ALERT_SETTINGS } from "@/lib/mock-data"

export function AlertSystem() {
  // Update the useState calls to use the imported mock data
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const [alertSettings, setAlertSettings] = useState(MOCK_ALERT_SETTINGS)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Simulate loading data
  useEffect(() => {
    const loadData = () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setAlerts(MOCK_ALERTS)
        setAlertSettings(MOCK_ALERT_SETTINGS)
        setLoading(false)
      }, 1000)
    }

    loadData()
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: number) => {
    const now = new Date().getTime()
    const diff = now - timestamp

    if (diff < 1000 * 60) {
      return "Just now"
    } else if (diff < 1000 * 60 * 60) {
      return `${Math.floor(diff / (1000 * 60))} minutes ago`
    } else if (diff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(diff / (1000 * 60 * 60))} hours ago`
    } else {
      return new Date(timestamp).toLocaleDateString()
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-5 w-5" />
      case "temperature":
        return <ThermometerIcon className="h-5 w-5" />
      case "power":
        return <Zap className="h-5 w-5" />
      case "maintenance":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-100"
      case "medium":
        return "text-amber-500 bg-amber-100"
      case "low":
        return "text-blue-500 bg-blue-100"
      default:
        return "text-gray-500 bg-gray-100"
    }
  }

  const handleAcknowledge = (id: string) => {
    setAlerts(
      alerts.map((alert) => {
        if (alert.id === id) {
          toast({
            title: "Alert Acknowledged",
            description: `Alert "${alert.title}" has been acknowledged`,
          })
          return { ...alert, acknowledged: true }
        }
        return alert
      }),
    )
  }

  const handleResolve = (id: string) => {
    setAlerts(
      alerts.map((alert) => {
        if (alert.id === id) {
          toast({
            title: "Alert Resolved",
            description: `Alert "${alert.title}" has been marked as resolved`,
          })
          return {
            ...alert,
            status: "resolved",
            acknowledged: true,
            resolvedAt: new Date().getTime(),
          }
        }
        return alert
      }),
    )
  }

  const handleRefresh = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Alerts Refreshed",
        description: "Alert data has been refreshed",
      })
      setLoading(false)
    }, 1000)
  }

  const handleToggleNotification = (type: string, value: boolean) => {
    setAlertSettings({
      ...alertSettings,
      notifications: {
        ...alertSettings.notifications,
        [type]: value,
      },
    })

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notifications ${value ? "Enabled" : "Disabled"}`,
      description: `You will ${value ? "now" : "no longer"} receive ${type} notifications`,
    })
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active")
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Alert System</h2>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-sm text-muted-foreground">
              {activeAlerts.filter((a) => a.severity === "high").length} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Unacknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter((a) => !a.acknowledged).length}</div>
            <p className="text-sm text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                resolvedAlerts.filter((a) => {
                  const today = new Date()
                  const alertDate = new Date(a.resolvedAt || a.timestamp)
                  return (
                    alertDate.getDate() === today.getDate() &&
                    alertDate.getMonth() === today.getMonth() &&
                    alertDate.getFullYear() === today.getFullYear()
                  )
                }).length
              }
            </div>
            <p className="text-sm text-muted-foreground">Issues fixed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Alert Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(alerts.map((a) => a.type)).size}</div>
            <p className="text-sm text-muted-foreground">Different alert types</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Alerts that require attention or are being monitored</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.length > 0 ? (
                  activeAlerts
                    .sort((a, b) => {
                      // Sort by severity first (high to low)
                      const severityOrder = { high: 0, medium: 1, low: 2 }
                      if (
                        severityOrder[a.severity as keyof typeof severityOrder] !==
                        severityOrder[b.severity as keyof typeof severityOrder]
                      ) {
                        return (
                          severityOrder[a.severity as keyof typeof severityOrder] -
                          severityOrder[b.severity as keyof typeof severityOrder]
                        )
                      }
                      // Then by acknowledged status (unacknowledged first)
                      if (a.acknowledged !== b.acknowledged) {
                        return a.acknowledged ? 1 : -1
                      }
                      // Finally by timestamp (newest first)
                      return b.timestamp - a.timestamp
                    })
                    .map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${getSeverityColor(alert.severity)}`}
                        >
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{alert.title}</p>
                              {!alert.acknowledged && (
                                <Badge variant="outline" className="text-red-500">
                                  New
                                </Badge>
                              )}
                            </div>
                            <Badge
                              variant={
                                alert.severity === "high"
                                  ? "destructive"
                                  : alert.severity === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <span>{alert.source}</span>
                              <span>•</span>
                              <span>{formatTime(alert.timestamp)}</span>
                            </div>
                            <div className="flex space-x-2">
                              {!alert.acknowledged && (
                                <Button variant="ghost" size="sm" onClick={() => handleAcknowledge(alert.id)}>
                                  Acknowledge
                                </Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => handleResolve(alert.id)}>
                                Resolve
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <CheckCircle className="mx-auto h-12 w-12 mb-2" />
                    <p>No active alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
              <CardDescription>Alerts that have been resolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resolvedAlerts.length > 0 ? (
                  resolvedAlerts
                    .sort((a, b) => b.resolvedAt! - a.resolvedAt!) // Sort by resolved time, newest first
                    .map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-4 p-4 rounded-lg border bg-muted/30">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-500`}
                        >
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{alert.title}</p>
                            <Badge variant="outline">Resolved</Badge>
                          </div>
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <span>{alert.source}</span>
                              <span>•</span>
                              <span>Resolved {formatTime(alert.resolvedAt || alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <AlertCircle className="mx-auto h-12 w-12 mb-2" />
                    <p>No resolved alerts to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={alertSettings.notifications.email}
                    onCheckedChange={(checked) => handleToggleNotification("email", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={alertSettings.notifications.sms}
                    onCheckedChange={(checked) => handleToggleNotification("sms", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={alertSettings.notifications.push}
                    onCheckedChange={(checked) => handleToggleNotification("push", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="slack-notifications">Slack Notifications</Label>
                  </div>
                  <Switch
                    id="slack-notifications"
                    checked={alertSettings.notifications.slack}
                    onCheckedChange={(checked) => handleToggleNotification("slack", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
              <CardDescription>Configure when alerts are triggered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temp-alerts">Temperature Alerts</Label>
                    <Switch
                      id="temp-alerts"
                      checked={alertSettings.thresholds.temperature.enabled}
                      onCheckedChange={(checked) => {
                        setAlertSettings({
                          ...alertSettings,
                          thresholds: {
                            ...alertSettings.thresholds,
                            temperature: {
                              ...alertSettings.thresholds.temperature,
                              enabled: checked,
                            },
                          },
                        })
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="temp-high" className="text-sm">
                        High Threshold (°C)
                      </Label>
                      <input
                        id="temp-high"
                        type="number"
                        value={alertSettings.thresholds.temperature.high}
                        onChange={(e) => {
                          setAlertSettings({
                            ...alertSettings,
                            thresholds: {
                              ...alertSettings.thresholds,
                              temperature: {
                                ...alertSettings.thresholds.temperature,
                                high: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }}
                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        disabled={!alertSettings.thresholds.temperature.enabled}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="temp-low" className="text-sm">
                        Low Threshold (°C)
                      </Label>
                      <input
                        id="temp-low"
                        type="number"
                        value={alertSettings.thresholds.temperature.low}
                        onChange={(e) => {
                          setAlertSettings({
                            ...alertSettings,
                            thresholds: {
                              ...alertSettings.thresholds,
                              temperature: {
                                ...alertSettings.thresholds.temperature,
                                low: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }}
                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        disabled={!alertSettings.thresholds.temperature.enabled}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="humidity-alerts">Humidity Alerts</Label>
                    <Switch
                      id="humidity-alerts"
                      checked={alertSettings.thresholds.humidity.enabled}
                      onCheckedChange={(checked) => {
                        setAlertSettings({
                          ...alertSettings,
                          thresholds: {
                            ...alertSettings.thresholds,
                            humidity: {
                              ...alertSettings.thresholds.humidity,
                              enabled: checked,
                            },
                          },
                        })
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="humidity-high" className="text-sm">
                        High Threshold (%)
                      </Label>
                      <input
                        id="humidity-high"
                        type="number"
                        value={alertSettings.thresholds.humidity.high}
                        onChange={(e) => {
                          setAlertSettings({
                            ...alertSettings,
                            thresholds: {
                              ...alertSettings.thresholds,
                              humidity: {
                                ...alertSettings.thresholds.humidity,
                                high: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }}
                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        disabled={!alertSettings.thresholds.humidity.enabled}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="humidity-low" className="text-sm">
                        Low Threshold (%)
                      </Label>
                      <input
                        id="humidity-low"
                        type="number"
                        value={alertSettings.thresholds.humidity.low}
                        onChange={(e) => {
                          setAlertSettings({
                            ...alertSettings,
                            thresholds: {
                              ...alertSettings.thresholds,
                              humidity: {
                                ...alertSettings.thresholds.humidity,
                                low: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }}
                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        disabled={!alertSettings.thresholds.humidity.enabled}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="power-alerts">Power Alerts</Label>
                  <Switch
                    id="power-alerts"
                    checked={alertSettings.thresholds.power.enabled}
                    onCheckedChange={(checked) => {
                      setAlertSettings({
                        ...alertSettings,
                        thresholds: {
                          ...alertSettings.thresholds,
                          power: {
                            ...alertSettings.thresholds.power,
                            enabled: checked,
                          },
                        },
                      })
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="security-alerts">Security Alerts</Label>
                  <Switch
                    id="security-alerts"
                    checked={alertSettings.thresholds.security.enabled}
                    onCheckedChange={(checked) => {
                      setAlertSettings({
                        ...alertSettings,
                        thresholds: {
                          ...alertSettings.thresholds,
                          security: {
                            ...alertSettings.thresholds.security,
                            enabled: checked,
                          },
                        },
                      })
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
