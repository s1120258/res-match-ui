# Deployment Guide

Production deployment, monitoring, and operations guide for ResMatch Frontend.

## 🚀 Build & Deployment

### Production Build

```bash
# Install dependencies
npm ci

# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Build Output Structure

```
dist/
├── index.html              # Entry point
├── assets/
│   ├── index-[hash].js     # Main application bundle
│   ├── vendor-[hash].js    # Third-party libraries
│   └── index-[hash].css    # Compiled styles
└── [other-assets]          # Images, fonts, etc.
```

### Environment Configuration

#### Development (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_ENV=development
VITE_LOG_LEVEL=debug
```

#### Staging (.env.staging)

```env
VITE_API_BASE_URL=https://api-staging.resmatch.com
VITE_ENV=staging
VITE_LOG_LEVEL=info
```

#### Production (.env.production)

```env
VITE_API_BASE_URL=https://api.resmatch.com
VITE_ENV=production
VITE_LOG_LEVEL=error
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## 🌐 Deployment Platforms

### Vercel (Recommended)

#### Setup

1. Connect GitHub repository to Vercel
2. Configure build settings:

   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm ci"
   }
   ```

3. Environment variables in Vercel dashboard
4. Custom domain configuration

#### vercel.json Configuration

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Netlify

#### netlify.toml Configuration

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### AWS S3 + CloudFront

#### S3 Bucket Setup

```bash
# Create S3 bucket
aws s3 mb s3://resmatch-frontend

# Upload build files
aws s3 sync dist/ s3://resmatch-frontend --delete

# Configure bucket for static website hosting
aws s3 website s3://resmatch-frontend \
  --index-document index.html \
  --error-document index.html
```

#### CloudFront Distribution

```json
{
  "CallerReference": "resmatch-frontend",
  "Origins": [
    {
      "Id": "S3-resmatch-frontend",
      "DomainName": "resmatch-frontend.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-resmatch-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

  deploy-staging:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Staging
        run: |
          # Deploy to staging environment
          echo "Deploying to staging..."

  deploy-production:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build for production
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

### GitLab CI/CD

#### .gitlab-ci.yml

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run lint
    - npm test
    - npm run build

deploy_staging:
  stage: deploy
  image: node:18
  script:
    - npm ci
    - npm run build
    -  # Deploy to staging
  environment:
    name: staging
    url: https://staging.resmatch.com
  only:
    - develop

deploy_production:
  stage: deploy
  image: node:18
  script:
    - npm ci
    - npm run build
    -  # Deploy to production
  environment:
    name: production
    url: https://app.resmatch.com
  only:
    - main
```

## 📊 Monitoring & Analytics

### Error Tracking with Sentry

#### Setup

```javascript
// src/utils/sentry.js
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_ENV === "production") {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

#### Error Boundary Integration

```jsx
// src/components/common/ErrorBoundary.jsx
import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";

const ErrorBoundary = ({ children }) => {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
    >
      {children}
    </SentryErrorBoundary>
  );
};
```

### Performance Monitoring

#### Web Vitals Tracking

```javascript
// src/utils/analytics.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

const sendToAnalytics = (metric) => {
  // Send to your analytics service
  console.log(metric);
};

// Track Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### Google Analytics 4

```javascript
// src/utils/gtag.js
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

export const pageview = (url) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### Health Checks

#### Basic Health Check Endpoint

```javascript
// src/utils/healthCheck.js
export const healthCheck = async () => {
  try {
    const response = await fetch("/api/health");
    return response.ok;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

// Monitor application health
setInterval(async () => {
  const isHealthy = await healthCheck();
  if (!isHealthy) {
    // Alert or log health check failure
  }
}, 30000); // Check every 30 seconds
```

## 🔒 Security Configuration

### Content Security Policy

```html
<!-- In index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.resmatch.com;
"
/>
```

### Security Headers

```javascript
// vercel.json security headers
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### Environment Variables Security

```bash
# ✅ Safe to expose (prefixed with VITE_)
VITE_API_BASE_URL=https://api.resmatch.com
VITE_APP_VERSION=1.0.0

# ❌ Never expose in frontend
DATABASE_URL=...
JWT_SECRET=...
API_PRIVATE_KEY=...
```

## 📈 Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Or use webpack-bundle-analyzer for detailed analysis
npm install --save-dev webpack-bundle-analyzer
```

### Optimization Techniques

#### Code Splitting

```javascript
// Route-based splitting
const Dashboard = lazy(() => import("./pages/DashboardPage"));
const Jobs = lazy(() => import("./pages/JobsPage"));

// Component-based splitting
const HeavyChart = lazy(() => import("./components/HeavyChart"));
```

#### Asset Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@chakra-ui/react"],
          charts: ["recharts"],
        },
      },
    },
  },
  // Image optimization
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],
});
```

#### Caching Strategy

```javascript
// Service Worker for caching (if implemented)
const CACHE_NAME = "resmatch-v1";
const urlsToCache = ["/", "/static/css/main.css", "/static/js/main.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
rm -rf dist
npm ci
npm run build

# Check for TypeScript errors
npm run type-check

# Verify environment variables
echo $VITE_API_BASE_URL
```

#### Runtime Errors

```javascript
// Add error boundaries in production
if (import.meta.env.VITE_ENV === "production") {
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    // Send to error tracking service
  });
}
```

#### Performance Issues

```bash
# Check bundle sizes
npm run build
ls -la dist/assets/

# Analyze critical rendering path
npm install --save-dev lighthouse-ci
npx lhci autorun
```

### Rollback Strategy

#### Quick Rollback

```bash
# Revert to previous Git commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <previous-commit-hash>
git push --force origin main
```

#### Vercel Rollback

```bash
# Via Vercel CLI
vercel --prod rollback

# Or via Vercel dashboard
# Navigate to project > Deployments > Select previous deployment > Promote
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] Performance metrics checked
- [ ] Security headers configured

### Post-deployment

- [ ] Health check passes
- [ ] Error monitoring active
- [ ] Performance metrics normal
- [ ] User acceptance testing
- [ ] Rollback plan ready
- [ ] Team notified

### Monitoring Setup

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Analytics (Google Analytics)
- [ ] User feedback collection

## 📊 Performance Targets

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Targets

- **Initial Bundle**: < 250KB gzipped
- **Vendor Bundle**: < 150KB gzipped
- **Total Assets**: < 1MB

### Runtime Performance

- **Time to Interactive**: < 3s
- **API Response Time**: < 500ms
- **Page Load Time**: < 2s

---

## 🆘 Emergency Procedures

### Incident Response

1. **Assess Impact**: Determine scope and severity
2. **Immediate Action**: Rollback if necessary
3. **Communication**: Notify stakeholders
4. **Investigation**: Root cause analysis
5. **Resolution**: Implement fix and deploy
6. **Post-mortem**: Document lessons learned

### Emergency Contacts

- **DevOps Team**: devops@company.com
- **Backend Team**: backend@company.com
- **Product Team**: product@company.com

Happy deploying! 🚀
