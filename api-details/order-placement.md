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
    { "productId": 23, "quantity": 1 }
  ],
  "shippingAddress": {
    "recipientName": "Alice Smith",
    "phone": "9800000000",
    "street": "Test Street",
    "city": "Kathmandu",
    "state": "Bagmati",
    "postalCode": "44600",
    "country": "Nepal"
  },
  "paymentMethod": "KHALTI",
  "customerNote": ""
}
```

## Response
- **Success (200):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 21,
      "orderNumber": "ORD-1752664144725",
      "userId": 13,
      "status": "PENDING",
      "paymentMethod": "KHALTI",
      "paymentStatus": "PENDING",
      "subtotal": "20",
      "shippingFee": "156",
      "total": "178.6",
      "shippingAddress": {
        "recipientName": "Alice Smith",
        "phone": "9800000000",
        "street": "Test Street",
        "city": "Kathmandu",
        "state": "Bagmati",
        "postalCode": "44600",
        "country": "Nepal"
      },
      "customerNote": "",
      "completedAt": null,
      "createdAt": "2025-07-16T11:09:04.731Z",
      "updatedAt": "2025-07-16T11:09:04.731Z",
      "updatedBy": null,
      "items": [
        {
          "id": 23,
          "orderId": 21,
          "productId": 23,
          "quantity": 1,
          "price": "20",
          "salePrice": "20",
          "productSnapshot": {
            "id": 23,
            "name": "Hydrating Moisturizer",
            "slug": "hydrating-moisturizer",
            "price": 25,
            "salePrice": 20,
            "sku": "BB-MOIST-001"
          },
          "createdAt": "2025-07-16T11:09:04.731Z",
          "updatedAt": "2025-07-16T11:09:04.731Z",
          "updatedBy": null,
          "vendorId": 7
        }
      ]
    }
  }
}
```
- **Failure (400):**
```json
{
  "success": false,
  "message": "No items provided"
}
```

## Example
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "items": [{"productId": 23, "quantity": 1}],
    "shippingAddress": {"recipientName": "Alice Smith", "phone": "9800000000", "street": "Test Street", "city": "Kathmandu", "state": "Bagmati", "postalCode": "44600", "country": "Nepal"},
    "paymentMethod": "KHALTI",
    "customerNote": ""
  }'
```

## Notes
- The backend will reduce product stock and update product status accordingly.
- The order will appear in both customer and vendor dashboards.
- Payment is handled in a separate step after order creation. 