g# Payment Management Routes (Simplified)

Base path: `/payments`

## POST /payments/khalti/initiate
Initiate Khalti payment.

**Request Body:**
```json
{
  "orderId": 1,
  "returnUrl": "https://example.com/payment/success",
  "cancelUrl": "https://example.com/payment/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://khalti.com/pay/pidx_1234567890"
  }
}
```

## POST /payments/khalti/verify
Verify Khalti payment.

**Request Body:**
```json
{
  "pidx": "pidx_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "transactionId": "TXN123456",
    "amount": 1100.00
  }
}
```

## POST /payments/esewa/initiate
Initiate eSewa payment.

**Request Body:**
```json
{
  "orderId": 1,
  "returnUrl": "https://example.com/payment/success",
  "cancelUrl": "https://example.com/payment/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formHtml": "<form>...</form>"
  }
}
```

## POST /payments/esewa/verify
Verify eSewa payment.

**Request Body:**
```json
{
  "token": "esewa_token_123",
  "refId": "ref_123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "transactionId": "ref_123456",
    "amount": 1100.00
  }
}
```

## POST /payments/cod/confirm
Confirm Cash on Delivery payment.

**Request Body:**
```json
{
  "orderId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "PENDING",
    "method": "COD"
  }
}
```

---

**Notes:**
- The backend fetches order details and user info based on authentication and orderId.
- Amount and customer info are NOT sent from the frontend, but are determined server-side.
- Only core payment flows are included for simplicity. 