# Railway Deployment Guide - QuickAI Backend

## 🚨 Issue: Missing Environment Variables

Your Railway deployment is crashing because **environment variables are not configured**. Railway needs these variables to connect to your database, APIs, and services.

---

## ✅ Step-by-Step Fix

### 1. **Go to Railway Project Settings**
   - Open your Railway dashboard: https://railway.app/
   - Select your QuickAI backend project
   - Click on the **service/deployment**
   - Go to the **"Variables"** tab

### 2. **Add ALL Required Environment Variables**

Copy and paste each variable below into Railway's Variables section:

#### **🗄️ Database (CRITICAL)**
```
DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require
```
- **Where to get it**: 
  1. Go to https://neon.tech/
  2. Create a free account (no credit card needed)
  3. Create a new database
  4. Copy the connection string from "Connection Details"
  5. Paste it into Railway as `DATABASE_URL`

#### **🤖 AI API (CRITICAL)**
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```
- **Where to get it**:
  1. Go to https://console.groq.com/
  2. Sign up (free, no credit card)
  3. Go to "API Keys" section
  4. Create a new API key
  5. Copy and paste into Railway as `GROQ_API_KEY`

#### **☁️ Cloudinary (For Image Uploads)**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```
- **Where to get it**:
  1. Go to https://cloudinary.com/
  2. Sign up (free tier available)
  3. Go to Dashboard
  4. Copy: Cloud Name, API Key, API Secret
  5. Add all three to Railway

#### **🖼️ ClickDrop API (For Background Removal)**
```
CLICKDROP_API_KEY=your_clickdrop_api_key
```
- **Where to get it**:
  1. Sign up at https://www.clickdrop.ai/ (or your provider)
  2. Get API key from dashboard
  3. Add to Railway

#### **🔐 Clerk Authentication**
```
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```
- **Where to get it**:
  1. Go to https://dashboard.clerk.com/
  2. Select your app
  3. Go to "API Keys"
  4. Copy "Secret Key"
  5. Add to Railway as `CLERK_SECRET_KEY`

#### **🌐 Frontend URL (Optional but Recommended)**
```
CLIENT_ORIGIN=https://your-frontend.vercel.app
```
- Replace with your actual frontend URL
- For testing, you can use: `http://localhost:5173`

---

### 3. **Redeploy on Railway**

After adding all variables:
1. Railway will automatically redeploy
2. OR click **"Deploy"** button manually
3. Check the **"Deployments"** tab for logs
4. The deployment should now succeed ✅

---

## 🔍 How to Verify It's Working

1. Check Railway logs (should show: "Server running on port 3000")
2. Visit your Railway URL in browser
3. You should see: `"Server is Live"`

---

## ⚠️ Common Issues

### Issue: "Database connection string missing"
- **Solution**: Make sure `DATABASE_URL` is exactly copied from Neon
- Check for no extra spaces or quotes

### Issue: "Missing credentials for OpenAI"
- **Solution**: Add `GROQ_API_KEY` (not OPENAI_API_KEY)
- Your app uses Groq, not OpenAI

### Issue: "Cannot read property of undefined"
- **Solution**: Double-check all variable names are spelled EXACTLY as shown
- Railway variable names are case-sensitive

---

## 📋 Complete Checklist

Before trying again, make sure you have:

- [ ] `DATABASE_URL` - from Neon
- [ ] `GROQ_API_KEY` - from Groq Console
- [ ] `CLOUDINARY_CLOUD_NAME` - from Cloudinary
- [ ] `CLOUDINARY_API_KEY` - from Cloudinary
- [ ] `CLOUDINARY_API_SECRET` - from Cloudinary
- [ ] `CLICKDROP_API_KEY` - from ClickDrop
- [ ] `CLERK_SECRET_KEY` - from Clerk
- [ ] `CLIENT_ORIGIN` - Your frontend URL (optional)

---

## 🎯 Quick Railway Setup

```bash
# 1. Install Railway CLI (optional)
npm i -g @railway/cli

# 2. Login
railway login

# 3. Link to your project
railway link

# 4. Add variables from command line (alternative method)
railway variables set DATABASE_URL="your_database_url"
railway variables set GROQ_API_KEY="your_groq_key"
# ... add all other variables

# 5. Deploy
railway up
```

---

## 🆘 Still Having Issues?

1. **Check Railway Logs**: Look for specific error messages
2. **Verify Each Variable**: Make sure no typos
3. **Test Locally First**: 
   ```bash
   cd server
   npm install
   # Create a .env file with all variables
   npm start
   ```
4. **Database Connection**: Test your DATABASE_URL connects
5. **API Keys**: Verify each API key is valid and not expired

---

## 📝 Notes

- Railway automatically sets the `PORT` variable - don't add it manually
- All variable values should be pasted **without quotes**
- After adding variables, Railway auto-redeploys
- Your server needs ALL critical variables to start successfully

Good luck! 🚀
