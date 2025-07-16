# Order Placement API

## Endpoint

`POST /api/orders`

## Description
Place a new order as a customer. The order can be created from cart items or by specifying items directly.

## Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "items": [
    { "productId": 10, "quantity": 2 }
  ],
  "shippingAddress": {
    "recipientName": "string",
    "phone": "string",
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "paymentMethod": "KHALTI" | "ESEWA" | "COD" | "CARD",
  "customerNote": "string (optional)"
}
```

## Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": { ...orderObject }
  }
}
```
- **Failure (400):**
```json
{
  "success": false,
  "message": "Cart is empty" // or other error message
}
```

## Example
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "items": [{"productId": 10, "quantity": 2}],
    "shippingAddress": {"recipientName": "Alice Smith", "phone": "9800000000", "street": "Test Street", "city": "Kathmandu", "state": "Bagmati", "postalCode": "44600", "country": "Nepal"},
    "paymentMethod": "KHALTI",
    "customerNote": ""
  }'
```

## Notes
- The backend will reduce product stock and update product status accordingly.
- The order will appear in both customer and vendor dashboards.
- Payment is handled in a separate step after order creation. 