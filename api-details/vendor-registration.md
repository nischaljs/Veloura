# Vendor Registration API

## 1. Register as User

### Endpoint
`POST /api/auth/register`

### Example
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "vendorreg2@example.com", "password": "VendorPass456", "firstName": "Vendor", "lastName": "Reg2", "phone": "9800000102"}'
```

#### Success Response (201)
```json
{
  "message": "User registered",
  "token": "<jwt_token>",
  "user": {
    "id": 20,
    "email": "vendorreg2@example.com",
    "firstName": "Vendor",
    "lastName": "Reg2",
    "role": "CUSTOMER"
  }
}
```
#### Failure Response (409)
```json
{"message": "Email already in use"}
```

---

## 2. Login as User

### Endpoint
`POST /api/auth/login`

### Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "vendorreg2@example.com", "password": "VendorPass456"}'
```

#### Success Response (200)
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 20,
    "email": "vendorreg2@example.com",
    "firstName": "Vendor",
    "lastName": "Reg2",
    "role": "CUSTOMER"
  }
}
```

---

## 3. Register as Vendor

### Endpoint
`POST /api/vendors/register`

### Example
```bash
curl -X POST http://localhost:5000/api/vendors/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user_token>" \
  -d '{"businessName": "Vendor Reg2 Biz", "businessEmail": "vendorreg2biz@example.com", "businessPhone": "9800001201", "description": "A test vendor registration 2.", "website": "https://vendorreg2.com"}'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Vendor registration submitted for approval",
  "data": {
    "vendor": {
      "id": 13,
      "userId": 20,
      "businessName": "Vendor Reg2 Biz",
      "businessEmail": "vendorreg2biz@example.com",
      "businessPhone": "9800001201",
      "slug": "vendor-reg2-biz",
      "taxId": null,
      "description": "A test vendor registration 2.",
      "logo": null,
      "banner": null,
      "website": "https://vendorreg2.com",
      "facebook": null,
      "instagram": null,
      "twitter": null,
      "backgroundColor": null,
      "brandColor": null,
      "isApproved": false,
      "isAdminTeam": false,
      "approvedAt": null,
      "rating": 0,
      "totalReviews": 0,
      "createdAt": "2025-07-16T11:31:33.513Z",
      "updatedAt": "2025-07-16T11:31:33.513Z",
      "updatedBy": null
    }
  }
}
```
#### Failure Response (Duplicate businessEmail)
```json
{"success":false,"message":"Server error","error":{"code":"P2002","meta":{"modelName":"Vendor","target":"Vendor_businessEmail_key"}}}
```
#### Failure Response (Duplicate userId)
```json
{"success":false,"message":"Server error","error":{"code":"P2002","meta":{"modelName":"Vendor","target":"Vendor_userId_key"}}}
```

---

## 4. Admin Approves Vendor

### Endpoint
`PUT /api/admin/vendors/{vendorId}/approve`

### Example
```bash
curl -X PUT http://localhost:5000/api/admin/vendors/13/approve \
  -H "Authorization: Bearer <admin_token>"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Vendor approved successfully",
  "data": {
    "vendor": {
      "id": 13,
      "userId": 20,
      "businessName": "Vendor Reg2 Biz",
      "businessEmail": "vendorreg2biz@example.com",
      "businessPhone": "9800001201",
      "slug": "vendor-reg2-biz",
      "taxId": null,
      "description": "A test vendor registration 2.",
      "logo": null,
      "banner": null,
      "website": "https://vendorreg2.com",
      "facebook": null,
      "instagram": null,
      "twitter": null,
      "backgroundColor": null,
      "brandColor": null,
      "isApproved": true,
      "isAdminTeam": false,
      "approvedAt": "2025-07-16T11:31:40.383Z",
      "rating": 0,
      "totalReviews": 0,
      "createdAt": "2025-07-16T11:31:33.513Z",
      "updatedAt": "2025-07-16T11:31:40.383Z",
      "updatedBy": null
    }
  }
}
```

---

## Notes
- Vendor registration requires an authenticated user.
- Each user can only register as a vendor once (userId is unique in the Vendor table).
- Each businessEmail must be unique.
- Admin approval requires a user with the `ADMIN` role and a valid admin token.
- All steps above were tested with curl and work as expected. 