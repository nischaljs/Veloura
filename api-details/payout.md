# Payout APIs

## 1. Request Payout (Vendor)

### Endpoint
`POST /api/vendors/payout-requests`

### Description
Allows a vendor to request a payout of their available earnings. The amount requested must not exceed the vendor's available balance, which is calculated from delivered and paid orders minus commissions and previous payouts.

### Request
- **Headers:**
  - `Authorization: Bearer <vendor_token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "amount": 100.00
}
```

### Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Payout request submitted",
  "data": {
    "payout": {
      "id": 7,
      "vendorId": 17,
      "amount": "100",
      "status": "PENDING",
      "createdAt": "2025-07-16T13:22:59.417Z",
      "updatedAt": "2025-07-16T13:22:59.417Z",
      "updatedBy": null
    }
  }
}
```
- **Failure (400):**
```json
{
  "success": false,
  "message": "Amount exceeds available balance. Available: 0.00"
}
```

### Example
```bash
curl -X POST http://localhost:5000/api/vendors/payout-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <vendor_token>" \
  -d '{"amount": 100}'
```

## 2. Get Payout Requests (Vendor)

### Endpoint
`GET /api/vendors/payout-requests`

### Description
Allows a vendor to view their submitted payout requests.

### Request
- **Headers:**
  - `Authorization: Bearer <vendor_token>`

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "payouts": [
      {
        "id": 7,
        "vendorId": 17,
        "amount": "100",
        "status": "PENDING",
        "createdAt": "2025-07-16T13:22:59.417Z",
        "updatedAt": "2025-07-16T13:22:59.417Z",
        "updatedBy": null,
        "vendor": {
          "businessName": "Payout Vendor Biz"
        }
      }
    ]
  }
}
```

### Example
```bash
curl -X GET http://localhost:5000/api/vendors/payout-requests \
  -H "Authorization: Bearer <vendor_token>"
```

## 3. Get Payout Requests (Admin)

### Endpoint
`GET /api/admin/payout-requests`

### Description
Allows an admin to view all payout requests, with optional filtering and pagination.

### Request
- **Headers:**
  - `Authorization: Bearer <admin_token>`
- **Query Parameters (optional):**
  - `page`, `limit`, `status`, `vendorId`

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "payouts": [
      {
        "id": 7,
        "vendorId": 17,
        "amount": "100",
        "status": "PENDING",
        "createdAt": "2025-07-16T13:22:59.417Z",
        "updatedAt": "2025-07-16T13:22:59.417Z",
        "updatedBy": null,
        "vendor": {
          "id": 17,
          "businessName": "Payout Vendor Biz",
          "businessEmail": "payoutvendor@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

### Example
```bash
curl -X GET http://localhost:5000/api/admin/payout-requests \
  -H "Authorization: Bearer <admin_token>"
```

## 4. Approve Payout Request (Admin)

### Endpoint
`PUT /api/admin/payout-requests/{id}/approve`

### Description
Allows an admin to approve a pending payout request. This changes the payout status to `PAID`.

### Request
- **Headers:**
  - `Authorization: Bearer <admin_token>`

### Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Payout request approved",
  "data": {
    "payout": {
      "id": 7,
      "vendorId": 17,
      "amount": "100",
      "status": "PAID",
      "createdAt": "2025-07-16T13:22:59.417Z",
      "updatedAt": "2025-07-16T13:23:15.112Z",
      "updatedBy": null
    }
  }
}
```
- **Failure (400):**
```json
{
  "success": false,
  "message": "Payout already approved" // or other error
}
```

### Example
```bash
curl -X PUT http://localhost:5000/api/admin/payout-requests/7/approve \
  -H "Authorization: Bearer <admin_token>"
```

## 5. Reject Payout Request (Admin)

### Endpoint
`PUT /api/admin/payout-requests/{id}/reject`

### Description
Allows an admin to reject a pending payout request. This changes the payout status to `REJECTED`.

### Request
- **Headers:**
  - `Authorization: Bearer <admin_token>`

### Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Payout request rejected",
  "data": {
    "payout": {
      "id": 7,
      "vendorId": 17,
      "amount": "100",
      "status": "REJECTED",
      "createdAt": "2025-07-16T13:22:59.417Z",
      "updatedAt": "2025-07-16T13:23:15.112Z",
      "updatedBy": null
    }
  }
}
```
- **Failure (400):**
```json
{
  "success": false,
  "message": "Payout already rejected" // or other error
}
```

### Example
```bash
curl -X PUT http://localhost:5000/api/admin/payout-requests/7/reject \
  -H "Authorization: Bearer <admin_token>"
```