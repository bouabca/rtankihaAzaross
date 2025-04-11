"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, User, RefreshCw, Shield, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Import mock data
import { MOCK_CAMERAS, MOCK_FACE_EVENTS } from "@/lib/mock-data"

export function CameraFeed() {
  const [cameras, setCameras] = useState(MOCK_CAMERAS)
  const [faceEvents, setFaceEvents] = useState(MOCK_FACE_EVENTS)
  const [loading, setLoading] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState(MOCK_CAMERAS[0])
  const { toast } = useToast()

  // Simulate loading camera data
  useEffect(() => {
    const loadData = () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setCameras(MOCK_CAMERAS)
        setFaceEvents(MOCK_FACE_EVENTS)
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

  const handleRefresh = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Cameras Refreshed",
        description: "Camera feeds have been refreshed",
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Cameras</h2>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live">Live Feeds</TabsTrigger>
          <TabsTrigger value="recognition">Face Recognition</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cameras.map((camera) => (
              <Card
                key={camera.id}
                className={`cursor-pointer hover:border-primary transition-colors ${selectedCamera.id === camera.id ? "border-primary" : ""}`}
                onClick={() => setSelectedCamera(camera)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{camera.name}</CardTitle>
                    <Badge variant={camera.status === "online" ? "default" : "secondary"}>{camera.status}</Badge>
                  </div>
                  <CardDescription>{camera.location}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    {camera.status === "online" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Placeholder for camera feed */}
                        <img
                          src={`/placeholder.svg?height=180&width=320&text=Camera+Feed`}
                          alt={`${camera.name} feed`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center space-x-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span>LIVE</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Camera className="h-12 w-12 text-muted-foreground opacity-50" />
                        <span className="absolute mt-16 text-sm text-muted-foreground">Feed Unavailable</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last motion: {formatTime(camera.lastMotion)}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Selected Camera: {selectedCamera.name}</CardTitle>
              <CardDescription>{selectedCamera.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                {selectedCamera.status === "online" ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`/placeholder.svg?height=400&width=800&text=Camera+Feed+(${selectedCamera.name})`}
                      alt={`${selectedCamera.name} feed`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span>LIVE</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-16 w-16 text-muted-foreground opacity-50" />
                    <span className="absolute mt-24 text-muted-foreground">Feed Unavailable</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Snapshot
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <Badge variant={selectedCamera.status === "online" ? "default" : "secondary"}>
                {selectedCamera.status}
              </Badge>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="recognition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Face Recognition Events</CardTitle>
              <CardDescription>Recent face recognition events from all cameras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faceEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.personName}</p>
                        <Badge variant={event.authorized ? "default" : "destructive"}>
                          {event.authorized ? "Authorized" : "Unauthorized"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Detected at {event.cameraName} • {formatTime(event.timestamp)}
                      </p>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-muted-foreground">Confidence:</span>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${event.confidence > 0.9 ? "bg-green-500" : event.confidence > 0.7 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${event.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span>{Math.round(event.confidence * 100)}%</span>
                      </div>
                    </div>
                    {!event.authorized && <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />}
                  </div>
                ))}

                {faceEvents.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <Shield className="mx-auto h-12 w-12 mb-2" />
                    <p>No face recognition events recorded</p>
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
