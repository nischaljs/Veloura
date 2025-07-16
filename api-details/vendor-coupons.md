# Vendor Coupon Management APIs

## 1. Create Coupon

### Endpoint
`POST /api/vendors/coupons`

### Description
Create a new coupon as a vendor. Coupon will be linked to the vendor.

### Request
- **Headers:**
  - `Authorization: Bearer <vendor_token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "code": "VENDOR30",
  "description": "30% off for testing",
  "discountType": "percentage", // or "fixed"
  "discountValue": 30,
  "startDate": "2024-07-16T00:00:00.000Z",
  "endDate": "2024-07-31T23:59:59.000Z",
  "minOrderAmount": 100,
  "maxUses": 100
}
```

### Response
- **Success (201):**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": { "coupon": { ...couponObject } }
}
```

### Example
```bash
curl -X POST http://localhost:5000/api/vendors/coupons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <vendor_token>" \
  -d '{"code": "VENDOR30", "description": "30% off for testing", "discountType": "percentage", "discountValue": 30, "startDate": "2024-07-16T00:00:00.000Z", "endDate": "2024-07-31T23:59:59.000Z", "minOrderAmount": 100, "maxUses": 100}'
```

---

## 2. Delete Coupon

### Endpoint
`DELETE /api/vendors/coupons/{couponId}`

### Description
Delete a coupon as a vendor. Only allowed if the coupon belongs to the vendor.

### Request
- **Headers:**
  - `Authorization: Bearer <vendor_token>`
- **Path Parameter:**
  - `couponId` (integer): The ID of the coupon to delete.

### Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

### Example
```bash
curl -X DELETE http://localhost:5000/api/vendors/coupons/2 \
  -H "Authorization: Bearer <vendor_token>"
```

## Notes
- Coupon must be linked to the vendor to be deleted.
- Coupon creation and deletion are both authenticated vendor actions. 