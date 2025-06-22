# Veloura E-commerce Platform - Login Credentials

## 🚀 API Base URL
```
http://localhost:5000/api
```

## 👥 User Accounts

### 🛒 Customers
| Email | Password | Name | Role |
|-------|----------|------|------|
| `customer1@example.com` | `customer123` | Alice Smith | CUSTOMER |
| `customer2@example.com` | `customer456` | Bob Johnson | CUSTOMER |

### 🏪 Vendors
| Email | Password | Name | Business | Role |
|-------|----------|------|----------|------|
| `vendor1@example.com` | `vendor123` | Charlie Vendor | Tech Store | VENDOR |
| `vendor2@example.com` | `vendor456` | Diana Vendor | Fashion Hub | VENDOR |

### 👨‍💼 Admin
| Email | Password | Name | Role |
|-------|----------|------|------|
| `admin@example.com` | `admin123` | Admin User | ADMIN |

## 🔐 Authentication Endpoints

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer1@example.com",
  "password": "customer123"
}
```

### Get Current User (Protected)
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

## 📊 Seeded Data Summary

- **Users**: 5 (2 customers, 2 vendors, 1 admin)
- **Vendors**: 2 (Tech Store, Fashion Hub)
- **Brands**: 3 (Apple, Samsung, Nike)
- **Categories**: 3 (Electronics, Fashion, Mobiles)

## 🏷️ Available Brands
- Apple (Featured)
- Samsung (Featured)
- Nike

## 📂 Available Categories
- Electronics (Featured)
- Fashion (Featured)
- Mobiles (Subcategory of Electronics)

## 🧪 Testing Commands

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "customer1@example.com", "password": "customer123"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

### Test Brands API
```bash
curl -X GET http://localhost:5000/api/brands
```

### Test Categories API
```bash
curl -X GET http://localhost:5000/api/categories
```

## 🔄 Re-seeding
To re-seed the database (safe to run multiple times):
```bash
cd server
pnpm db:seed
```

---
*Generated on: $(date)*
*Database: MySQL (XAMPP)*
*Server: Node.js + Express + TypeScript + Prisma* 