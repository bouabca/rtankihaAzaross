/*****************************************************************************************
 *  ATM‑GUARDIAN  –  ESP32‑WROOM‑32  (COMPLETE SKETCH)
 *  Sensors : PIR (GPIO32) | DHT11 (GPIO25) | MFRC522 (SPI:18,19,23,21,22)
 *  Outputs : Relay (GPIO27) | Buzzer (GPIO26) | LED (GPIO33)
 *  Cloud   : Sends JSON to your local Node server every 5 s
 *****************************************************************************************/

 #include <SPI.h>
 #include <MFRC522.h>
 #include <DHT.h>
 #include <WiFi.h>
 #include <HTTPClient.h>
 #include <ArduinoJson.h>
 
 /* ────────── WIFI CREDENTIALS ────────── */
 #define WIFI_SSID ""
 #define WIFI_PASS ""
 
 /* ────────── REST API – CHANGE IP ────────── */
 #define API_URL  "http://.../api/telemetry"  // e.g., "http://192.168.1.20:4000/api/telemetry"
 #define API_KEY  ""  // If your server doesn't check a key, leave blank
 
 #define DEVICE_ID "atm-node-01"
 
 /* ---------- PIN DEFINITIONS ---------- */
 // MFRC522 (SPI)
 constexpr uint8_t PIN_SCK  = 18;
 constexpr uint8_t PIN_MISO = 19;
 constexpr uint8_t PIN_MOSI = 23;
 constexpr uint8_t PIN_SS   = 21;   // RFID CS
 constexpr uint8_t PIN_RST  = 22;
 
 constexpr uint8_t DHT_PIN  = 25;
 constexpr uint8_t DHT_TYPE = DHT11;
 
 constexpr uint8_t RELAY_PIN  = 27;   // IN pin of relay module
 constexpr uint8_t BUZZER_PIN = 26;
 constexpr uint8_t LED_PIN    = 33;
 constexpr uint8_t PIR_PIN    = 32;
 
 /* ---------- TIMINGS (ms) ---------- */
 const uint32_t SENSOR_PERIOD    = 2'000;   // read sensors every 2 s
 const uint32_t TELEMETRY_PERIOD = 5'000;   // push JSON every 5 s
 const uint32_t RELAY_PULSE_MS   = 3'000;   // relay ON time after RFID card
 
 /* ---------- OBJECTS ---------- */
 MFRC522 rfid(PIN_SS, PIN_RST);
 DHT     dht(DHT_PIN, DHT_TYPE);
 
 /* ---------- STATE ---------- */
 bool      motionDetected   = false;
 float     temperatureC     = NAN;
 String    lastUID          = "";
 uint32_t  relayOffAt       = 0;
 uint32_t  lastSensorRead   = 0;
 uint32_t  lastTelemetryOut = 0;
 
 /* ---------- FORWARD DECLARATIONS ---------- */
 void connectWiFi();
 void readSensors();
 void handleRFID();
 void handleRelayTimer();
 void pushTelemetry();
 
 /* ─────────────────────  SETUP  ───────────────────── */
 void setup() {
   Serial.begin(115200);
 
   pinMode(RELAY_PIN,  OUTPUT);
   pinMode(BUZZER_PIN, OUTPUT);
   pinMode(LED_PIN,    OUTPUT);
   pinMode(PIR_PIN,    INPUT);
 
   // Start all low (assuming relay is active‑HIGH)
   digitalWrite(RELAY_PIN,  LOW);
   digitalWrite(BUZZER_PIN, LOW);
   digitalWrite(LED_PIN,    LOW);
 
   SPI.begin(PIN_SCK, PIN_MISO, PIN_MOSI, PIN_SS);
   rfid.PCD_Init();
   dht.begin();
 
   connectWiFi();
 
   Serial.println(F("ATM‑Guardian – ESP32 is READY"));
 }
 
 /* ─────────────────────  LOOP  ───────────────────── */
 void loop() {
   uint32_t now = millis();
 
   // Periodic sensor read
   if (now - lastSensorRead >= SENSOR_PERIOD) {
     lastSensorRead = now;
     readSensors();
   }
 
   // RFID check
   handleRFID();
 
   // Non-blocking relay pulse
   handleRelayTimer();
 
   // Periodic telemetry push
   if (now - lastTelemetryOut >= TELEMETRY_PERIOD) {
     lastTelemetryOut = now;
     pushTelemetry();
   }
 }
 
 /* ────────────────── WIFI CONNECT ────────────────── */
 void connectWiFi() {
   WiFi.mode(WIFI_STA);
   WiFi.begin(WIFI_SSID, WIFI_PASS);
 
   Serial.print("Connecting to Wi‑Fi: ");
   Serial.println(WIFI_SSID);
 
   uint32_t t0 = millis();
   while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15'000) {
     delay(300);
     Serial.print('.');
   }
   if (WiFi.isConnected()) {
     Serial.print("\nWi‑Fi connected, IP = ");
     Serial.println(WiFi.localIP());
   } else {
     Serial.println("\nWi‑Fi FAILED (will retry later).");
   }
 }
 
 /* ────────────────── SENSOR READING ────────────────── */
 void readSensors() {
   // PIR
   motionDetected = digitalRead(PIR_PIN);
   digitalWrite(LED_PIN,    motionDetected);
   digitalWrite(BUZZER_PIN, motionDetected);
   if (motionDetected) Serial.println(F("Motion detected!"));
 
   // DHT
   float t = dht.readTemperature();
   if (!isnan(t)) {
     temperatureC = t;
     Serial.printf("Temp: %.1f °C\n", temperatureC);
   } else {
     Serial.println(F("DHT read failed"));
   }
 }
 
 /* ────────────────── RFID HANDLING ────────────────── */
 void handleRFID() {
   // Non-blocking check
   if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
 
   // Build UID string
   // Max UID length is 10 bytes → need 10*3 = 30 chars (+1 for null)
   char uidStr[31] = {0};
   for (byte i = 0; i < rfid.uid.size; i++) {
     sprintf(&uidStr[i * 3], "%02X ", rfid.uid.uidByte[i]);
   }
   lastUID = String(uidStr);
   Serial.printf("Card UID: %s\n", lastUID.c_str());
 
   // Relay pulse
   digitalWrite(RELAY_PIN, HIGH);           // active‑HIGH: on
   relayOffAt = millis() + RELAY_PULSE_MS;
 
   rfid.PICC_HaltA();
   rfid.PCD_StopCrypto1();
 }
 
 /* ───────────── NON-BLOCKING RELAY TIMER ──────────── */
 void handleRelayTimer() {
   if (relayOffAt && millis() > relayOffAt) {
     digitalWrite(RELAY_PIN, LOW);          // turn relay off
     relayOffAt = 0;
   }
 }
 
 /* ────────────────── PUSH TELEMETRY ────────────────── */
 void pushTelemetry() {
   if (WiFi.status() != WL_CONNECTED) {
     connectWiFi();
     if (WiFi.status() != WL_CONNECTED) return;  // still offline
   }
 
   // Prepare JSON
   StaticJsonDocument<256> doc;
   doc["device"] = DEVICE_ID;
   doc["motion"] = motionDetected;
   if (!isnan(temperatureC)) doc["temp"] = temperatureC;
   if (lastUID.length()) doc["uid"] = lastUID;
 
   String payload;
   serializeJson(doc, payload);
 
   // Send HTTP POST
   HTTPClient http;
   http.begin(API_URL);
   http.addHeader("Content-Type", "application/json");
   if (strlen(API_KEY)) http.addHeader("X-API-KEY", API_KEY);
 
   int code = http.POST(payload);
   Serial.printf("POST → HTTP %d\n", code);
   http.end();
 
   // Reset the lastUID (so it only sends once per card read)
   lastUID = "";
 }