"use client"

import { useState, useEffect } from "react"
import { getAccessLogs, type AccessLog } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { History, RefreshCw, Download, Filter, User, DoorOpen, Calendar, MapPin } from "lucide-react"

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState(format(new Date(new Date().setDate(new Date().getDate() - 7)), "yyyy-MM-dd"))
  const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const { toast } = useToast()

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      setLoading(true)
      const from = fromDate ? `${fromDate}T00:00:00Z` : undefined
      const to = toDate ? `${toDate}T23:59:59Z` : undefined

      const data = await getAccessLogs(from, to)
      setLogs(data)
    } catch (error) {
      console.error("Error fetching access logs:", error)
      toast({
        title: "Error",
        description: "Failed to load access logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleExportCSV() {
    // Create CSV content
    const headers = ["Timestamp", "User", "Device", "Location", "Access"]
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          format(new Date(log.timestamp * 1000), "yyyy-MM-dd HH:mm:ss"),
          log.user_name || "Unknown",
          log.device_name,
          log.location,
          log.access_granted ? "Granted" : "Denied",
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `access_logs_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Access Logs</h2>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Logs</CardTitle>
          <CardDescription>Filter access logs by date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="from-date">From Date</Label>
              <Input id="from-date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="to-date">To Date</Label>
              <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchLogs}>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access History</CardTitle>
          <CardDescription>Recent access events for all devices</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(log.timestamp * 1000), "MMM d, yyyy HH:mm:ss")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{log.user_name || "Unknown User"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <DoorOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{log.device_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{log.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.access_granted ? "default" : "destructive"}>
                        {log.access_granted ? "Granted" : "Denied"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <History className="h-8 w-8 mb-2" />
                        <p>No access logs found for the selected period</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
