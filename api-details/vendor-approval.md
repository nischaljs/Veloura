# Vendor Approval & Rejection APIs (Admin)

## 1. Approve Vendor

### Endpoint
`PUT /api/admin/vendors/{vendorId}/approve`

### Description
Approve a vendor registration. Only accessible by admin users.

### Request
- **Headers:**
  - `Authorization: Bearer <admin_token>`
- **Path Parameter:**
  - `vendorId` (integer): The ID of the vendor to approve.

### Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Vendor approved successfully",
  "data": {
    "vendor": { ...vendorObject }
  }
}
```

### Example
```bash
curl -X PUT http://localhost:5000/api/admin/vendors/7/approve \
  -H "Authorization: Bearer <admin_token>"
```

---

## 2. Reject Vendor

### Endpoint
`PUT /api/admin/vendors/{vendorId}/reject`

### Description
Reject a vendor registration. Only accessible by admin users.

### Request
- **Headers:**
  - `Authorization: Bearer <admin_token>`
- **Path Parameter:**
  - `vendorId` (integer): The ID of the vendor to reject.

### Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Vendor rejected successfully",
  "data": {
    "vendor": { ...vendorObject }
  }
}
```

### Example
```bash
curl -X PUT http://localhost:5000/api/admin/vendors/7/reject \
  -H "Authorization: Bearer <admin_token>"
```

## Notes
- Only admins can approve or reject vendors.
- Approving sets `isApproved: true` and updates `approvedAt`.
- Rejecting sets `isApproved: false` and clears `approvedAt`. 