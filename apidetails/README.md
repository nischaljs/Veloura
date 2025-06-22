# Veloura E-commerce API Documentation

This document outlines all the API routes needed for the Veloura e-commerce platform.

## Base URL
```
http://localhost:5000/api/
```

## Authentication
Most routes require authentication via JWT token in cookies or Authorization header.

## Route Categories

### 1. Authentication Routes (`/auth`)
- User registration, login, logout, and profile management

### 2. User Management Routes (`/users`)
- User profile management, addresses, preferences

### 3. Vendor Management Routes (`/vendors`)
- Vendor registration, profile management, approval system

### 4. Product Management Routes (`/products`)
- Product CRUD operations, variants, images, attributes

### 5. Category Management Routes (`/categories`)
- Category hierarchy, attributes, featured categories

### 6. Brand Management Routes (`/brands`)
- Brand CRUD operations, featured brands

### 7. Order Management Routes (`/orders`)
- Order creation, tracking, status updates

### 8. Payment Routes (`/payments`)
- Payment processing, refunds, payment gateway integration

### 9. Review & Rating Routes (`/reviews`)
- Product reviews, ratings, moderation

### 10. Cart & Wishlist Routes (`/cart`, `/wishlist`)
- Shopping cart and wishlist management

### 11. Search & Filter Routes (`/search`)
- Product search, filtering, sorting

### 12. Notification Routes (`/notifications`)
- User notifications, email/SMS notifications

### 13. Admin Routes (`/admin`)
- Admin panel functionality, system settings

### 14. Analytics Routes (`/analytics`)
- Sales analytics, user analytics, vendor analytics

### 15. Coupon & Discount Routes (`/coupons`)
- Coupon management, discount application

### 16. Shipping Routes (`/shipping`)
- Shipping calculations, tracking

## Detailed Route Specifications

See individual route files for detailed specifications:
- [Authentication Routes](./auth-routes.md)
- [User Routes](./user-routes.md)
- [Vendor Routes](./vendor-routes.md)
- [Product Routes](./product-routes.md)
- [Category Routes](./category-routes.md)
- [Brand Routes](./brand-routes.md)
- [Order Routes](./order-routes.md)
- [Payment Routes](./payment-routes.md)
- [Review Routes](./review-routes.md)
- [Cart Routes](./cart-routes.md)
- [Search Routes](./search-routes.md)
- [Notification Routes](./notification-routes.md)
- [Admin Routes](./admin-routes.md)
- [Analytics Routes](./analytics-routes.md)
- [Coupon Routes](./coupon-routes.md)
- [Shipping Routes](./shipping-routes.md)

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "error": null
}
```

## Error Handling

Error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error 