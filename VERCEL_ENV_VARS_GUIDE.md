# 🔐 Vercel Environment Variables - Detailed Guide

## Step-by-Step: Adding Environment Variables in Vercel

### Method 1: During Initial Deployment (Recommended)

When you're setting up your project for the first time:

#### Step 1: After Importing GitHub Repo

You'll see a configuration screen. Scroll down to find **"Environment Variables"** section.

#### Step 2: Add Each Variable One by One

Click **"Add"** button for each variable below:

---

### Variable 1: Backend URL

**Name (Key):**
```
REACT_APP_BACKEND_URL
```

**Value:**
```
https://YOUR-RAILWAY-APP-NAME.railway.app
```

**Where to get this value:**
1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to "Settings" tab
4. Find "Domains" section
5. Copy the generated Railway domain (looks like: `https://web-production-abc123.up.railway.app`)
6. Paste it here (NO trailing slash!)

**Environment:** Select **"Production"**, **"Preview"**, and **"Development"**

**Important:** 
- ✅ Correct: `https://myapp.railway.app`
- ❌ Wrong: `https://myapp.railway.app/` (no trailing slash)
- ❌ Wrong: `http://myapp.railway.app` (use https)

---

### Variable 2: Supabase URL

**Name (Key):**
```
REACT_APP_SUPABASE_URL
```

**Value:**
```
https://mltnlgeazcinfbcvhcut.supabase.co
```

**Where to get this value:**
- Already provided above (your Supabase project URL)
- Or find it in: Supabase Dashboard → Project Settings → API

**Environment:** Select **"Production"**, **"Preview"**, and **"Development"**

---

### Variable 3: Supabase Anon Key

**Name (Key):**
```
REACT_APP_SUPABASE_ANON_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo
```

**Where to get this value:**
- Already provided above (your Supabase anon/public key)
- Or find it in: Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`

**Environment:** Select **"Production"**, **"Preview"**, and **"Development"**

---

### Final Screen Should Look Like:

```
┌────────────────────────────────────────────────────────────────┐
│ Environment Variables                                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ REACT_APP_BACKEND_URL                                          │
│ https://your-app.railway.app                        [x] Remove │
│ Environments: Production, Preview, Development                 │
│                                                                │
│ REACT_APP_SUPABASE_URL                                         │
│ https://mltnlgeazcinfbcvhcut.supabase.co          [x] Remove │
│ Environments: Production, Preview, Development                 │
│                                                                │
│ REACT_APP_SUPABASE_ANON_KEY                                    │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...          [x] Remove │
│ Environments: Production, Preview, Development                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### Step 3: Click "Deploy"

Once all three variables are added, click the **"Deploy"** button at the bottom.

---

## Method 2: After Deployment (If You Forgot)

If you already deployed and need to add/update environment variables:

### Step 1: Go to Your Project

1. Log in to https://vercel.com
2. Click on your project from the dashboard

### Step 2: Go to Settings

1. Click **"Settings"** tab at the top
2. Click **"Environment Variables"** in the left sidebar

### Step 3: Add Variables

You'll see a form with three fields:

**Field 1: Name**
- Enter: `REACT_APP_BACKEND_URL`

**Field 2: Value**
- Enter: `https://your-railway-url.railway.app`

**Field 3: Environments**
- Check: ✅ Production
- Check: ✅ Preview  
- Check: ✅ Development

Click **"Save"**

Repeat for the other two variables.

### Step 4: Redeploy

**Important:** Environment variables only take effect after redeployment!

1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**

OR

1. Go to your project overview
2. Click **"Redeploy"** button at the top

---

## Method 3: Using Vercel CLI

If you prefer command line:

```bash
# Navigate to your frontend folder
cd frontend

# Add each environment variable
vercel env add REACT_APP_BACKEND_URL production
# When prompted, paste: https://your-railway-url.railway.app

vercel env add REACT_APP_SUPABASE_URL production
# When prompted, paste: https://mltnlgeazcinfbcvhcut.supabase.co

vercel env add REACT_APP_SUPABASE_ANON_KEY production
# When prompted, paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Redeploy with new environment variables
vercel --prod
```

---

## How to Find Your Railway Backend URL

### Option 1: Railway Dashboard

1. Go to https://railway.app/dashboard
2. Click on your project
3. Click on your backend service (should be named something like "backend" or "web")
4. Look for **"Domains"** section in the service view
5. Copy the URL (it will be auto-generated like `https://web-production-xxxx.up.railway.app`)

### Option 2: Railway Service Settings

1. In Railway dashboard, click your backend service
2. Go to **"Settings"** tab
3. Scroll to **"Domains"** section
4. Find **"Public Networking"**
5. Copy the generated domain

### Example Railway URLs:
- `https://web-production-a1b2.up.railway.app`
- `https://myapp-backend.railway.app` (if you set custom domain)
- `https://backend-production-xyz.railway.app`

---

## Troubleshooting

### ❌ "Environment variable not working"

**Solution:** Redeploy your Vercel app after adding variables
1. Vercel Dashboard → Deployments
2. Click latest deployment → Redeploy

### ❌ "Cannot connect to backend"

**Check:**
1. Railway backend is running (green status)
2. `REACT_APP_BACKEND_URL` has NO trailing slash
3. URL uses `https://` not `http://`
4. You redeployed Vercel after adding variables

### ❌ "CORS error"

**Solution:** Update Railway `CORS_ORIGINS`
1. Go to Railway dashboard
2. Click backend service → Variables
3. Update `CORS_ORIGINS` to your Vercel URL
4. Format: `https://your-app.vercel.app` (no trailing slash)

### ❌ "Variable name typo"

**Must be exactly:**
- `REACT_APP_BACKEND_URL` (not BACKEND_URL)
- `REACT_APP_SUPABASE_URL` (not SUPABASE_URL)  
- `REACT_APP_SUPABASE_ANON_KEY` (not SUPABASE_ANON_KEY)

**Note:** React requires `REACT_APP_` prefix for environment variables!

---

## Quick Copy-Paste Checklist

Use this checklist when adding variables:

```
☐ Variable 1:
  Name: REACT_APP_BACKEND_URL
  Value: https://[YOUR-RAILWAY-URL]
  
☐ Variable 2:
  Name: REACT_APP_SUPABASE_URL
  Value: https://mltnlgeazcinfbcvhcut.supabase.co
  
☐ Variable 3:
  Name: REACT_APP_SUPABASE_ANON_KEY
  Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo

☐ Clicked "Deploy" or "Save"
☐ Redeployed if added after initial deployment
```

---

## Video Tutorial Reference

If you prefer video:
1. Go to YouTube
2. Search: "How to add environment variables in Vercel"
3. Watch any recent tutorial (the UI is the same)

---

## Still Stuck?

1. **Read:** DEPLOY_NOW.md (simplified version)
2. **Run:** `./deploy-vercel.sh` (automated script)
3. **Ask:** Vercel Discord - https://vercel.com/discord
