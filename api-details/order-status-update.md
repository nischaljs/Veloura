# Order Status Update API (Admin/Vendor)

## Endpoints

- **Admin:**
  - `PUT /api/orders/admin/orders/{orderId}/status`
- **Vendor:**
  - `PUT /api/orders/vendors/orders/{orderId}/status`

## Description
Update the status of an order as an admin or vendor. Used for marking orders as `PROCESSING`, `SHIPPED`, `DELIVERED`, etc.

## Request
- **Headers:**
  - `Authorization: Bearer <admin_token>` or `Bearer <vendor_token>`
  - `Content-Type: application/json`
- **Path Parameter:**
  - `orderId` (integer): The ID of the order to update.
- **Body:**
```json
{
  "status": "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | ...
}
```

## Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Order status updated"
}
```
- **Failure (400/404/403):**
```json
{
  "success": false,
  "message": "Order not found" // or other error message
}
```

## Example (Admin)
```bash
curl -X PUT http://localhost:5000/api/orders/admin/orders/10/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"status": "DELIVERED"}'
```
**Response:**
```json
{
  "success": true,
  "message": "Order status updated"
}
```

## Example (Vendor)
```bash
curl -X PUT http://localhost:5000/api/orders/vendors/orders/10/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <vendor_token>" \
  -d '{"status": "SHIPPED"}'
```
**Response:**
```json
{
  "success": true,
  "message": "Order status updated"
}
```

## Notes
- Only admins or vendors associated with the order can update its status.
- Vendors can only update the status for orders that contain their products.
- The allowed statuses are: `DRAFT`, `PENDING`, `RESERVED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `RETURNED`.
- Customers see the updated status in their dashboard. 