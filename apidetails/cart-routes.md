# Cart & Wishlist Routes

Base path: `/cart`, `/wishlist`

## Cart Routes

### GET /cart
Get user cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "id": 1,
          "productId": 1,
          "variantId": 1,
          "quantity": 2,
          "product": {
            "id": 1,
            "name": "Product Name",
            "slug": "product-name",
            "price": 500.00,
            "salePrice": 450.00,
            "image": "https://example.com/product.jpg",
            "stockQuantity": 100,
            "vendor": {
              "businessName": "My Store",
              "slug": "my-store"
            }
          },
          "variant": {
            "name": "Color",
            "value": "Red",
            "priceDifference": 0,
            "stockQuantity": 50
          },
          "subtotal": 900.00
        }
      ],
      "summary": {
        "subtotal": 900.00,
        "shippingFee": 100.00,
        "taxAmount": 0.00,
        "discountAmount": 0.00,
        "total": 1000.00,
        "itemCount": 2
      }
    }
  }
}
```

### POST /cart/add
Add item to cart (requires authentication).

**Request Body:**
```json
{
  "productId": 1,
  "variantId": 1,
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
      "id": 1,
      "quantity": 2,
      "subtotal": 900.00
    }
  }
}
```

### PUT /cart/:itemId
Update cart item quantity (requires authentication).

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "cartItem": {
      "id": 1,
      "quantity": 3,
      "subtotal": 1350.00
    }
  }
}
```

### DELETE /cart/:itemId
Remove item from cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

### DELETE /cart
Clear cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

### POST /cart/apply-coupon
Apply coupon to cart (requires authentication).

**Request Body:**
```json
{
  "code": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "coupon": {
      "code": "SAVE10",
      "discountType": "percentage",
      "discountValue": 10,
      "discountAmount": 100.00
    },
    "summary": {
      "subtotal": 900.00,
      "shippingFee": 100.00,
      "taxAmount": 0.00,
      "discountAmount": 100.00,
      "total": 900.00
    }
  }
}
```

### DELETE /cart/coupon
Remove coupon from cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Coupon removed successfully"
}
```

### GET /cart/shipping-options
Get shipping options for cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "shippingOptions": [
      {
        "id": 1,
        "name": "Standard Delivery",
        "description": "3-5 business days",
        "fee": 100.00,
        "estimatedDays": "3-5"
      },
      {
        "id": 2,
        "name": "Express Delivery",
        "description": "1-2 business days",
        "fee": 200.00,
        "estimatedDays": "1-2"
      }
    ]
  }
}
```

### POST /cart/calculate-shipping
Calculate shipping for cart (requires authentication).

**Request Body:**
```json
{
  "shippingOptionId": 1,
  "address": {
    "city": "Kathmandu",
    "state": "Bagmati",
    "postalCode": "44600"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shippingFee": 100.00,
    "estimatedDelivery": "2024-01-20T00:00:00Z",
    "summary": {
      "subtotal": 900.00,
      "shippingFee": 100.00,
      "taxAmount": 0.00,
      "discountAmount": 100.00,
      "total": 900.00
    }
  }
}
```

## Wishlist Routes

### GET /wishlist
Get user wishlist (requires authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "wishlist": [
      {
        "id": 1,
        "productId": 1,
        "addedAt": "2024-01-15T10:30:00Z",
        "product": {
          "id": 1,
          "name": "Product Name",
          "slug": "product-name",
          "price": 500.00,
          "salePrice": 450.00,
          "image": "https://example.com/product.jpg",
          "stockQuantity": 100,
          "rating": 4.5,
          "reviewCount": 25,
          "vendor": {
            "businessName": "My Store",
            "slug": "my-store"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 25,
      "pages": 3
    }
  }
}
```

### POST /wishlist/add
Add item to wishlist (requires authentication).

**Request Body:**
```json
{
  "productId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to wishlist successfully"
}
```

### DELETE /wishlist/:itemId
Remove item from wishlist (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Item removed from wishlist successfully"
}
```

### DELETE /wishlist
Clear wishlist (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Wishlist cleared successfully"
}
```

### POST /wishlist/:itemId/move-to-cart
Move wishlist item to cart (requires authentication).

**Request Body:**
```json
{
  "variantId": 1,
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item moved to cart successfully"
}
```

### POST /wishlist/move-all-to-cart
Move all wishlist items to cart (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "All items moved to cart successfully",
  "data": {
    "movedItems": 5,
    "failedItems": 0
  }
}
```

## Cart & Wishlist Analytics

### GET /cart/analytics
Get cart analytics (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalItems": 5,
      "totalValue": 2500.00,
      "averageItemValue": 500.00,
      "mostAddedProduct": {
        "id": 1,
        "name": "Popular Product",
        "timesAdded": 10
      },
      "cartAbandonmentRate": 15.5
    }
  }
}
```

### GET /wishlist/analytics
Get wishlist analytics (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalItems": 25,
      "totalValue": 12500.00,
      "averageItemValue": 500.00,
      "mostWishlistedProduct": {
        "id": 1,
        "name": "Popular Product",
        "timesWishlisted": 50
      },
      "conversionRate": 20.5
    }
  }
}
```

## Guest Cart Routes (Session-based)

### GET /cart/guest
Get guest cart (session-based).

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "sessionId": "session_123456",
      "items": [
        {
          "productId": 1,
          "variantId": 1,
          "quantity": 2,
          "product": {
            "id": 1,
            "name": "Product Name",
            "price": 500.00,
            "salePrice": 450.00,
            "image": "https://example.com/product.jpg"
          }
        }
      ],
      "summary": {
        "subtotal": 900.00,
        "total": 900.00,
        "itemCount": 2
      }
    }
  }
}
```

### POST /cart/guest/add
Add item to guest cart.

**Request Body:**
```json
{
  "productId": 1,
  "variantId": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully"
}
```

### POST /cart/guest/merge
Merge guest cart with user cart (requires authentication).

**Request Body:**
```json
{
  "sessionId": "session_123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart merged successfully",
  "data": {
    "mergedItems": 3,
    "totalItems": 5
  }
}
``` 