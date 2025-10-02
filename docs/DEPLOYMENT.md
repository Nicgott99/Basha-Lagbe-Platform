# Deployment Guide

This guide covers deploying Basha Lagbe to various hosting platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Frontend Deployment](#frontend-deployment)
  - [Vercel](#vercel-recommended)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
- [Backend Deployment](#backend-deployment)
  - [Heroku](#heroku)
  - [Railway](#railway)
  - [DigitalOcean](#digitalocean)
  - [AWS EC2](#aws-ec2)
- [Database Setup](#database-setup)
- [Domain Configuration](#domain-configuration)
- [CI/CD Setup](#cicd-setup)

---

## Prerequisites

Before deploying, ensure you have:
- [x] MongoDB Atlas account (for production database)
- [x] Firebase project configured
- [x] Domain name (optional but recommended)
- [x] Git repository with your code
- [x] All environment variables documented

---

## Environment Setup

### Production Environment Variables

Create production versions of your environment files with production URLs and credentials.

#### Backend (.env)
```env
MONGO_URL=your_production_mongodb_url
JWT_SECRET=very_secure_production_secret
EMAIL_USER=production.email@example.com
EMAIL_PASS=production_app_password
CLIENT_URL=https://your-domain.com
SERVER_URL=https://api.your-domain.com
NODE_ENV=production
PORT=3000
```

#### Frontend (.env.production)
```env
VITE_FIREBASE_API_KEY=production_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=production-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=production-project-id
VITE_FIREBASE_STORAGE_BUCKET=production-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=production_sender_id
VITE_FIREBASE_APP_ID=production_app_id
VITE_API_BASE_URL=https://api.your-domain.com
```

---

## Frontend Deployment

### Vercel (Recommended)

Vercel is ideal for React/Vite applications.

#### Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

#### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables
6. Click "Deploy"

#### vercel.json Configuration

Create `client/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@api_base_url"
  }
}
```

---

### Netlify

1. **Build your project**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify Dashboard**
   - Drag and drop the `dist` folder

#### netlify.toml Configuration

Create `client/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_BASE_URL = "https://api.your-domain.com"
```

---

### GitHub Pages

1. **Install gh-pages**
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub**
   - Go to repository settings
   - Pages section
   - Source: gh-pages branch

---

## Backend Deployment

### Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create basha-lagbe-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URL="your_mongodb_url"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set EMAIL_USER="your_email"
   heroku config:set EMAIL_PASS="your_password"
   heroku config:set CLIENT_URL="https://your-frontend.com"
   heroku config:set NODE_ENV="production"
   ```

4. **Create Procfile**
   ```
   web: node server/index.js
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Open App**
   ```bash
   heroku open
   ```

---

### Railway

1. **Go to [Railway](https://railway.app/)**
2. **Create New Project**
3. **Deploy from GitHub**
   - Select your repository
   - Select root directory
4. **Add Environment Variables**
5. **Configure Start Command**
   ```
   node server/index.js
   ```
6. **Deploy**

Railway will automatically detect Node.js and deploy.

---

### DigitalOcean App Platform

1. **Create App**
   - Go to [DigitalOcean](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect GitHub repository

2. **Configure**
   - Source Directory: `/`
   - Build Command: `npm install`
   - Run Command: `node server/index.js`
   - HTTP Port: 3000

3. **Environment Variables**
   - Add all production variables

4. **Deploy**

---

### AWS EC2 (Advanced)

#### 1. Launch EC2 Instance

- Choose Ubuntu 22.04 LTS
- Select t2.micro (free tier)
- Configure security group (ports 22, 80, 443, 3000)

#### 2. Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### 3. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (optional, use Atlas instead)
# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### 4. Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/basha-lagbe.git
cd basha-lagbe

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Start with PM2
pm2 start server/index.js --name basha-lagbe-api
pm2 save
pm2 startup
```

#### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/basha-lagbe
```

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/basha-lagbe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.your-domain.com
```

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster (M0 free tier available)

2. **Configure Network Access**
   - IP Whitelist: Add `0.0.0.0/0` (all IPs)
   - Or add specific deployment server IPs

3. **Create Database User**
   - Username and password
   - Grant read/write access

4. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

5. **Update Environment Variables**
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/basha-lagbe?retryWrites=true&w=majority
   ```

---

## Domain Configuration

### Custom Domain Setup

#### For Frontend (Vercel)

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Domains
4. Add your domain
5. Add DNS records as shown

#### For Backend

1. **Add A Record**
   ```
   Type: A
   Name: api
   Value: Your server IP
   TTL: Auto
   ```

2. **Or CNAME Record** (for Heroku/Railway)
   ```
   Type: CNAME
   Name: api
   Value: your-app.herokuapp.com
   TTL: Auto
   ```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./client
        run: npm ci
      
      - name: Build
        working-directory: ./client
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "basha-lagbe-api"
          heroku_email: "your-email@example.com"
```

---

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Test user registration and login
- [ ] Test property creation and listing
- [ ] Test image uploads
- [ ] Test email functionality
- [ ] Verify environment variables
- [ ] Check error logging
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure CORS for production
- [ ] Enable HTTPS
- [ ] Set up automatic backups
- [ ] Configure CDN for images
- [ ] Test performance
- [ ] Set up analytics

---

## Monitoring & Maintenance

### Recommended Tools

1. **Sentry** - Error tracking
2. **LogRocket** - Session replay
3. **Google Analytics** - User analytics
4. **UptimeRobot** - Uptime monitoring
5. **PM2** - Process management (for VPS)

### Regular Maintenance

- Monitor server logs
- Check database performance
- Update dependencies regularly
- Review security advisories
- Backup database weekly
- Monitor disk space
- Check SSL certificate expiration

---

## Troubleshooting

### Common Deployment Issues

1. **Build Fails**
   - Check Node version compatibility
   - Verify all dependencies are in package.json
   - Check environment variables

2. **API Connection Issues**
   - Verify CORS settings
   - Check API URL in frontend
   - Ensure backend is running

3. **Database Connection Fails**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string
   - Check database user permissions

4. **Environment Variables Not Working**
   - Ensure they're set in deployment platform
   - Check variable names (case-sensitive)
   - Restart application after changes

---

## Need Help?

- Check deployment platform documentation
- Review application logs
- Create an issue on GitHub
- Contact support

---

**Happy Deploying! 🚀**
