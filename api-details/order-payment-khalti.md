# Khalti Payment APIs

> **Note:** These endpoints require a valid `KHALTI_SECRET_KEY` environment variable and Khalti sandbox or production account. If not set, the API will return a 503 or 500 error ("Khalti payment gateway not configured").

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
  "orderId": 10,
  "returnUrl": "http://localhost:5173/orders/success?purchase_order_id=10",
  "cancelUrl": "http://localhost:5173/orders/cancel?purchase_order_id=10"
}
```

### Response (Success, if configured)
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://test-pay.khalti.com/?pidx=..."
  }
}
```

### Response (Failure, if not configured)
```json
{
  "success": false,
  "message": "Khalti payment gateway not configured"
}
```

### Example
```bash
curl -X POST http://localhost:5000/api/payments/khalti/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"orderId": 10, "returnUrl": "http://localhost:5173/orders/success?purchase_order_id=10", "cancelUrl": "http://localhost:5173/orders/cancel?purchase_order_id=10"}'
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
  "pidx": "vzCmdrVoa5eya5Ut2a5mZD",
  "orderId": 10
}
```

### Response (Success, if configured)
```json
{
  "success": true,
  "data": {
    "status": "PENDING",
    "transactionId": "",
    "amount": 0
  }
}
```

### Response (Failure, if not configured)
```json
{
  "success": false,
  "message": "Khalti payment gateway not configured"
}
```

> **Note:** If the payment is not completed, status may be `PENDING` and amount/transactionId may be empty. The backend will update the order/payment status accordingly after successful verification.

### Example
```bash
curl -X POST http://localhost:5000/api/payments/khalti/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{"pidx": "vzCmdrVoa5eya5Ut2a5mZD", "orderId": 10}'
```

### Notes
- The frontend must call the verify endpoint after Khalti redirects back.
- The backend will update the order/payment status accordingly.
- The payment URL and pidx are provided by Khalti.
- If you receive a 503/500 error, check your environment configuration. 