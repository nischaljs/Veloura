# Khalti Payment APIs

## 1. Initiate Khalti Payment

### Endpoint
`POST /api/payments/khalti/initiate`

### Description
Initiate a Khalti payment for an order. Returns a payment URL to redirect the user to Khalti.

### Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "orderId": 21,
  "returnUrl": "http://localhost:5173/orders/success?purchase_order_id=21",
  "cancelUrl": "http://localhost:5173/orders/cancel?purchase_order_id=21"
}
```

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://test-pay.khalti.com/?pidx=..."
  }
}
```

### Example
```bash
curl -X POST http://localhost:5000/api/payments/khalti/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"orderId": 21, "returnUrl": "http://localhost:5173/orders/success?purchase_order_id=21", "cancelUrl": "http://localhost:5173/orders/cancel?purchase_order_id=21"}'
```

---

## 2. Verify Khalti Payment

### Endpoint
`POST /api/payments/khalti/verify`

### Description
Verify a Khalti payment after the user is redirected back. Updates order/payment status.

### Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "pidx": "FVXJEZTpZ49P4FbPNHQS79",
  "orderId": 21
}
```

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "status": "COMPLETED" | "PENDING" | ...,
    "transactionId": "string",
    "amount": 317.8
  }
}
```

### Example
```bash
curl -X POST http://localhost:5000/api/payments/khalti/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"pidx": "FVXJEZTpZ49P4FbPNHQS79", "orderId": 21}'
```

### Notes
- The frontend must call the verify endpoint after Khalti redirects back.
- The backend will update the order/payment status accordingly.
- The payment URL and pidx are provided by Khalti. 