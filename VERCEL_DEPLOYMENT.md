# Vercel Deployment Guide

## Overview

We'll use a **split deployment** approach:
- **Frontend (React)** → Vercel (free, optimized for React)
- **Backend (FastAPI)** → Railway or Render (Python support)

This is the **recommended approach** for FastAPI + React apps!

## Step 1: Deploy Backend to Railway

### Create Backend-Only Railway Project

1. **Go to Railway Dashboard:**
   - https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure Backend Service:**
   - Set **Root Directory** to: `backend`
   - Railway will auto-detect Python/FastAPI

3. **Add Environment Variables:**
   ```env
   SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgwNzE2NSwiZXhwIjoyMDgwMzgzMTY1fQ.pXkSV9iT7XwsYaQhbafuhA1EQbcVyICDDk5j8tB8xtY
   STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV
   RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK
   CORS_ORIGINS=*
   PORT=8001
   ```

4. **Deploy & Get URL:**
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

## Step 2: Deploy Frontend to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel:**
   - https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Build Settings:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`
   - **Install Command:** `yarn install`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app
   REACT_APP_SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Option B: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Add Environment Variables:**
   ```bash
   vercel env add REACT_APP_BACKEND_URL
   # Enter: https://your-backend.railway.app
   
   vercel env add REACT_APP_SUPABASE_URL
   # Enter: https://mltnlgeazcinfbcvhcut.supabase.co
   
   vercel env add REACT_APP_SUPABASE_ANON_KEY
   # Enter: your-supabase-anon-key
   ```

5. **Redeploy with env vars:**
   ```bash
   vercel --prod
   ```

## Step 3: Update Backend CORS

Once you have your Vercel frontend URL:

1. Go to Railway dashboard
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
3. Redeploy backend

## Step 4: Test Everything

✅ Visit your Vercel URL
✅ Test tipping flow (Stripe checkout)
✅ Test admin login
✅ Test password change
✅ Test OBS alerts page

## Project Structure After Deployment

```
┌─────────────────┐
│   Vercel        │
│   (Frontend)    │  ← Users visit here
│   React App     │
└────────┬────────┘
         │ API calls
         ↓
┌─────────────────┐
│   Railway       │
│   (Backend)     │
│   FastAPI       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Supabase      │
│   (Database)    │
└─────────────────┘
```

## Cost Breakdown

**Vercel:**
- Free tier: Perfect for this app
- Unlimited bandwidth
- Global CDN

**Railway (Backend only):**
- Free tier: $5 credit/month
- Hobby: $5/month (recommended)

**Total: ~$0-5/month**

## Troubleshooting

### Frontend Build Fails
- Check Node.js version (Vercel uses Node 18+ by default)
- Verify all dependencies in package.json
- Check Vercel build logs

### Backend Not Connecting
- Verify `REACT_APP_BACKEND_URL` is correct
- Check Railway backend is running
- Verify CORS settings

### CORS Errors
- Update `CORS_ORIGINS` in Railway to include Vercel URL
- Format: `https://your-app.vercel.app` (no trailing slash)

### Environment Variables Not Working
- Vercel: Must start with `REACT_APP_`
- Redeploy after adding env vars

## Production Checklist

- [ ] Backend deployed to Railway with correct env vars
- [ ] Frontend deployed to Vercel
- [ ] `REACT_APP_BACKEND_URL` points to Railway URL
- [ ] `CORS_ORIGINS` includes Vercel URL
- [ ] Supabase tables created
- [ ] Replace Stripe test keys with production keys
- [ ] Test full payment flow
- [ ] Update admin password from default
- [ ] Test OBS alerts page
- [ ] Custom domain configured (optional)

## Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain (e.g., tips.yourdomain.com)
3. Follow DNS configuration instructions

### For Railway (Backend):
1. Go to Service Settings → Domains
2. Add custom domain
3. Update DNS records
4. Update `REACT_APP_BACKEND_URL` on Vercel

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Vercel Discord: https://vercel.com/discord
- Railway Discord: https://discord.gg/railway
