# KOP Stadium - Stack Migration Guide

## 🚀 Guía de Migración Paso a Paso

### Paso 1: Migración de Express a Fastify

```bash
# Instalar Fastify y dependencias
npm install fastify @fastify/cors @fastify/helmet @fastify/jwt @fastify/rate-limit
npm uninstall express cors helmet
```

### Paso 2: Setup Prisma + PostgreSQL

```bash
# Instalar Prisma
npm install prisma @prisma/client
npm install -D prisma

# Inicializar Prisma
npx prisma init
```

### Paso 3: Configurar Supabase completo

```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Inicializar proyecto Supabase
supabase init
supabase start
```

### Paso 4: Redis para caché

```bash
# Instalar Redis cliente
npm install redis @types/redis
```

### Paso 5: Socket.io para real-time

```bash
# Backend
npm install socket.io

# Frontend
npm install socket.io-client
```

## 📁 Estructura de Archivos Recomendada

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── supabase.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── events/
│   │   ├── stadiums/
│   │   └── analytics/
│   ├── shared/
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── utils/
│   ├── socket/
│   │   └── handlers/
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── docker/
    ├── Dockerfile.dev
    └── Dockerfile.prod

frontend/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── map/
│   └── events/
├── components/
│   ├── ui/ (shadcn/ui)
│   ├── map/
│   ├── charts/
│   └── real-time/
├── lib/
│   ├── auth.ts
│   ├── socket.ts
│   ├── api.ts
│   └── utils.ts
└── stores/
    ├── auth.ts
    ├── location.ts
    └── events.ts
```

## 🔧 Configuraciones Clave

### Environment Variables (.env.example)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kopstadium"
REDIS_URL="redis://localhost:6379"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_JWT_SECRET="your-jwt-secret"

# External APIs
MAPBOX_ACCESS_TOKEN="pk.your-mapbox-token"
OPENAI_API_KEY="sk-your-openai-key" # Para AI features

# App Config
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Monitoring
SENTRY_DSN="https://your-sentry-dsn"
```

## 📦 Package.json Updates

### Backend package.json additions:

```json
{
  "dependencies": {
    "fastify": "^4.24.3",
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/jwt": "^7.2.4",
    "@fastify/rate-limit": "^9.1.0",
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1",
    "redis": "^4.6.12",
    "socket.io": "^4.7.4",
    "@supabase/supabase-js": "^2.39.0",
    "zod": "^3.22.4"
  }
}
```

### Frontend package.json additions:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.17.9",
    "zustand": "^4.4.7",
    "socket.io-client": "^4.7.4",
    "mapbox-gl": "^3.0.1",
    "@mapbox/mapbox-gl-geocoder": "^5.0.1",
    "framer-motion": "^10.16.16",
    "next-pwa": "^5.6.0"
  }
}
```

## 🏗️ Comandos de Desarrollo

```bash
# Backend development
npm run dev:backend    # Fastify + hot reload
npm run db:generate    # Prisma generate
npm run db:migrate     # Run migrations
npm run db:studio      # Prisma Studio
npm run test:unit      # Unit tests
npm run test:e2e       # E2E tests

# Frontend development
npm run dev:frontend   # Next.js dev
npm run build:analyze  # Bundle analyzer
npm run test:ui        # Component tests
npm run storybook      # Storybook

# Full stack
npm run dev            # Both frontend + backend
npm run docker:dev     # Docker development
npm run docker:prod    # Docker production
```

## 🔄 Migration Timeline

### Week 1: Foundation

- [ ] Setup Fastify server
- [ ] Configure Prisma + PostgreSQL
- [ ] Setup Redis connection
- [ ] Basic auth with Supabase

### Week 2: Core Features

- [ ] User management API
- [ ] Event management API
- [ ] Geolocation endpoints
- [ ] Socket.io real-time setup

### Week 3: Frontend Updates

- [ ] Migrate to TanStack Query
- [ ] Setup Zustand stores
- [ ] Implement Mapbox integration
- [ ] Real-time components

### Week 4: Testing & Deploy

- [ ] Unit test coverage > 80%
- [ ] E2E test critical paths
- [ ] Setup CI/CD pipeline
- [ ] Production deployment

## 📈 Performance Benchmarks

### Target Metrics:

- **API Response Time**: < 100ms (95th percentile)
- **Database Queries**: < 50ms average
- **Frontend Bundle**: < 200KB gzipped
- **Lighthouse Score**: > 95
- **Real-time Latency**: < 50ms

### Monitoring Setup:

```typescript
// Performance monitoring
import { performance } from "perf_hooks";

const trackApiPerformance = (route: string) => {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    console.log(`${route}: ${duration}ms`);
  };
};
```

## 🛡️ Security Checklist

- [ ] Input validation with Zod
- [ ] Rate limiting on all endpoints
- [ ] CORS properly configured
- [ ] JWT tokens with short expiration
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection headers
- [ ] HTTPS in production
- [ ] Environment variables security
- [ ] Location data encryption
- [ ] GDPR compliance for EU users

## 🚀 Go-Live Checklist

- [ ] Production database setup
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Monitoring dashboards setup
- [ ] Error tracking active
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
