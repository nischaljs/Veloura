# Authentication APIs

## 1. Register

### Endpoint
`POST /api/auth/register`

### Request
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
```json
{
  "email": "testuser2@example.com",
  "password": "TestPass123",
  "firstName": "Test2",
  "lastName": "User2",
  "phone": "9800000002"
}
```

### Response
- **Success (201):**
```json
{
  "message": "User registered",
  "token": "<jwt_token>",
  "user": {
    "id": 18,
    "email": "testuser2@example.com",
    "firstName": "Test2",
    "lastName": "User2",
    "role": "CUSTOMER"
  }
}
```
- **Failure (409):**
```json
{"message": "Email already in use"}
```

### Example
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser2@example.com", "password": "TestPass123", "firstName": "Test2", "lastName": "User2", "phone": "9800000002"}'
```

---

## 2. Login

### Endpoint
`POST /api/auth/login`

### Request
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
```json
{
  "identifier": "testuser2@example.com",
  "password": "TestPass123"
}
```

### Response
- **Success (200):**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 18,
    "email": "testuser2@example.com",
    "firstName": "Test2",
    "lastName": "User2",
    "role": "CUSTOMER"
  }
}
```
- **Failure (401):**
```json
{"message": "Invalid credentials"}
```

### Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "testuser2@example.com", "password": "TestPass123"}'
```

---

## 3. Get Current User

### Endpoint
`GET /api/auth/me`

### Request
- **Headers:**
  - `Authorization: Bearer <jwt_token>`

### Response
- **Success (200):**
```json
{
  "user": {
    "id": 13,
    "email": "customer1@example.com",
    "firstName": "Anita",
    "lastName": "Sharma",
    "phone": "+977-9800000001",
    "avatar": "http://localhost:5000/images/users/customer1-avatar.jpg",
    "createdAt": "2025-07-16T10:38:39.585Z",
    "updatedAt": "2025-07-16T10:38:39.585Z",
    "updatedBy": null,
    "lastLogin": "2025-07-15T04:15:00.000Z",
    "isActive": true,
    "role": "CUSTOMER"
  }
}
```
- **Failure (401):**
```json
{"message": "Unauthorized"}
```

> **Note:** Sensitive fields like `passwordHash` are never included in the response.

### Example
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <jwt_token>"
```

---

## 4. Logout

### Endpoint
`POST /api/auth/logout`

### Request
- **Headers:**
  - `Authorization: Bearer <jwt_token>`

### Response
- **Success (200):**
```json
{"message": "Logged out"}
```

### Example
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Notes
- All endpoints were tested with curl and work as expected.
- The frontend uses the same endpoints and payloads for registration, login, get current user, and logout.
- JWT token is required for authenticated endpoints. 