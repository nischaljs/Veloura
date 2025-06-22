# Notification Routes

Base path: `/notifications`

## GET /notifications
Get user notifications (requires authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by notification type
- `isRead` (boolean): Filter by read status

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "Order Shipped",
        "message": "Your order ORD-2024-001 has been shipped",
        "type": "order",
        "isRead": false,
        "link": "/orders/1",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": 2,
        "title": "Price Drop Alert",
        "message": "Smartphone Pro price dropped by 10%",
        "type": "promotion",
        "isRead": true,
        "link": "/products/smartphone-pro",
        "createdAt": "2024-01-14T15:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    },
    "unreadCount": 5
  }
}
```

## GET /notifications/unread
Get unread notifications count (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

## PUT /notifications/:id/read
Mark notification as read (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

## PUT /notifications/read-all
Mark all notifications as read (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

## DELETE /notifications/:id
Delete notification (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

## DELETE /notifications
Clear all notifications (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "All notifications cleared successfully"
}
```

## GET /notifications/settings
Get notification settings (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "email": {
        "orderUpdates": true,
        "promotions": true,
        "priceDrops": false,
        "newProducts": true,
        "reviews": true
      },
      "push": {
        "orderUpdates": true,
        "promotions": false,
        "priceDrops": true,
        "newProducts": false,
        "reviews": false
      },
      "sms": {
        "orderUpdates": true,
        "promotions": false,
        "priceDrops": false,
        "newProducts": false,
        "reviews": false
      }
    }
  }
}
```

## PUT /notifications/settings
Update notification settings (requires authentication).

**Request Body:**
```json
{
  "email": {
    "orderUpdates": true,
    "promotions": false,
    "priceDrops": true,
    "newProducts": true,
    "reviews": false
  },
  "push": {
    "orderUpdates": true,
    "promotions": false,
    "priceDrops": true,
    "newProducts": false,
    "reviews": false
  },
  "sms": {
    "orderUpdates": true,
    "promotions": false,
    "priceDrops": false,
    "newProducts": false,
    "reviews": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification settings updated successfully"
}
```

## POST /notifications/subscribe
Subscribe to push notifications (requires authentication).

**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/device_token",
  "keys": {
    "p256dh": "p256dh_key_here",
    "auth": "auth_key_here"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to push notifications"
}
```

## DELETE /notifications/unsubscribe
Unsubscribe from push notifications (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from push notifications"
}
```

## Admin Notification Routes

### GET /admin/notifications
Get all notifications (requires admin authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by notification type
- `user` (string): Filter by user email
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "Order Shipped",
        "message": "Your order ORD-2024-001 has been shipped",
        "type": "order",
        "isRead": false,
        "link": "/orders/1",
        "createdAt": "2024-01-15T10:30:00Z",
        "user": {
          "id": 1,
          "email": "john@example.com",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "pages": 25
    }
  }
}
```

### POST /admin/notifications/send
Send notification to users (requires admin authentication).

**Request Body:**
```json
{
  "title": "System Maintenance",
  "message": "We will be performing maintenance on January 20th from 2-4 AM",
  "type": "system",
  "recipients": {
    "type": "all", // "all", "customers", "vendors", "specific"
    "userIds": [] // Required if type is "specific"
  },
  "channels": ["email", "push", "sms"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "sentCount": 1000,
    "failedCount": 5
  }
}
```

### GET /admin/notifications/analytics
Get notification analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalNotifications": 5000,
      "readNotifications": 3500,
      "unreadNotifications": 1500,
      "readRate": 70.0,
      "typeDistribution": {
        "order": 2000,
        "promotion": 1500,
        "system": 1000,
        "priceDrop": 500
      },
      "channelDistribution": {
        "email": 3000,
        "push": 1500,
        "sms": 500
      },
      "dailyNotifications": [
        {
          "date": "2024-01-15",
          "sent": 100,
          "read": 75
        }
      ]
    }
  }
}
```

## Vendor Notification Routes

### GET /vendors/notifications
Get vendor notifications (requires vendor authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by notification type

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "New Order Received",
        "message": "You have received a new order ORD-2024-001",
        "type": "order",
        "isRead": false,
        "link": "/vendors/orders/1",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": 2,
        "title": "Product Review",
        "message": "New review received for Product Name",
        "type": "review",
        "isRead": true,
        "link": "/vendors/products/1/reviews",
        "createdAt": "2024-01-14T15:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    },
    "unreadCount": 8
  }
}
```

### PUT /vendors/notifications/:id/read
Mark vendor notification as read (requires vendor authentication).

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

## Email Notification Templates

### GET /notifications/templates
Get email notification templates (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": 1,
        "name": "Order Confirmation",
        "subject": "Order Confirmation - {{orderNumber}}",
        "body": "Thank you for your order...",
        "variables": ["orderNumber", "customerName", "orderTotal"],
        "type": "order"
      },
      {
        "id": 2,
        "name": "Price Drop Alert",
        "subject": "Price Drop Alert - {{productName}}",
        "body": "The price of {{productName}} has dropped...",
        "variables": ["productName", "oldPrice", "newPrice"],
        "type": "promotion"
      }
    ]
  }
}
```

### PUT /notifications/templates/:id
Update email template (requires admin authentication).

**Request Body:**
```json
{
  "name": "Updated Order Confirmation",
  "subject": "Order Confirmed - {{orderNumber}}",
  "body": "Updated email body content..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template updated successfully"
}
```

## SMS Notification Routes

### POST /notifications/sms/send
Send SMS notification (requires admin authentication).

**Request Body:**
```json
{
  "phoneNumber": "+977-9841234567",
  "message": "Your order ORD-2024-001 has been shipped",
  "type": "order"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "messageId": "msg_123456"
  }
}
```

### GET /notifications/sms/status/:messageId
Get SMS delivery status (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_123456",
    "status": "delivered",
    "deliveredAt": "2024-01-15T10:35:00Z"
  }
}
``` 