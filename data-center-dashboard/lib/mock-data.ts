// Simplified mock data for the datacenter dashboard

// Device data
export const MOCK_DEVICES = [
  {
    device_id: "dev_001",
    name: "Main Entrance Controller",
    location: "Building A, Floor 1",
    capabilities: ["relay", "buzzer", "led", "rfid"],
    firmware_version: "2.3.1",
    status: {
      relay: false,
      buzzer: false,
      led: true,
    },
    system: {
      uptime: 1209600, // 14 days in seconds
      wifi_signal: -65,
      battery: 100,
    },
  },
  {
    device_id: "dev_002",
    name: "Server Room Access",
    location: "Building A, Floor 2",
    capabilities: ["relay", "buzzer", "led", "rfid", "temperature"],
    firmware_version: "2.3.1",
    status: {
      relay: false,
      buzzer: false,
      led: true,
    },
    system: {
      uptime: 864000, // 10 days in seconds
      wifi_signal: -58,
      battery: 100,
    },
  },
  {
    device_id: "dev_003",
    name: "Emergency Exit",
    location: "Building A, Floor 2",
    capabilities: ["relay", "buzzer", "led"],
    firmware_version: "2.2.8",
    status: {
      relay: false,
      buzzer: false,
      led: true,
    },
    system: {
      uptime: 432000, // 5 days in seconds
      wifi_signal: -72,
      battery: 85,
    },
  },
]

// RFID card data
export const MOCK_RFID_CARDS = [
  {
    card_id: "card_001",
    uid: "a4:b5:c6:d7",
    name: "John Smith",
    access_level: 3, // Admin
    valid_from: "2023-01-01T00:00:00Z",
    valid_until: "2024-12-31T23:59:59Z",
    allowed_devices: ["*"], // All devices
    status: "active",
    created_at: "2023-01-01T09:00:00Z",
  },
  {
    card_id: "card_002",
    uid: "e8:f9:g0:h1",
    name: "Jane Doe",
    access_level: 2, // Manager
    valid_from: "2023-01-15T00:00:00Z",
    valid_until: "2024-06-30T23:59:59Z",
    allowed_devices: ["dev_001", "dev_002", "dev_003"],
    status: "active",
    created_at: "2023-01-15T10:30:00Z",
  },
  {
    card_id: "card_003",
    uid: "i2:j3:k4:l5",
    name: "Bob Johnson",
    access_level: 1, // User
    valid_from: "2023-02-01T00:00:00Z",
    valid_until: "2023-12-31T23:59:59Z",
    allowed_devices: ["dev_001", "dev_004"],
    status: "expired",
    created_at: "2023-02-01T14:15:00Z",
  },
]

// Access log data
export const MOCK_ACCESS_LOGS = [
  {
    id: "log_001",
    device_id: "dev_001",
    device_name: "Main Entrance Controller",
    timestamp: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
    card_uid: "a4:b5:c6:d7",
    user_name: "John Smith",
    access_granted: true,
    location: "Building A, Floor 1",
  },
  {
    id: "log_002",
    device_id: "dev_002",
    device_name: "Server Room Access",
    timestamp: Math.floor(Date.now() / 1000) - 900, // 15 minutes ago
    card_uid: "a4:b5:c6:d7",
    user_name: "John Smith",
    access_granted: true,
    location: "Building A, Floor 2",
  },
  {
    id: "log_003",
    device_id: "dev_001",
    device_name: "Main Entrance Controller",
    timestamp: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago
    card_uid: "e8:f9:g0:h1",
    user_name: "Jane Doe",
    access_granted: true,
    location: "Building A, Floor 1",
  },
  {
    id: "log_004",
    device_id: "dev_002",
    device_name: "Server Room Access",
    timestamp: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    card_uid: "i2:j3:k4:l5",
    user_name: "Bob Johnson",
    access_granted: false,
    location: "Building A, Floor 2",
  },
]

// Telemetry data
export const MOCK_TELEMETRY_DATA = [
  {
    device_id: "dev_002",
    timestamp: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
    sensors: {
      temperature: 22.5,
      humidity: 45,
      motion_detected: false,
    },
  },
  {
    device_id: "dev_002",
    timestamp: Math.floor(Date.now() / 1000) - 900, // 15 minutes ago
    sensors: {
      temperature: 22.7,
      humidity: 46,
      motion_detected: true,
    },
  },
]

// Camera data
export const MOCK_CAMERAS = [
  {
    id: "cam_01",
    name: "Main Entrance",
    location: "Building A, Floor 1",
    status: "online",
    lastMotion: new Date().getTime() - 1000 * 60 * 5, // 5 minutes ago
  },
  {
    id: "cam_02",
    name: "Server Room",
    location: "Building A, Floor 2",
    status: "online",
    lastMotion: new Date().getTime() - 1000 * 60 * 15, // 15 minutes ago
  },
  {
    id: "cam_03",
    name: "Backup Generator",
    location: "Building B, Floor 1",
    status: "offline",
    lastMotion: new Date().getTime() - 1000 * 60 * 120, // 2 hours ago
  },
]

// Face recognition events
export const MOCK_FACE_EVENTS = [
  {
    id: "face_01",
    timestamp: new Date().getTime() - 1000 * 60 * 2, // 2 minutes ago
    cameraId: "cam_01",
    cameraName: "Main Entrance",
    personName: "John Smith",
    confidence: 0.98,
    authorized: true,
  },
  {
    id: "face_02",
    timestamp: new Date().getTime() - 1000 * 60 * 10, // 10 minutes ago
    cameraId: "cam_02",
    cameraName: "Server Room",
    personName: "Jane Doe",
    confidence: 0.95,
    authorized: true,
  },
  {
    id: "face_03",
    timestamp: new Date().getTime() - 1000 * 60 * 25, // 25 minutes ago
    cameraId: "cam_01",
    cameraName: "Main Entrance",
    personName: "Unknown Person",
    confidence: 0.45,
    authorized: false,
  },
]

// AC zones data
export const MOCK_AC_ZONES = [
  {
    id: "ac_01",
    name: "Server Room A",
    location: "Building A, Floor 2",
    status: "running",
    currentTemp: 21.5,
    targetTemp: 21.0,
    humidity: 45,
    power: 3.2, // kW
    mode: "cooling",
    fanSpeed: 2, // 1-3
    isAuto: true,
  },
  {
    id: "ac_02",
    name: "Server Room B",
    location: "Building A, Floor 2",
    status: "running",
    currentTemp: 22.1,
    targetTemp: 21.0,
    humidity: 48,
    power: 2.8, // kW
    mode: "cooling",
    fanSpeed: 2, // 1-3
    isAuto: true,
  },
  {
    id: "ac_03",
    name: "Network Room",
    location: "Building A, Floor 3",
    status: "idle",
    currentTemp: 23.4,
    targetTemp: 23.0,
    humidity: 52,
    power: 0.2, // kW (standby)
    mode: "cooling",
    fanSpeed: 1, // 1-3
    isAuto: true,
  },
]

// Energy usage data
export const MOCK_ENERGY_DATA = {
  today: 78.4, // kWh
  yesterday: 82.1, // kWh
  thisWeek: 542.6, // kWh
  lastWeek: 561.3, // kWh
  thisMonth: 2345.8, // kWh
  savingsPercent: 3.2, // %
}

// AI recommendations
export const MOCK_AI_RECOMMENDATIONS = [
  {
    id: "rec_01",
    zoneId: "ac_01",
    zoneName: "Server Room A",
    recommendation: "Increase target temperature by 1°C to save energy",
    potentialSavings: 5.2, // %
    impact: "low", // low, medium, high
  },
  {
    id: "rec_02",
    zoneId: "ac_02",
    zoneName: "Server Room B",
    recommendation: "Schedule maintenance - filter efficiency decreasing",
    potentialSavings: 3.8, // %
    impact: "medium", // low, medium, high
  },
]

// Maintenance prediction data
export const MOCK_MAINTENANCE_DATA = [
  {
    id: "maint_01",
    deviceId: "ac_01",
    deviceName: "Server Room A - AC Unit",
    deviceType: "Air Conditioner",
    healthScore: 87,
    nextMaintenanceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days from now
    maintenanceType: "Filter Replacement",
    priority: "medium",
    estimatedDowntime: 30, // minutes
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 75).toISOString(), // 75 days ago
  },
  {
    id: "maint_02",
    deviceId: "door_01",
    deviceName: "Main Entrance - Access Control",
    deviceType: "Door Controller",
    healthScore: 92,
    nextMaintenanceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days from now
    maintenanceType: "Routine Inspection",
    priority: "low",
    estimatedDowntime: 15, // minutes
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
  },
]

// Alert data
export const MOCK_ALERTS = [
  {
    id: "alert_01",
    timestamp: new Date().getTime() - 1000 * 60 * 5, // 5 minutes ago
    type: "security",
    severity: "high",
    title: "Unauthorized Access Attempt",
    description: "Multiple failed access attempts at Main Entrance",
    source: "RFID Reader - Main Entrance",
    status: "active",
    acknowledged: false,
  },
  {
    id: "alert_02",
    timestamp: new Date().getTime() - 1000 * 60 * 15, // 15 minutes ago
    type: "temperature",
    severity: "medium",
    title: "Temperature Above Threshold",
    description: "Server Room A temperature reached 26.5°C (threshold: 25°C)",
    source: "Temperature Sensor - Server Room A",
    status: "active",
    acknowledged: false,
  },
  {
    id: "alert_03",
    timestamp: new Date().getTime() - 1000 * 60 * 45, // 45 minutes ago
    type: "power",
    severity: "low",
    title: "UPS Switched to Battery",
    description: "UPS system switched to battery power for 30 seconds",
    source: "UPS System",
    status: "resolved",
    acknowledged: true,
    resolvedAt: new Date().getTime() - 1000 * 60 * 40, // 40 minutes ago
  },
]

// Alert settings
export const MOCK_ALERT_SETTINGS = {
  notifications: {
    email: true,
    sms: false,
    push: true,
    slack: true,
  },
  thresholds: {
    temperature: {
      enabled: true,
      high: 25,
      low: 18,
    },
    humidity: {
      enabled: true,
      high: 60,
      low: 30,
    },
    power: {
      enabled: true,
    },
    security: {
      enabled: true,
    },
  },
  recipients: [
    {
      id: "user_01",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      role: "Admin",
      notificationTypes: ["email", "sms", "push"],
    },
  ],
}
