# ITA (AI Teacher Assistant) - API Documentation

## Base URL

**Production:** `https://n8n.yarden-zamir.com/webhook/ita/api`  
**Testing:** `https://n8n.yarden-zamir.com/webhook-test/ita/api`

---

## Authentication

No authentication required. Sessions are identified by 5-letter codes.

---

## Endpoints

### 1. Create Session

Creates a new teaching session.

**Endpoint:** `POST /sessions/create`

**Request Body:**
```json
{
  "code": "ABCDE"
}
```

**Request Parameters:**

| Field | Type   | Required | Description                                |
|-------|--------|----------|--------------------------------------------|
| code  | string | Yes      | 5 uppercase letters (A-Z)                  |

**Success Response (200):**
```json
{
  "success": true,
  "sessionId": "uuid-here",
  "code": "ABCDE",
  "status": "waiting",
  "message": "Session created successfully",
  "createdAt": "2025-10-01T20:00:00.000Z",
  "expiresAt": "2025-10-02T20:00:00.000Z"
}
```

**Error Responses (200):**

Invalid code format:
```json
{
  "success": false,
  "error": "Invalid code format",
  "message": "Code must be exactly 5 uppercase letters (A-Z)"
}
```

Duplicate session:
```json
{
  "success": false,
  "error": "Session already exists",
  "message": "A session with code ABCDE already exists"
}
```

**Examples:**

PowerShell:
```powershell
Invoke-WebRequest -Method POST `
  -Uri https://n8n.yarden-zamir.com/webhook/ita/api/sessions/create `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"code":"ABCDE"}'
```

curl:
```bash
curl -X POST https://n8n.yarden-zamir.com/webhook/ita/api/sessions/create   -H "Content-Type: application/json"   -d '{"code":"ABCDE"}'
```

JavaScript (axios):
```javascript
const response = await axios.post(
  'https://n8n.yarden-zamir.com/webhook/ita/api/sessions/create',
  { code: 'ABCDE' }
);
```

---

### 2. Get Session Status

Retrieves current session status. Used by Windows app to poll for connection.

**Endpoint:** `GET /sessions/status`

**Query Parameters:**

| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| code      | string | Yes      | 5-letter session code   |

**Success Response (200):**
```json
{
  "success": true,
  "sessionId": "uuid-here",
  "code": "ABCDE",
  "status": "waiting",
  "createdAt": "2025-10-01T20:00:00.000Z",
  "expiresAt": "2025-10-02T20:00:00.000Z",
  "lastActivityAt": "2025-10-01T20:05:00.000Z",
  "webapp": {
    "connected": false,
    "deviceType": null,
    "lastPollAt": null
  },
  "windowsApp": {
    "lastPollAt": "2025-10-01T20:05:00.000Z"
  }
}
```

**When Webapp Connected:**
```json
{
  "success": true,
  "sessionId": "uuid-here",
  "code": "ABCDE",
  "status": "connected",
  "webapp": {
    "connected": true,
    "deviceType": "mobile",
    "lastPollAt": "2025-10-01T20:05:00.000Z"
  }
}
```

**Error Response (200):**
```json
{
  "success": false,
  "error": "Session not found",
  "message": "No session found with this code"
}
```

**Examples:**

PowerShell:
```powershell
Invoke-WebRequest -Method GET `
  -Uri "https://n8n.yarden-zamir.com/webhook/ita/api/sessions/status?code=ABCDE"
```

JavaScript (axios):
```javascript
const response = await axios.get(
  'https://n8n.yarden-zamir.com/webhook/ita/api/sessions/status',
  { params: { code: 'ABCDE' } }
);
```

---

### 3. Connect to Session

Connects a webapp/phone to an existing session.

**Endpoint:** `POST /sessions/connect`

**Query Parameters:**

| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| code      | string | Yes      | 5-letter session code   |

**Request Body:**
```json
{
  "deviceType": "mobile"
}
```

**Request Parameters:**

| Field      | Type   | Required | Description                                    |
|------------|--------|----------|------------------------------------------------|
| deviceType | string | No       | "mobile" or "desktop" (default: "unknown")     |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Connected successfully",
  "sessionId": "uuid-here",
  "code": "ABCDE",
  "status": "connected"
}
```

**Error Responses (200):**

Session not found:
```json
{
  "success": false,
  "error": "Session not found",
  "message": "No session found with code ABCDE"
}
```

Session already connected:
```json
{
  "success": false,
  "error": "Session already connected",
  "message": "This session is already in use"
}
```

**Examples:**

PowerShell:
```powershell
Invoke-WebRequest -Method POST `
  -Uri "https://n8n.yarden-zamir.com/webhook/ita/api/sessions/connect?code=ABCDE" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"deviceType":"mobile"}'
```

JavaScript (axios):
```javascript
const response = await axios.post(
  'https://n8n.yarden-zamir.com/webhook/ita/api/sessions/connect',
  { deviceType: 'mobile' },
  { params: { code: 'ABCDE' } }
);
```

---

## Complete Usage Flow

Typical Session Flow:

1. **Windows App Creates Session**  
   - `POST /sessions/create`  
   - Body: `{ "code": "ABCDE" }`  
   → Returns: `sessionId`, status: `"waiting"`

2. **Windows App Polls for Connection**  
   - `GET /sessions/status?code=ABCDE` (every 2–3 seconds)  
   → Returns: `webapp.connected: false`

3. **User Scans QR Code on Phone**  
   - QR contains: `{"type":"session","code":"ABCDE"}`  
   - Webapp extracts code from QR

4. **Webapp Connects to Session**  
   - `POST /sessions/connect?code=ABCDE`  
   - Body: `{ "deviceType": "mobile" }`  
   → Returns: `success: true`, status: `"connected"`

5. **Windows App Detects Connection**  
   - `GET /sessions/status?code=ABCDE`  
   → Returns: `webapp.connected: true`, status: `"connected"`

6. **Both Apps Show "Connected" State**

---

## Status Codes

All endpoints return HTTP **200 (OK)** even for errors.  
Check the `success` field in the response body.

- **Success Response:**
```json
{ "success": true, ... }
```

- **Error Response:**
```json
{ "success": false, "error": "...", "message": "..." }
```

---

## Session Lifecycle

- **Created:** Session created with `status: "waiting"`  
- **Connected:** Webapp connects, `status: "connected"`, `webapp.connected: true`  
- **Expired:** Auto-deleted after 24 hours  

---

## Data Types

### Session Status
- `"waiting"` - Session created, waiting for webapp connection  
- `"connected"` - Webapp has connected to the session  
- `"disconnected"` - Session ended  

### Device Type
- `"mobile"` - Smartphone or tablet  
- `"desktop"` - Desktop or laptop browser  
- `"unknown"` - Device type not specified  

---

## Rate Limiting

No rate limits currently enforced.  
Recommended polling interval: **2–3 seconds**.

---

## Error Handling

Always check the `success` field in responses:

```javascript
const response = await api.createSession('ABCDE');

if (response.success) {
  console.log('Session created:', response.sessionId);
} else {
  console.error('Error:', response.error, response.message);
}
```

---

## Testing

- Use `/webhook-test/` URL prefix for testing without saving data:  
  `https://n8n.yarden-zamir.com/webhook-test/ita/api/sessions/create`

- Use `/webhook/` for production:  
  `https://n8n.yarden-zamir.com/webhook/ita/api/sessions/create`

---

## Notes

- Session codes must be exactly **5 uppercase letters (A–Z)**  
- Sessions expire after **24 hours**  
- No authentication required  
- All timestamps in **ISO 8601 format (UTC)**  
- All responses are **JSON**

---

**Last Updated:** October 2, 2025  
**Version:** 1.0.0
