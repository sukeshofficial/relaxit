# Phase 4 — Backrest Data & Device Telemetry Verification & Walkthrough

We have successfully completed all 15 steps of **Phase 4 — Backrest Data & Device Telemetry** (Steps 36 to 50).

---

## 🚀 Key Features Implemented in Phase 4

### 1. Relational Telemetry Data Models (Steps 36–40)
- **[SensorType](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/entity/SensorMeasurement.java#123-126) & `SessionStatus` & [PostureType](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/dto/device/PostureResponse.java#68-71) & `DeviceEventType`**: Strong domain enums.
- **[DeviceSession](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/entity/DeviceSession.java#21-178)**: Tracking sitting sessions with `startedAt`, `endedAt`, `durationSeconds`, and status (`ACTIVE`, `COMPLETED`, `INTERRUPTED`).
- **[SensorMeasurement](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/entity/SensorMeasurement.java#20-151)**: Time-series pressure matrix (4 zones), IMU, temperature, and battery readings with index on [(device_id, timestamp)](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/entity/PostureMeasurement.java#90-93).
- **[PostureMeasurement](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/entity/PostureMeasurement.java#20-138)**: Real-time posture score (0–100) and classification (`GOOD`, `SLOUCHING`, `LEANING_LEFT`, `LEANING_RIGHT`, `FORWARD_LEAN`).
- **[DeviceEvent](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/entity/DeviceEvent.java#20-125)**: Operational & telemetry event logging (`BATTERY_LOW`, `SENSOR_ERROR`, `FIRMWARE_UPDATE`).

### 2. Device Security & Provisioning (Steps 42 & 43)
- **`X-Device-Identifier` & `X-Device-Secret`**: Dedicated header-based device authentication.
- **BCrypt Hashed Secrets**: Device secret is never stored in plain text.
- **`POST /api/v1/devices/{id}/provision`**: Generates a 32-byte secure secret for physical backrest activation.

### 3. Ingestion, Posture Classification & Session Lifecycle (Steps 41, 44 & 45)
- **[TelemetryValidator](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/dto/telemetry/TelemetryValidator.java#8-73)**: Hardware sanity range validation (e.g. pressure 0–1023 kPa, temp -20–80°C).
- **[PostureEvaluator](file:///e:/SUKESH-PRODUCTS/relaxit/backend/src/main/java/com/relaxit/backend/service/PostureEvaluator.java#12-81)**: Real-time algorithm calculating posture scores and posture types from matrix pressure data.
- **`POST /api/v1/device-telemetry`**: Ingests telemetry, updates `lastSeenAt`, manages active sitting sessions, and saves sensor measurements.
- **`POST /api/v1/device-telemetry/heartbeat`**: Ping updating `status = ONLINE`.

### 4. User-Facing Analytics & Alerts (Steps 46, 47, 48 & 49)
- **Device Ownership Enforced**: Strict verification ensuring users can only access their own devices.
- **`GET /api/v1/devices/{deviceId}/sessions`**: Paginated sitting session history.
- **`GET /api/v1/devices/{deviceId}/posture`**: Posture history with ISO range filtering.
- **`GET /api/v1/devices/{deviceId}/statistics`**: Daily aggregated sitting minutes and posture performance score.
- **`GET /api/v1/devices/{deviceId}/alerts`**: Alerts log for posture warnings and device health.

---

## 🧪 Verification & Testing Instructions

Follow these step-by-step cURL commands to verify the full telemetry pipeline.

### Step 1: Login User & Get JWT Token
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```
*Save the returned `accessToken` as `$JWT`.*

---

### Step 2: Register & Provision a Physical Device
```bash
# 1. Register device
curl -X POST http://localhost:8080/api/v1/devices \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceIdentifier": "RELAXIT-BACKREST-9901",
    "name": "Office Smart Chair"
  }'

# 2. Provision device (Get X-Device-Secret)
curl -X POST http://localhost:8080/api/v1/devices/{deviceId}/provision \
  -H "Authorization: Bearer $JWT"
```
*Save the returned `deviceSecret` as `$SECRET`.*

---

### Step 3: Ingest Backrest Sensor Telemetry (Device Authentication)
```bash
curl -X POST http://localhost:8080/api/v1/device-telemetry \
  -H "X-Device-Identifier: RELAXIT-BACKREST-9901" \
  -H "X-Device-Secret: $SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2026-09-05T17:10:00",
    "readings": [
      { "sensorType": "PRESSURE_UL", "value": 150.0, "unit": "kPa" },
      { "sensorType": "PRESSURE_UR", "value": 145.0, "unit": "kPa" },
      { "sensorType": "PRESSURE_LL", "value": 200.0, "unit": "kPa" },
      { "sensorType": "PRESSURE_LR", "value": 195.0, "unit": "kPa" },
      { "sensorType": "BATTERY_LEVEL", "value": 88.0, "unit": "%" }
    ]
  }'
```

---

### Step 4: Query User-Facing Posture Analytics & Statistics
```bash
# 1. View sitting sessions
curl -X GET http://localhost:8080/api/v1/devices/{deviceId}/sessions \
  -H "Authorization: Bearer $JWT"

# 2. View real-time posture score & history
curl -X GET http://localhost:8080/api/v1/devices/{deviceId}/posture \
  -H "Authorization: Bearer $JWT"

# 3. View daily statistics summary
curl -X GET "http://localhost:8080/api/v1/devices/{deviceId}/statistics?date=2026-09-05" \
  -H "Authorization: Bearer $JWT"
```
