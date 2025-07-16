# Order Cancellation API

## Endpoint

`PUT /api/orders/{orderId}/cancel`

## Description
Cancel an order as a customer. Only allowed if the order is in `PENDING` or `PROCESSING` status.

## Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
  - `Content-Type: application/json`
- **Path Parameter:**
  - `orderId` (integer): The ID of the order to cancel.
- **Body:**
```json
{
  "reason": "string (required)"
}
```

## Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```
- **Failure (400/404):**
```json
{
  "success": false,
  "message": "Order cannot be cancelled" // or other error message
}
```

## Example
```bash
curl -X PUT http://localhost:5000/api/orders/21/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"reason": "Changed my mind"}'
```

## Notes
- Cancelling an order updates its status to `CANCELLED`.
- The vendor and customer will both see the updated status in their dashboards.
- Stock restoration is not automatic unless implemented in backend logic. 