# Installation Guide

This guide will help you set up the Basha Lagbe project on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step-by-Step Installation](#step-by-step-installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Common Issues](#common-issues)

---

## Prerequisites

Before you begin, make sure you have the following installed on your system:

### Required Software
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Required Accounts
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Firebase Account** - [Sign up](https://firebase.google.com/)
- **Gmail Account** - For email service (or any SMTP service)

### Verify Installation
Open your terminal and run:
```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show v8.0.0 or higher
git --version     # Should show git version
```

---

## Step-by-Step Installation

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/Nicgott99/Basha-Lagbe-MERN-To-Let-Platform.git

# Or clone via SSH
git clone git@github.com:Nicgott99/Basha-Lagbe-MERN-To-Let-Platform.git

# Navigate to project directory
cd Basha-Lagbe-MERN-To-Let-Platform
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Go back to root
cd ..
```

This may take a few minutes depending on your internet connection.

---

## Environment Setup

### 1. Set up MongoDB

#### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier is fine)
3. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Set username and password
4. Whitelist your IP:
   - Go to Network Access
   - Add IP Address
   - Select "Allow Access from Anywhere" for development
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

#### Option B: Local MongoDB

```bash
# Install MongoDB locally
# Visit: https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication
   - Enable Email/Password provider
   - Enable Google provider
4. Enable Storage:
   - Go to Storage
   - Click "Get Started"
5. Get your configuration:
   - Go to Project Settings
   - Scroll to "Your apps"
   - Click the web icon (</>)
   - Copy the firebaseConfig object

### 3. Set up Email Service

#### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password

### 4. Create Environment Files

#### Root .env file

Create a file named `.env` in the root directory:

```env
# MongoDB Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/basha-lagbe?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_very_long_and_secure_random_string_here_at_least_32_characters

# Email Configuration (Gmail)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_16_digit_app_password

# Application URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### Client .env file

Create a file named `.env` in the `client` directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

**Important:** Never commit `.env` files to version control!

---

## Database Setup

### Initialize Database (Optional)

If you want to create an admin user and seed initial data:

```bash
# Create admin user
node server/createAdmin.js

# Initialize database with sample data (if available)
node server/initDB.js
```

You'll be prompted to enter admin credentials.

---

## Running the Application

### Development Mode

You'll need two terminal windows:

#### Terminal 1 - Backend Server
```bash
# From root directory
npm run dev
```

The server will start on http://localhost:3000

#### Terminal 2 - Frontend Client
```bash
# From root directory
cd client
npm run dev
```

The client will start on http://localhost:5173

### Production Build

```bash
# Build the client
cd client
npm run build

# The built files will be in client/dist
# You can serve them with the backend or deploy separately
```

---

## Verify Installation

### 1. Check Backend
Open http://localhost:3000/server/test in your browser. You should see:
```json
{
  "message": "Backend is working!",
  "timestamp": "2025-10-02T..."
}
```

### 2. Check Frontend
Open http://localhost:5173 in your browser. You should see the Basha Lagbe homepage.

### 3. Test Features
- Try signing up with a new account
- Try logging in
- Browse property listings

---

## Common Issues

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Or change the PORT in your .env file.

### Issue: MongoDB Connection Failed

**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
1. Check your MongoDB Atlas IP whitelist
2. Verify your connection string is correct
3. Ensure password doesn't contain special characters (URL encode if it does)
4. Check if MongoDB service is running (for local)

### Issue: Firebase Configuration Error

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Solutions:**
1. Verify all Firebase config values are correct
2. Make sure there are no extra spaces in .env file
3. Restart the development server after changing .env

### Issue: Email Not Sending

**Solutions:**
1. Verify Gmail App Password is correct (16 digits, no spaces)
2. Check if Less Secure Apps is enabled (for older Gmail accounts)
3. Try using a different email service provider

### Issue: Module Not Found

**Error:** `Error: Cannot find module '...'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For client
cd client
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Errors

**Error:** `Access to fetch at '...' has been blocked by CORS policy`

**Solutions:**
1. Check if backend is running
2. Verify CORS configuration in `server/index.js`
3. Ensure CLIENT_URL in backend .env matches your frontend URL

---

## Next Steps

After successful installation:

1. ✅ Read the [API Documentation](./API_DOCS.md)
2. ✅ Check out the [Contributing Guide](../CONTRIBUTING.md)
3. ✅ Explore the codebase
4. ✅ Start building features!

---

## Need Help?

If you're still experiencing issues:

1. Check [GitHub Issues](https://github.com/Nicgott99/Basha-Lagbe-MERN-To-Let-Platform/issues)
2. Create a new issue with:
   - Your OS and Node version
   - Complete error message
   - Steps to reproduce
3. Contact the maintainers

---

**Happy Coding! 🚀**
