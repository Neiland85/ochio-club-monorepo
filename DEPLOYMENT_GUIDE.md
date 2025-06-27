# KOP Stadium - Deployment Configuration

## 🚀 Production Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
cd frontend
vercel --prod
```

### Railway (Backend)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Environment Variables

#### Frontend (.env.production)

```bash
NEXT_PUBLIC_APP_URL=https://kopstadium.com
NEXT_PUBLIC_API_URL=https://api.kopstadium.com
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

#### Backend (.env.production)

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:port/kopstadium
REDIS_URL=redis://host:port
JWT_SECRET=your_super_secure_jwt_secret
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MAPBOX_ACCESS_TOKEN=your_mapbox_token
SENTRY_DSN=your_sentry_dsn
```

## 🏗️ Infrastructure as Code

### Terraform Configuration

```hcl
# infrastructure/main.tf
provider "vercel" {
  api_token = var.vercel_api_token
}

provider "railway" {
  token = var.railway_token
}

resource "vercel_project" "frontend" {
  name      = "kop-stadium-frontend"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "your-org/kop-stadium"
  }

  build_command    = "cd frontend && npm run build"
  output_directory = "frontend/.next"
  install_command  = "npm ci"

  environment = [
    {
      key    = "NEXT_PUBLIC_API_URL"
      value  = "https://api.kopstadium.com"
      target = ["production"]
    }
  ]
}

resource "railway_project" "backend" {
  name = "kop-stadium-backend"

  variables = {
    NODE_ENV     = "production"
    PORT        = "3001"
    DATABASE_URL = var.database_url
    REDIS_URL   = var.redis_url
  }
}
```

## 📊 Monitoring & Observability

### Sentry Error Tracking

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Prometheus Metrics

```typescript
// backend/src/middleware/metrics.ts
import promClient from "prom-client";

const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const metricsMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });

  next();
};
```

## 🔄 Blue-Green Deployment

### Deploy Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting KOP Stadium deployment..."

# Build and test
echo "📦 Building applications..."
npm run build --workspace=backend
npm run build --workspace=frontend

echo "🧪 Running tests..."
npm run test --workspace=backend
npm run test --workspace=frontend

# Deploy backend (Railway)
echo "🔄 Deploying backend to Railway..."
railway up --service backend

# Wait for backend health check
echo "⏳ Waiting for backend to be healthy..."
while ! curl -f https://api.kopstadium.com/health; do
  sleep 5
done

# Deploy frontend (Vercel)
echo "🔄 Deploying frontend to Vercel..."
vercel --prod --confirm

# Run post-deployment tests
echo "🔍 Running post-deployment tests..."
npm run test:e2e

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://kopstadium.com"
echo "🔧 API: https://api.kopstadium.com"
```

## 🛡️ Security Configuration

### Content Security Policy

```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.mapbox.com;
  style-src 'self' 'unsafe-inline' https://api.mapbox.com;
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.mapbox.com wss: https:;
  worker-src 'self' blob:;
`;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
```

## 📈 Performance Optimization

### CDN Configuration

```javascript
// Vercel Edge Functions
export default function handler(request) {
  const response = new Response(request.body, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "application/json",
    },
  });

  return response;
}
```

### Database Optimization

```sql
-- Database indexes for performance
CREATE INDEX CONCURRENTLY idx_user_locations_coords
ON user_locations USING GIST (ST_Point(longitude, latitude));

CREATE INDEX CONCURRENTLY idx_events_date
ON events (event_date);

CREATE INDEX CONCURRENTLY idx_checkins_event_user
ON event_checkins (event_id, user_id);

-- Connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

## 🔧 Maintenance Scripts

### Database Backup

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="kopstadium_backup_$DATE.sql"

echo "📦 Creating database backup..."
pg_dump $DATABASE_URL > $BACKUP_FILE

echo "☁️ Uploading to S3..."
aws s3 cp $BACKUP_FILE s3://kop-stadium-backups/

echo "🧹 Cleaning local backup..."
rm $BACKUP_FILE

echo "✅ Backup complete: $BACKUP_FILE"
```

### Log Rotation

```bash
#!/bin/bash
# log-rotation.sh

# Rotate application logs
find /var/log/kop-stadium -name "*.log" -mtime +7 -delete

# Compress old logs
find /var/log/kop-stadium -name "*.log" -mtime +1 -exec gzip {} \;

echo "✅ Log rotation complete"
```

## 🚨 Disaster Recovery

### Rollback Procedure

```bash
#!/bin/bash
# rollback.sh

PREVIOUS_DEPLOYMENT=$1

echo "🔄 Rolling back to deployment: $PREVIOUS_DEPLOYMENT"

# Rollback frontend (Vercel)
vercel rollback $PREVIOUS_DEPLOYMENT --confirm

# Rollback backend (Railway)
railway rollback $PREVIOUS_DEPLOYMENT

# Rollback database migrations if needed
npx prisma migrate reset --force

echo "✅ Rollback complete"
```

### Health Checks

```typescript
// health-check.ts
export async function healthCheck() {
  const checks = [
    { name: "database", check: () => prisma.$queryRaw`SELECT 1` },
    { name: "redis", check: () => redis.ping() },
    { name: "external_apis", check: () => checkExternalApis() },
  ];

  const results = await Promise.allSettled(
    checks.map(async ({ name, check }) => ({
      name,
      status: await check()
        .then(() => "healthy")
        .catch(() => "unhealthy"),
    })),
  );

  return {
    status: results.every((r) => r.status === "fulfilled")
      ? "healthy"
      : "unhealthy",
    checks: results,
    timestamp: new Date().toISOString(),
  };
}
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Database migrations tested
- [ ] Environment variables updated
- [ ] SSL certificates valid

### During deployment

- [ ] Blue-green deployment started
- [ ] Health checks passing
- [ ] Metrics monitoring active
- [ ] Error tracking enabled
- [ ] Performance monitoring active

### Post-deployment

- [ ] Smoke tests completed
- [ ] User acceptance testing
- [ ] Performance validation
- [ ] Security verification
- [ ] Rollback plan confirmed
- [ ] Team notification sent
