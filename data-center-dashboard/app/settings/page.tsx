"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Settings, Save, Shield, Bell, Mail, Server, Database, Key, ThermometerIcon } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [generalSettings, setGeneralSettings] = useState({
    systemName: "DataGuard Access Control",
    companyName: "Acme Corporation",
    adminEmail: "admin@example.com",
    retentionDays: 90,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    accessDeniedAlerts: true,
    temperatureAlerts: true,
    systemUpdates: false,
    dailyReports: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipRestriction: false,
  })

  function handleSaveSettings() {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? <Save className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API & Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input
                  id="system-name"
                  value={generalSettings.systemName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={generalSettings.adminEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, adminEmail: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="retention-days">Data Retention (days)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  min="1"
                  value={generalSettings.retentionDays}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, retentionDays: Number.parseInt(e.target.value) })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Logs and events older than this will be automatically deleted
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="access-denied">Access Denied Alerts</Label>
                </div>
                <Switch
                  id="access-denied"
                  checked={notificationSettings.accessDeniedAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, accessDeniedAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ThermometerIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="temperature-alerts">Temperature Alerts</Label>
                </div>
                <Switch
                  id="temperature-alerts"
                  checked={notificationSettings.temperatureAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, temperatureAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="system-updates">System Update Notifications</Label>
                </div>
                <Switch
                  id="system-updates"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="daily-reports">Daily Reports</Label>
                </div>
                <Switch
                  id="daily-reports"
                  checked={notificationSettings.dailyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, dailyReports: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security settings for your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                </div>
                <Switch
                  id="two-factor"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  min="5"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings({ ...securitySettings, sessionTimeout: Number.parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input
                  id="password-expiry"
                  type="number"
                  min="30"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) =>
                    setSecuritySettings({ ...securitySettings, passwordExpiry: Number.parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="ip-restriction">IP Address Restriction</Label>
                </div>
                <Switch
                  id="ip-restriction"
                  checked={securitySettings.ipRestriction}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipRestriction: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API & Integration</CardTitle>
              <CardDescription>Manage API keys and external integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" type="password" value="sk_d9a72bfe4c6e49fba389c27a1c821b45" readOnly />
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>

              <div className="grid gap-2 pt-4">
                <Label>MQTT Configuration</Label>
                <div className="rounded-md border p-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Broker</span>
                      <span className="text-sm">mqtt.example.com</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Port</span>
                      <span className="text-sm">8883</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">TLS</span>
                      <span className="text-sm">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 pt-4">
                <Label>External Integrations</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">InfluxDB</span>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Grafana</span>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                API keys provide full access to your account. Keep them secure!
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
