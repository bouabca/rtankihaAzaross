// API client for interacting with the datacenter API
import { MOCK_DEVICES, MOCK_RFID_CARDS, MOCK_ACCESS_LOGS, MOCK_TELEMETRY_DATA } from "./mock-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Types
export interface Device {
  device_id: string
  name: string
  location: string
  capabilities: string[]
  firmware_version: string
  status?: {
    relay: boolean
    buzzer: boolean
    led: boolean
  }
  system?: {
    uptime: number
    wifi_signal: number
    battery: number
  }
}

export interface RFIDCard {
  card_id: string
  uid: string
  name: string
  access_level: number
  valid_from: string
  valid_until: string
  allowed_devices: string[]
  status: string
  created_at: string
}

export interface AccessLog {
  id: string
  device_id: string
  device_name: string
  timestamp: number
  card_uid: string
  user_name: string
  access_granted: boolean
  location: string
}

export interface TelemetryData {
  device_id: string
  timestamp: number
  sensors: {
    temperature: number
    humidity?: number
    motion_detected?: boolean
  }
}

// Authentication
export async function login(username: string, password: string) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock successful login
    const token = "mock_auth_token_" + Math.random().toString(36).substring(2)
    localStorage.setItem("auth_token", token)

    return { success: true, token }
  } catch (error) {
    throw new Error("Authentication failed")
  }
}

export async function logout() {
  localStorage.removeItem("auth_token")
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem("auth_token")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

// Devices
export async function getDevices(): Promise<Device[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_DEVICES
}

export async function getDevice(deviceId: string): Promise<Device> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const device = MOCK_DEVICES.find((d) => d.device_id === deviceId)
  if (!device) {
    throw new Error(`Device ${deviceId} not found`)
  }

  return device
}

export async function registerDevice(device: Omit<Device, "device_id">) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate a new device ID
  const deviceId = "dev_" + Math.random().toString(36).substring(2, 6)

  return {
    device_id: deviceId,
    ...device,
    status: {
      relay: false,
      buzzer: false,
      led: true,
    },
    system: {
      uptime: 0,
      wifi_signal: -65,
      battery: 100,
    },
  }
}

export async function updateDevice(deviceId: string, updates: Partial<Device>) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    device_id: deviceId,
    ...updates,
  }
}

export async function deleteDevice(deviceId: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

// Device control
export async function controlRelay(deviceId: string, state: boolean, duration?: number) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    device_id: deviceId,
    relay: state,
    duration: duration,
    success: true,
  }
}

export async function controlBuzzer(deviceId: string, state: boolean, duration?: number) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    device_id: deviceId,
    buzzer: state,
    duration: duration,
    success: true,
  }
}

export async function controlLed(deviceId: string, state: boolean) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    device_id: deviceId,
    led: state,
    success: true,
  }
}

// RFID Cards
export async function getRFIDCards(): Promise<RFIDCard[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_RFID_CARDS
}

export async function getRFIDCard(cardId: string): Promise<RFIDCard> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const card = MOCK_RFID_CARDS.find((c) => c.card_id === cardId)
  if (!card) {
    throw new Error(`RFID card ${cardId} not found`)
  }

  return card
}

export async function addRFIDCard(card: Omit<RFIDCard, "card_id" | "created_at" | "status">) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate a new card ID
  const cardId = "card_" + Math.random().toString(36).substring(2, 6)

  return {
    card_id: cardId,
    ...card,
    status: "active",
    created_at: new Date().toISOString(),
  }
}

export async function deleteRFIDCard(cardId: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

export async function syncRFIDCards(deviceId: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    device_id: deviceId,
    cards_synced: MOCK_RFID_CARDS.length,
    success: true,
  }
}

// Access Logs
export async function getAccessLogs(from?: string, to?: string): Promise<AccessLog[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // If from/to dates are provided, filter the logs
  if (from || to) {
    const fromTime = from ? new Date(from).getTime() / 1000 : 0
    const toTime = to ? new Date(to).getTime() / 1000 : Number.MAX_SAFE_INTEGER

    return MOCK_ACCESS_LOGS.filter((log) => log.timestamp >= fromTime && log.timestamp <= toTime)
  }

  return MOCK_ACCESS_LOGS
}

// Telemetry Data
export async function getTemperatureData(from?: string, to?: string): Promise<TelemetryData[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // If from/to dates are provided, filter the data
  if (from || to) {
    const fromTime = from ? new Date(from).getTime() / 1000 : 0
    const toTime = to ? new Date(to).getTime() / 1000 : Number.MAX_SAFE_INTEGER

    return MOCK_TELEMETRY_DATA.filter((data) => data.timestamp >= fromTime && data.timestamp <= toTime)
  }

  return MOCK_TELEMETRY_DATA
}

export async function getMotionData(from?: string, to?: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter telemetry data to only include entries with motion_detected
  const motionData = MOCK_TELEMETRY_DATA.filter((data) => data.sensors.motion_detected !== undefined).map((data) => ({
    device_id: data.device_id,
    timestamp: data.timestamp,
    motion_detected: data.sensors.motion_detected,
  }))

  // If from/to dates are provided, filter the data
  if (from || to) {
    const fromTime = from ? new Date(from).getTime() / 1000 : 0
    const toTime = to ? new Date(to).getTime() / 1000 : Number.MAX_SAFE_INTEGER

    return motionData.filter((data) => data.timestamp >= fromTime && data.timestamp <= toTime)
  }

  return motionData
}
