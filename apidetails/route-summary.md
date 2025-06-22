# Veloura API Routes Summary

## Authentication Routes (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user profile
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email address

## User Management Routes (`/users`)
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `POST /users/avatar` - Upload user avatar
- `DELETE /users/avatar` - Remove user avatar
- `PUT /users/password` - Change password
- `GET /users/addresses` - Get user addresses
- `POST /users/addresses` - Add new address
- `PUT /users/addresses/:id` - Update address
- `DELETE /users/addresses/:id` - Delete address
- `PUT /users/addresses/:id/default` - Set default address
- `GET /users/orders` - Get user orders
- `GET /users/orders/:id` - Get order details
- `GET /users/orders/invoice/:id` - Get order invoice

## Vendor Management Routes (`/vendors`)
- `POST /vendors/register` - Register as vendor
- `GET /vendors/profile` - Get vendor profile
- `PUT /vendors/profile` - Update vendor profile
- `POST /vendors/logo` - Upload vendor logo
- `POST /vendors/banner` - Upload vendor banner
- `GET /vendors/:slug` - Get public vendor profile
- `GET /vendors/:slug/products` - Get vendor products
- `GET /vendors/:slug/reviews` - Get vendor reviews
- `GET /vendors/bank-details` - Get bank details
- `POST /vendors/bank-details` - Add bank details
- `PUT /vendors/bank-details/:id` - Update bank details
- `DELETE /vendors/bank-details/:id` - Delete bank details
- `GET /vendors/policies` - Get vendor policies
- `POST /vendors/policies` - Add vendor policy
- `PUT /vendors/policies/:id` - Update vendor policy
- `DELETE /vendors/policies/:id` - Delete vendor policy
- `GET /vendors/analytics` - Get vendor analytics

## Product Management Routes (`/products`)
- `GET /products` - Get all products with filters
- `GET /products/:slug` - Get product details
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/:id/images` - Upload product images
- `PUT /products/:id/images/:imageId` - Update product image
- `DELETE /products/:id/images/:imageId` - Delete product image
- `POST /products/:id/variants` - Add product variant
- `PUT /products/:id/variants/:variantId` - Update product variant
- `DELETE /products/:id/variants/:variantId` - Delete product variant
- `GET /products/featured` - Get featured products
- `GET /products/trending` - Get trending products
- `GET /products/similar/:productId` - Get similar products
- `POST /products/:id/stock` - Update product stock
- `GET /products/:id/analytics` - Get product analytics

## Category Management Routes (`/categories`)
- `GET /categories` - Get all categories
- `GET /categories/:slug` - Get category details
- `GET /categories/:slug/products` - Get products in category
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `POST /categories/:id/image` - Upload category image
- `DELETE /categories/:id/image` - Remove category image
- `GET /categories/:id/attributes` - Get category attributes
- `POST /categories/:id/attributes` - Add category attribute
- `PUT /categories/:id/attributes/:attributeId` - Update category attribute
- `DELETE /categories/:id/attributes/:attributeId` - Delete category attribute
- `GET /categories/featured` - Get featured categories
- `PUT /categories/featured-order` - Update featured order
- `GET /categories/breadcrumb/:slug` - Get category breadcrumb

## Brand Management Routes (`/brands`)
- `GET /brands` - Get all brands
- `GET /brands/:slug` - Get brand details
- `GET /brands/:slug/products` - Get products by brand
- `POST /brands` - Create new brand
- `PUT /brands/:id` - Update brand
- `DELETE /brands/:id` - Delete brand
- `POST /brands/:id/logo` - Upload brand logo
- `DELETE /brands/:id/logo` - Remove brand logo
- `GET /brands/featured` - Get featured brands
- `PUT /brands/featured-order` - Update featured order
- `GET /brands/search` - Search brands
- `GET /brands/analytics` - Get brand analytics

## Order Management Routes (`/orders`)
- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/cancel` - Cancel order
- `POST /orders/:id/return` - Request order return
- `GET /orders/:id/tracking` - Get order tracking
- `GET /orders/invoice/:id` - Get order invoice

### Vendor Order Routes
- `GET /vendors/orders` - Get vendor orders
- `PUT /vendors/orders/:id/status` - Update order status
- `GET /vendors/orders/analytics` - Get vendor order analytics

### Admin Order Routes
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/:id/status` - Update order status
- `GET /admin/orders/analytics` - Get admin order analytics

## Payment Routes (`/payments`)
- `POST /payments/khalti/initiate` - Initiate Khalti payment
- `POST /payments/khalti/verify` - Verify Khalti payment
- `POST /payments/esewa/initiate` - Initiate eSewa payment
- `POST /payments/esewa/verify` - Verify eSewa payment
- `POST /payments/cod/confirm` - Confirm COD payment
- `GET /payments/:id` - Get payment details
- `GET /payments/order/:orderId` - Get order payments
- `POST /payments/:id/refund` - Request refund
- `GET /payments/refunds` - Get user refunds

### Vendor Payment Routes
- `GET /vendors/payments` - Get vendor payments
- `GET /vendors/payments/analytics` - Get vendor payment analytics

### Admin Payment Routes
- `GET /admin/payments` - Get all payments
- `PUT /admin/payments/:id/status` - Update payment status
- `POST /admin/payments/:id/refund` - Process refund
- `GET /admin/payments/analytics` - Get admin payment analytics

### Webhook Routes
- `POST /payments/khalti/webhook` - Khalti webhook
- `POST /payments/esewa/webhook` - eSewa webhook

## Review Routes (`/reviews`)
- `POST /reviews` - Create product review
- `GET /reviews/product/:productId` - Get product reviews
- `GET /reviews/user` - Get user reviews
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `POST /reviews/:id/images` - Upload review images
- `GET /reviews/summary/:productId` - Get review summary
- `POST /reviews/:id/helpful` - Mark review helpful
- `POST /reviews/:id/unhelpful` - Mark review unhelpful
- `GET /reviews/:id/helpfulness` - Get review helpfulness

### Vendor Review Routes
- `GET /vendors/reviews` - Get vendor reviews
- `PUT /vendors/reviews/:id/read` - Mark review read
- `GET /vendors/reviews/analytics` - Get vendor review analytics

### Admin Review Routes
- `GET /admin/reviews` - Get all reviews
- `PUT /admin/reviews/:id/approve` - Approve review
- `PUT /admin/reviews/:id/reject` - Reject review
- `DELETE /admin/reviews/:id` - Delete review
- `GET /admin/reviews/analytics` - Get admin review analytics

## Cart Routes (`/cart`)
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/:itemId` - Update cart item
- `DELETE /cart/:itemId` - Remove cart item
- `DELETE /cart` - Clear cart
- `POST /cart/apply-coupon` - Apply coupon
- `DELETE /cart/coupon` - Remove coupon
- `GET /cart/shipping-options` - Get shipping options
- `POST /cart/calculate-shipping` - Calculate shipping
- `GET /cart/analytics` - Get cart analytics

### Guest Cart Routes
- `GET /cart/guest` - Get guest cart
- `POST /cart/guest/add` - Add item to guest cart
- `POST /cart/guest/merge` - Merge guest cart

## Wishlist Routes (`/wishlist`)
- `GET /wishlist` - Get user wishlist
- `POST /wishlist/add` - Add item to wishlist
- `DELETE /wishlist/:itemId` - Remove wishlist item
- `DELETE /wishlist` - Clear wishlist
- `POST /wishlist/:itemId/move-to-cart` - Move to cart
- `POST /wishlist/move-all-to-cart` - Move all to cart
- `GET /wishlist/analytics` - Get wishlist analytics

## Search Routes (`/search`)
- `GET /search` - Search products
- `GET /search/suggestions` - Get search suggestions
- `GET /search/autocomplete` - Get autocomplete results
- `GET /search/filters` - Get search filters
- `GET /search/trending` - Get trending searches
- `GET /search/popular` - Get popular searches
- `GET /search/recent` - Get recent searches
- `POST /search/log` - Log search query
- `GET /search/analytics` - Get search analytics
- `GET /search/advanced` - Advanced search
- `GET /search/similar/:productId` - Find similar products

## Notification Routes (`/notifications`)
- `GET /notifications` - Get user notifications
- `GET /notifications/unread` - Get unread count
- `PUT /notifications/:id/read` - Mark notification read
- `PUT /notifications/read-all` - Mark all read
- `DELETE /notifications/:id` - Delete notification
- `DELETE /notifications` - Clear all notifications
- `GET /notifications/settings` - Get notification settings
- `PUT /notifications/settings` - Update notification settings
- `POST /notifications/subscribe` - Subscribe to push notifications
- `DELETE /notifications/unsubscribe` - Unsubscribe from push notifications

### Admin Notification Routes
- `GET /admin/notifications` - Get all notifications
- `POST /admin/notifications/send` - Send notification
- `GET /admin/notifications/analytics` - Get notification analytics

### Vendor Notification Routes
- `GET /vendors/notifications` - Get vendor notifications
- `PUT /vendors/notifications/:id/read` - Mark notification read

### Email Templates
- `GET /notifications/templates` - Get email templates
- `PUT /notifications/templates/:id` - Update email template

### SMS Routes
- `POST /notifications/sms/send` - Send SMS
- `GET /notifications/sms/status/:messageId` - Get SMS status

## Admin Routes (`/admin`)

### User Management
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user details
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `PUT /admin/users/:id/activate` - Activate user
- `PUT /admin/users/:id/deactivate` - Deactivate user

### Vendor Management
- `GET /admin/vendors` - Get all vendors
- `GET /admin/vendors/:id` - Get vendor details
- `PUT /admin/vendors/:id/approve` - Approve vendor
- `PUT /admin/vendors/:id/reject` - Reject vendor
- `PUT /admin/vendors/:id/suspend` - Suspend vendor

### Product Management
- `GET /admin/products` - Get all products
- `PUT /admin/products/:id/status` - Update product status
- `DELETE /admin/products/:id` - Delete product

### System Settings
- `GET /admin/settings` - Get system settings
- `PUT /admin/settings` - Update system settings

### Analytics
- `GET /admin/analytics/dashboard` - Get dashboard analytics
- `GET /admin/analytics/users` - Get user analytics
- `GET /admin/analytics/vendors` - Get vendor analytics

### Activity Logs
- `GET /admin/activities` - Get activity logs

### Backup & Export
- `POST /admin/backup/create` - Create backup
- `GET /admin/backup/list` - Get backup list
- `POST /admin/export/users` - Export users data

## Analytics Routes (`/analytics`)

### User Analytics
- `GET /analytics/user` - Get user analytics
- `GET /analytics/user/orders` - Get user order analytics
- `GET /analytics/user/reviews` - Get user review analytics

### Vendor Analytics
- `GET /analytics/vendor` - Get vendor analytics
- `GET /analytics/vendor/sales` - Get vendor sales analytics
- `GET /analytics/vendor/products` - Get vendor product analytics
- `GET /analytics/vendor/customers` - Get vendor customer analytics

### Admin Analytics
- `GET /analytics/admin/dashboard` - Get admin dashboard analytics
- `GET /analytics/admin/sales` - Get admin sales analytics
- `GET /analytics/admin/users` - Get admin user analytics
- `GET /analytics/admin/vendors` - Get admin vendor analytics

### Real-time Analytics
- `GET /analytics/realtime` - Get real-time analytics

### Export Analytics
- `POST /analytics/export` - Export analytics data
- `GET /analytics/export/status/:exportId` - Get export status

## Coupon Routes (`/coupons`)
- `GET /coupons` - Get available coupons
- `GET /coupons/validate` - Validate coupon code
- `GET /coupons/user` - Get user coupons
- `POST /coupons/claim` - Claim coupon

### Admin Coupon Routes
- `GET /admin/coupons` - Get all coupons
- `POST /admin/coupons` - Create coupon
- `PUT /admin/coupons/:id` - Update coupon
- `DELETE /admin/coupons/:id` - Delete coupon
- `PUT /admin/coupons/:id/activate` - Activate coupon
- `PUT /admin/coupons/:id/deactivate` - Deactivate coupon
- `GET /admin/coupons/:id/usage` - Get coupon usage
- `GET /admin/coupons/analytics` - Get coupon analytics
- `POST /admin/coupons/bulk-create` - Create bulk coupons
- `POST /admin/coupons/bulk-deactivate` - Deactivate bulk coupons

### Vendor Coupon Routes
- `GET /vendors/coupons` - Get vendor coupons
- `POST /vendors/coupons` - Create vendor coupon
- `PUT /vendors/coupons/:id` - Update vendor coupon
- `DELETE /vendors/coupons/:id` - Delete vendor coupon
- `GET /vendors/coupons/analytics` - Get vendor coupon analytics

## Shipping Routes (`/shipping`)
- `GET /shipping/options` - Get shipping options
- `POST /shipping/calculate` - Calculate shipping cost
- `GET /shipping/tracking/:trackingNumber` - Get tracking info
- `GET /shipping/zones` - Get shipping zones

### Vendor Shipping Routes
- `GET /vendors/shipping/settings` - Get shipping settings
- `PUT /vendors/shipping/settings` - Update shipping settings
- `GET /vendors/shipping/orders` - Get shipping orders
- `POST /vendors/shipping/ship` - Mark order shipped
- `PUT /vendors/shipping/update-tracking` - Update tracking
- `GET /vendors/shipping/analytics` - Get shipping analytics

### Admin Shipping Routes
- `GET /admin/shipping/carriers` - Get shipping carriers
- `POST /admin/shipping/carriers` - Add shipping carrier
- `PUT /admin/shipping/carriers/:id` - Update shipping carrier
- `DELETE /admin/shipping/carriers/:id` - Delete shipping carrier
- `GET /admin/shipping/zones` - Get shipping zones
- `POST /admin/shipping/zones` - Add shipping zone
- `PUT /admin/shipping/zones/:id` - Update shipping zone
- `DELETE /admin/shipping/zones/:id` - Delete shipping zone
- `GET /admin/shipping/analytics` - Get shipping analytics

### Shipping Label Routes
- `POST /shipping/labels/generate` - Generate shipping label
- `GET /shipping/labels/:labelId` - Get shipping label

## Total Routes: ~300+ API endpoints

This comprehensive API covers all aspects of the Veloura e-commerce platform including:
- User authentication and management
- Vendor management and operations
- Product catalog and inventory
- Order processing and management
- Payment processing with multiple gateways
- Review and rating system
- Shopping cart and wishlist
- Advanced search and filtering
- Notification system
- Admin panel functionality
- Analytics and reporting
- Coupon and discount management
- Shipping and logistics
- Real-time tracking and monitoring 