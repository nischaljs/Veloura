# Vendor Approval & Admin APIs (Tested)

## 1. List Users (Admin)

### Endpoint
`GET /api/admin/users`

### Example
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <admin_token>"
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 19,
        "email": "vendorreg1@example.com",
        "firstName": "Vendor",
        "lastName": "Reg1",
        "phone": "9800000101",
        "avatar": null,
        "role": "VENDOR",
        "isActive": true,
        "createdAt": "2025-07-16T10:50:30.624Z",
        "lastLogin": null,
        "orderCount": 0,
        "totalSpent": 0
      },
      ...
    ],
    "pagination": { "page": 1, "limit": 20, "total": 7, "pages": 1 }
  }
}
```

---

## 2. List Vendors (Admin)

### Endpoint
`GET /api/admin/vendors`

### Example
```bash
curl -X GET http://localhost:5000/api/admin/vendors \
  -H "Authorization: Bearer <admin_token>"
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "id": 10,
        "businessName": "Vendor Reg1 Biz",
        "businessEmail": "vendorreg1biz@example.com",
        "businessPhone": "9800001101",
        "slug": "vendor-reg1-biz",
        "isApproved": true,
        "approvedAt": "2025-07-16T10:50:48.541Z",
        "rating": 0,
        "totalReviews": 0,
        "totalProducts": 0,
        "totalSales": 0,
        "createdAt": "2025-07-16T10:50:43.460Z",
        "user": {
          "firstName": "Vendor",
          "lastName": "Reg1",
          "email": "vendorreg1@example.com"
        }
      },
      ...
    ],
    "pagination": { "page": 1, "limit": 20, "total": 4, "pages": 1 }
  }
}
```

---

## 3. Approve Vendor (Admin)

### Endpoint
`PUT /api/admin/vendors/{vendorId}/approve`

### Example
```bash
curl -X PUT http://localhost:5000/api/admin/vendors/10/approve \
  -H "Authorization: Bearer <admin_token>"
```

### Response (200)
```json
{
  "success": true,
  "message": "Vendor approved successfully",
  "data": {
    "vendor": {
      "id": 10,
      "userId": 19,
      "businessName": "Vendor Reg1 Biz",
      "businessEmail": "vendorreg1biz@example.com",
      "businessPhone": "9800001101",
      "slug": "vendor-reg1-biz",
      "taxId": null,
      "description": "A test vendor registration.",
      "logo": null,
      "banner": null,
      "website": "https://vendorreg1.com",
      "facebook": null,
      "instagram": null,
      "twitter": null,
      "backgroundColor": null,
      "brandColor": null,
      "isApproved": true,
      "isAdminTeam": false,
      "approvedAt": "2025-07-16T10:53:00.297Z",
      "rating": 0,
      "totalReviews": 0,
      "createdAt": "2025-07-16T10:50:43.460Z",
      "updatedAt": "2025-07-16T10:53:00.299Z",
      "updatedBy": null
    }
  }
}
```

---

## Notes
- All endpoints above were tested with curl and passed.
- Admin token is required for all endpoints.
- See vendor registration doc for full vendor approval flow. 