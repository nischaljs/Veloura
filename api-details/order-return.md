# Order Return API

## Endpoint

`POST /api/orders/{orderId}/return`

## Description
Request a return for a delivered order as a customer. Only allowed if the order status is `DELIVERED`.

## Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
  - `Content-Type: application/json`
- **Path Parameter:**
  - `orderId` (integer): The ID of the order to return.
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
  "message": "Return request submitted successfully"
}
```
- **Failure (400/404):**
```json
{
  "success": false,
  "message": "Order cannot be returned" // or other error message
}
```

## Example
```bash
curl -X POST http://localhost:5000/api/orders/20/return \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"reason": "Defective item"}'
```

## Notes
- Only orders with status `DELIVERED` can be returned.
- The order status will be updated to `RETURNED`.
- The vendor and customer will both see the updated status in their dashboards. 