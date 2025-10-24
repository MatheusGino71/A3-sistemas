# Sentinela PIX - Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Production Checklist](#production-checklist)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: Version 2.30 or higher
- **Python**: Version 3.8 or higher (for development server)

### Required Accounts

- **Firebase Account**: For authentication, Firestore, and hosting
- **Cloud Provider Account**: Railway, Heroku, Azure, or AWS
- **Domain Name**: (Optional) For custom domain configuration

### Required Knowledge

- Basic command line operations
- Understanding of environment variables
- Basic networking concepts (DNS, SSL/TLS)
- Firebase console navigation

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters_long
JWT_EXPIRATION=3600

# Database
DATABASE_PATH=./database.sqlite
DATABASE_BACKUP_PATH=./backups

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# WebSocket
WS_PATH=/ws
WS_MAX_CONNECTIONS=1000

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Firebase Admin (Optional for backend push)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
```

### Frontend Configuration

#### backend-config.js

Update `frontend/backend-config.js`:

```javascript
const BACKEND_CONFIG = {
  development: {
    API_URL: 'http://localhost:3001/api/v1',
    WS_URL: 'ws://localhost:3001/ws'
  },
  production: {
    API_URL: 'https://api.sentinela-pix.com/api/v1',
    WS_URL: 'wss://api.sentinela-pix.com/ws'
  }
};

const ENV = window.location.hostname === 'localhost' ? 'development' : 'production';
const API_BASE_URL = BACKEND_CONFIG[ENV].API_URL;
const WS_BASE_URL = BACKEND_CONFIG[ENV].WS_URL;
```

#### firebase-config.js

Update `frontend/firebase-config.js` with production credentials:

```javascript
const firebaseConfig = {
  apiKey: "production_api_key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_production_app_id",
  measurementId: "your_measurement_id"
};
```

#### user-system.js

Update VAPID key in `frontend/user-system.js` line 133:

```javascript
this.fcmToken = await getToken(messaging, {
  vapidKey: 'YOUR_PRODUCTION_VAPID_KEY'
});
```

## Database Setup

### Development Database

The SQLite database is automatically created on first run.

```powershell
cd backend
node server.js
```

### Production Database Options

#### Option 1: Continue with SQLite

**Pros:**
- No additional setup required
- Lightweight and fast
- Zero configuration

**Cons:**
- Single-file database
- Limited concurrent connections
- Manual backup required

**Backup Strategy:**

```powershell
# Create backup script (backup-db.ps1)
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item "database.sqlite" "backups/database-$timestamp.sqlite"
```

Schedule with Windows Task Scheduler or cron.

#### Option 2: PostgreSQL (Recommended for Production)

**Install PostgreSQL Client:**

```powershell
npm install pg
```

**Create Migration Script:**

```javascript
// migrate-to-postgres.js
const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');

// Connection details
const pgClient = new Client({
  host: 'your-postgres-host',
  port: 5432,
  database: 'sentinela_pix',
  user: 'your_username',
  password: 'your_password',
  ssl: { rejectUnauthorized: false }
});

// Migration logic here
```

**Update server.js for PostgreSQL:**

Replace SQLite initialization with PostgreSQL connection pooling.

## Backend Deployment

### Option 1: Railway.app

**Step 1: Create Railway Account**

Visit https://railway.app and sign up.

**Step 2: Create New Project**

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Link to existing project or create new
railway link
```

**Step 3: Configure Environment Variables**

In Railway dashboard:
1. Go to your project
2. Click on "Variables" tab
3. Add all variables from `.env` file
4. Ensure `PORT` variable is not set (Railway assigns it automatically)

**Step 4: Deploy**

```powershell
railway up
```

**Step 5: Get Deployment URL**

Railway will provide a URL like: `https://sentinela-pix-backend.railway.app`

### Option 2: Heroku

**Step 1: Install Heroku CLI**

```powershell
npm install -g heroku
```

**Step 2: Login and Create App**

```powershell
heroku login

cd backend
heroku create sentinela-pix-backend
```

**Step 3: Configure Environment Variables**

```powershell
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend.com
```

**Step 4: Create Procfile**

Already exists in `backend/Procfile`:

```
web: node server.js
```

**Step 5: Deploy**

```powershell
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

**Step 6: Scale Dynos**

```powershell
heroku ps:scale web=1
```

### Option 3: Azure App Service

**Step 1: Install Azure CLI**

```powershell
# Windows
winget install Microsoft.AzureCLI
```

**Step 2: Login to Azure**

```powershell
az login
```

**Step 3: Create Resource Group**

```powershell
az group create --name sentinela-pix-rg --location eastus
```

**Step 4: Create App Service Plan**

```powershell
az appservice plan create `
  --name sentinela-pix-plan `
  --resource-group sentinela-pix-rg `
  --sku B1 `
  --is-linux
```

**Step 5: Create Web App**

```powershell
az webapp create `
  --resource-group sentinela-pix-rg `
  --plan sentinela-pix-plan `
  --name sentinela-pix-backend `
  --runtime "NODE|18-lts"
```

**Step 6: Enable WebSocket**

```powershell
az webapp config set `
  --resource-group sentinela-pix-rg `
  --name sentinela-pix-backend `
  --web-sockets-enabled true
```

**Step 7: Configure Environment Variables**

```powershell
az webapp config appsettings set `
  --resource-group sentinela-pix-rg `
  --name sentinela-pix-backend `
  --settings JWT_SECRET=your_secret NODE_ENV=production
```

**Step 8: Deploy from GitHub**

In Azure Portal:
1. Go to your Web App
2. Select "Deployment Center"
3. Choose GitHub as source
4. Authenticate and select repository
5. Select branch and save

### Option 4: AWS Elastic Beanstalk

**Step 1: Install EB CLI**

```powershell
pip install awsebcli
```

**Step 2: Initialize Application**

```powershell
cd backend
eb init -p node.js-18 sentinela-pix-backend
```

**Step 3: Create Environment**

```powershell
eb create sentinela-pix-env
```

**Step 4: Set Environment Variables**

```powershell
eb setenv JWT_SECRET=your_secret NODE_ENV=production
```

**Step 5: Deploy**

```powershell
eb deploy
```

## Frontend Deployment

### Option 1: Firebase Hosting (Recommended)

**Step 1: Install Firebase CLI**

```powershell
npm install -g firebase-tools
```

**Step 2: Login to Firebase**

```powershell
firebase login
```

**Step 3: Initialize Firebase**

```powershell
cd sentinela-pix
firebase init hosting
```

Configuration:
- **Public directory**: frontend
- **Single-page app**: No
- **Automatic builds**: No

**Step 4: Update firebase.json**

```json
{
  "hosting": {
    "public": "frontend",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

**Step 5: Deploy**

```powershell
firebase deploy --only hosting
```

**Step 6: Custom Domain (Optional)**

In Firebase Console:
1. Go to Hosting
2. Click "Add custom domain"
3. Follow instructions to verify domain
4. Update DNS records

### Option 2: Netlify

**Step 1: Create netlify.toml**

```toml
[build]
  base = "frontend"
  publish = "frontend"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

**Step 2: Deploy via GitHub**

1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect GitHub repository
4. Configure build settings
5. Deploy

### Option 3: Vercel

**Step 1: Install Vercel CLI**

```powershell
npm install -g vercel
```

**Step 2: Deploy**

```powershell
cd frontend
vercel
```

Follow prompts to configure and deploy.

### Option 4: Azure Static Web Apps

**Step 1: Create Static Web App**

```powershell
az staticwebapp create `
  --name sentinela-pix-frontend `
  --resource-group sentinela-pix-rg `
  --source https://github.com/MatheusGino71/A3-sistemas `
  --location eastus `
  --branch main `
  --app-location "/sentinela-pix/frontend" `
  --output-location "/"
```

## Production Checklist

### Security

- [ ] Change all default passwords and secrets
- [ ] Generate strong JWT secret (minimum 32 characters)
- [ ] Enable HTTPS/SSL for all endpoints
- [ ] Configure secure WebSocket (WSS)
- [ ] Set up CORS with specific origins
- [ ] Enable rate limiting
- [ ] Configure security headers (Helmet.js)
- [ ] Remove console.log statements from production code
- [ ] Set up Web Application Firewall (WAF)
- [ ] Enable DDoS protection

### Performance

- [ ] Enable response compression (gzip/brotli)
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Enable caching (Redis recommended)
- [ ] Optimize database queries with indexes
- [ ] Minify JavaScript and CSS files
- [ ] Optimize images (WebP format)
- [ ] Enable lazy loading for images
- [ ] Configure proper cache headers

### Monitoring

- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure application monitoring (New Relic, DataDog)
- [ ] Set up log aggregation (ELK Stack, Splunk)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up alerts for critical errors
- [ ] Configure performance monitoring
- [ ] Enable database query monitoring
- [ ] Set up WebSocket connection monitoring

### Backup

- [ ] Configure automatic database backups
- [ ] Set up backup retention policy
- [ ] Test database restore procedure
- [ ] Configure off-site backup storage
- [ ] Document backup and restore procedures
- [ ] Schedule regular backup tests

### Testing

- [ ] Run all automated tests
- [ ] Perform manual testing of critical flows
- [ ] Test WebSocket connections
- [ ] Test push notifications
- [ ] Verify email functionality
- [ ] Test payment flows (if applicable)
- [ ] Perform load testing
- [ ] Test disaster recovery procedures

### Documentation

- [ ] Update API documentation
- [ ] Document deployment procedures
- [ ] Create runbook for common issues
- [ ] Document monitoring and alerting
- [ ] Create user documentation
- [ ] Document architecture decisions

## Monitoring and Maintenance

### Health Check Endpoint

Configure monitoring service to check:

```
GET https://api.sentinela-pix.com/health
```

Expected response:

```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "websocket": "running",
    "firebase": "connected"
  }
}
```

### Log Monitoring

**Backend Logs:**

```powershell
# Railway
railway logs

# Heroku
heroku logs --tail

# Azure
az webapp log tail --name sentinela-pix-backend --resource-group sentinela-pix-rg
```

**Frontend Logs:**

Check Firebase Hosting logs in Firebase Console.

### Database Maintenance

**Backup Command:**

```powershell
# Create automated backup script
$date = Get-Date -Format "yyyyMMdd-HHmmss"
railway run "sqlite3 database.sqlite .dump > backup-$date.sql"
```

**Schedule with Task Scheduler (Windows):**

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (daily at 2 AM)
4. Set action to run PowerShell script

### SSL Certificate Renewal

Most platforms handle this automatically:

- **Firebase Hosting**: Automatic Let's Encrypt
- **Railway**: Automatic SSL
- **Heroku**: Automatic SSL on paid plans
- **Azure**: Automatic with App Service Certificate

### Scaling

**Horizontal Scaling (Railway):**

```powershell
# Scale to 2 instances
railway scale --replicas 2
```

**Vertical Scaling (Azure):**

```powershell
# Scale up to higher tier
az appservice plan update `
  --name sentinela-pix-plan `
  --resource-group sentinela-pix-rg `
  --sku S1
```

## Troubleshooting

### Issue: Backend Not Starting

**Check logs:**

```powershell
railway logs
```

**Common causes:**
- Missing environment variables
- Port conflicts
- Database connection errors
- Syntax errors in code

**Solutions:**
1. Verify all environment variables are set
2. Check for error messages in logs
3. Ensure database is accessible
4. Review recent code changes

### Issue: WebSocket Connection Fails

**Symptoms:**
- Real-time notifications not working
- WebSocket connection errors in console

**Solutions:**
1. Ensure WebSocket is enabled in hosting platform
2. Verify WSS is used in production (not WS)
3. Check firewall rules allow WebSocket connections
4. Verify CORS configuration includes WebSocket origin

### Issue: Push Notifications Not Working

**Check:**
1. VAPID key is configured correctly
2. Service worker is registered
3. Firebase Cloud Messaging is enabled
4. Browser permissions are granted
5. HTTPS is being used

### Issue: High Memory Usage

**Diagnosis:**

```powershell
railway metrics
```

**Solutions:**
1. Check for memory leaks in code
2. Implement connection pooling
3. Enable garbage collection logging
4. Scale vertically (more memory)
5. Implement caching to reduce database queries

### Issue: Slow API Response Times

**Check:**
1. Database query performance
2. Network latency
3. Cold start times (serverless)
4. Unoptimized code loops

**Solutions:**
1. Add database indexes
2. Implement caching
3. Use connection pooling
4. Optimize expensive queries
5. Use CDN for static assets

## Rollback Procedures

### Railway

```powershell
# List deployments
railway status

# Rollback to previous deployment
railway rollback
```

### Heroku

```powershell
# List releases
heroku releases

# Rollback to specific release
heroku rollback v10
```

### Firebase Hosting

```powershell
# List hosting releases
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:channel:deploy previous
```

## Disaster Recovery

### Backup Restoration

**SQLite:**

```powershell
# Restore from backup
railway run "sqlite3 database.sqlite < backup-20241024.sql"
```

**PostgreSQL:**

```powershell
# Restore from dump
pg_restore -h hostname -U username -d sentinela_pix backup.dump
```

### Complete System Recovery

1. Redeploy backend from Git repository
2. Restore database from latest backup
3. Verify environment variables
4. Test critical functionality
5. Monitor error rates and performance
6. Notify users of service restoration

## Support Contacts

**Platform Support:**
- Railway: https://railway.app/help
- Heroku: https://help.heroku.com
- Azure: https://azure.microsoft.com/support
- Firebase: https://firebase.google.com/support

**Internal Team:**
- Backend issues: backend-team@sentinela-pix.com
- Frontend issues: frontend-team@sentinela-pix.com
- Infrastructure: devops@sentinela-pix.com
- Security: security@sentinela-pix.com

---

**Document Version**: 1.0.0
**Last Updated**: October 2024
**Maintained By**: Sentinela PIX DevOps Team
