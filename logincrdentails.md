# Veloura E-commerce Platform - Login Credentials

## 🚀 API Base URL
```
http://localhost:5000/api
```

## 👥 User Accounts

### 🛒 Customer
| Email | Password | Name | Role |
|-------|----------|------|------|
| `customer1@example.com` | `customer123` | Anita Sharma | CUSTOMER |

### 🏪 Vendors
| Email | Password | Name | Business | Role |
|-------|----------|------|----------|------|
| `vendor1@example.com` | `vendor123` | Ravi Gurung | Beauty Bliss | VENDOR |
| `vendor2@example.com` | `vendor456` | Priya Tamang | Tech Trends | VENDOR |

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

- **Users**: 4 (1 customer, 2 vendors, 1 admin)
- **Vendors**: 2 (Beauty Bliss, Tech Trends)
- **Categories**: Skincare, Home Appliances, Computers and Tech, Male Skincare, Women’s Fashion, Men’s Fashion (all with PNG images)
- **Products**: 8 (4 per vendor, all related to seeded categories)
- **Orders**: Multiple, all for the single customer, covering all statuses
- **Reviews**: Only for the single customer, referencing seeded products

## 📂 Available Categories (PNG images only)
- Skincare
- Home Appliances
- Computers and Tech
- Male Skincare
- Women’s Fashion
- Men’s Fashion

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
*Database: SQLite or MySQL (Prisma)*
*Server: Node.js + Express + TypeScript + Prisma* 

