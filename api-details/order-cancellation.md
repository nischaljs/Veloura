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
  "reason": "string (required, ignored by backend)"
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

## Example (Success)
```bash
curl -X PUT http://localhost:5000/api/orders/20/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"reason": "Changed my mind"}'
```
**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

## Example (Failure)
```bash
curl -X PUT http://localhost:5000/api/orders/21/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"reason": "Too late"}'
```
**Response:**
```json
{
  "success": false,
  "message": "Order cannot be cancelled"
}
```

## Notes
- Cancelling an order updates its status to `CANCELLED`.
- The vendor and customer will both see the updated status in their dashboards.
- Stock restoration is not automatic unless implemented in backend logic.
- The `reason` field is accepted but not saved or used by the backend. 