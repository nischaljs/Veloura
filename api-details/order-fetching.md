# Order Fetching APIs

## 1. Fetch Customer Orders

### Endpoint
`GET /api/orders`

### Description
Fetch a paginated list of orders for the authenticated customer.

### Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
- **Query Parameters (optional):**
  - `page`, `limit`, `status`, `paymentStatus`

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "orders": [ ... ],
    "pagination": { ... }
  }
}
```

### Example
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer <customer_token>"
```

---

## 2. Fetch Vendor Orders

### Endpoint
`GET /api/orders/vendors/orders`

### Description
Fetch a paginated list of orders for the authenticated vendor (orders containing their products).

### Request
- **Headers:**
  - `Authorization: Bearer <vendor_token>`
- **Query Parameters (optional):**
  - `page`, `limit`, `status`, `paymentStatus`

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "orders": [ ... ],
    "pagination": { ... }
  }
}
```

### Example
```bash
curl -X GET http://localhost:5000/api/orders/vendors/orders \
  -H "Authorization: Bearer <vendor_token>"
```

---

## 3. Fetch Single Order (Customer)

### Endpoint
`GET /api/orders/{orderId}`

### Description
Fetch details of a single order for the authenticated customer.

### Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
- **Path Parameter:**
  - `orderId` (integer)

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "order": { ... }
  }
}
```

### Example
```bash
curl -X GET http://localhost:5000/api/orders/20 \
  -H "Authorization: Bearer <customer_token>"
```

---

## 4. Fetch Single Order (Vendor)

### Endpoint
`GET /api/orders/vendors/orders/{orderId}`

### Description
Fetch details of a single order for the authenticated vendor (if it contains their products).

### Request
- **Headers:**
  - `Authorization: Bearer <vendor_token>`
- **Path Parameter:**
  - `orderId` (integer)

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "order": { ... }
  }
}
```

### Example
```bash
curl -X GET http://localhost:5000/api/orders/vendors/orders/20 \
  -H "Authorization: Bearer <vendor_token>"
```

## Notes
- Both customer and vendor can see the latest status and details of the order.
- Pagination and filtering are supported for list endpoints. 