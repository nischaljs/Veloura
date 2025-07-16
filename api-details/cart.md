# Cart API

## 1. Get Cart

**Endpoint:**
`GET /api/cart`

**Headers:**
- Authorization: Bearer <customer_token>

**Response (empty cart):**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": []
    }
  }
}
```

---

## 2. Add Item to Cart

**Endpoint:**
`POST /api/cart/add`

**Headers:**
- Authorization: Bearer <customer_token>
- Content-Type: application/json

**Body:**
```json
{
  "productId": 34,
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cartItem": {
      "id": 6,
      "cartId": 4,
      "productId": 34,
      "quantity": 2,
      "createdAt": "2025-07-16T11:52:32.968Z",
      "updatedAt": "2025-07-16T11:52:32.968Z"
    }
  }
}
```

---

## 3. Get Cart (with items)

**Endpoint:**
`GET /api/cart`

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": 4,
      "userId": 21,
      "createdAt": "2025-07-16T11:51:40.786Z",
      "updatedAt": "2025-07-16T11:51:40.786Z",
      "items": [
        {
          "id": 6,
          "cartId": 4,
          "productId": 34,
          "quantity": 2,
          "createdAt": "2025-07-16T11:52:32.968Z",
          "updatedAt": "2025-07-16T11:52:32.968Z",
          "product": {
            "id": 34,
            "vendorId": 14,
            "categoryId": 28,
            "name": "Hydrating Moisturizer",
            "slug": "hydrating-moisturizer",
            "description": "Lightweight moisturizer for daily use",
            "shortDescription": "Hydrates all skin types",
            "price": "25",
            "salePrice": "20",
            "costPrice": "15",
            "sku": "BB-MOIST-001",
            "stockQuantity": 100,
            "status": "ACTIVE",
            "isFeatured": true,
            "weight": 0.2,
            "length": null,
            "width": null,
            "height": null,
            "rating": 0,
            "reviewCount": 0,
            "createdAt": "2025-07-16T11:49:24.723Z",
            "updatedAt": "2025-07-16T11:49:24.723Z",
            "updatedBy": null
          }
        }
      ]
    }
  }
}
```

---

## 4. Update Cart Item Quantity

**Endpoint:**
`PUT /api/cart/:itemId`

**Headers:**
- Authorization: Bearer <customer_token>
- Content-Type: application/json

**Body:**
```json
{
  "quantity": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "cartItem": {
      "id": 6,
      "cartId": 4,
      "productId": 34,
      "quantity": 5,
      "createdAt": "2025-07-16T11:52:32.968Z",
      "updatedAt": "2025-07-16T11:52:47.087Z"
    }
  }
}
```

---

## 5. Remove Cart Item

**Endpoint:**
`DELETE /api/cart/:itemId`

**Headers:**
- Authorization: Bearer <customer_token>

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

---

## 6. Clear Cart

**Endpoint:**
`DELETE /api/cart`

**Headers:**
- Authorization: Bearer <customer_token>

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
``` 