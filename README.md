# Veloura - E-commerce Microservices Platform

A modern e-commerce platform built with microservices architecture, using Node.js, TypeScript, and pnpm.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Docker and Docker Compose (for Redis and PostgreSQL)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/nischaljs/veloura.git
   cd veloura
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example env files
   cp apps/auth-service/.env.example apps/auth-service/.env
   cp apps/api-gateway/.env.example apps/api-gateway/.env
   ```

4. **Start the services**
   ```bash
   # Start all services
   pnpm dev

   # Or start individual services
   cd apps/auth-service
   pnpm dev

   cd apps/api-gateway
   pnpm dev
   ```

## 📁 Project Structure

```
veloura/
├── apps/
│   ├── api-gateway/     # API Gateway service
│   └── auth-service/    # Authentication service
├── packages/
│   ├── db/             # Database utilities
│   ├── error-handler/  # Error handling utilities
│   ├── redis/          # Redis utilities
│   └── zod-schemas/    # Zod validation schemas
└── pnpm-workspace.yaml # Workspace configuration
```

## 🛠️ Available Scripts

In each service directory:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

## 🔧 Environment Variables

### Auth Service (.env)
```env
PORT=4100
HOST=0.0.0.0
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/veloura
REDIS_URL=redis://localhost:6379
```

### API Gateway (.env)
```env
PORT=4000
HOST=0.0.0.0
```

## 🚀 Running in Production

1. **Build all services**
   ```bash
   pnpm build
   ```

2. **Start services**
   ```bash
   pnpm start
   ```

## 📚 API Documentation

### Auth Service Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### API Gateway

- `GET /test` - Health check
- All auth endpoints are proxied through `/auth/*`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Nischal Bhattarai** - [nischaljs](https://github.com/nischaljs)

## 🙏 Acknowledgments

- Built with Node.js, TypeScript, and pnpm
- Uses PostgreSQL for data storage
- Redis for caching
- Express.js for the web framework
