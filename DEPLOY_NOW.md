# 🚀 Deploy Your App Now! (5 Minutes)

## Quick Deploy Steps

### 1️⃣ Deploy Backend to Railway (2 min)

```bash
# Push code to GitHub if not already done
git add .
git commit -m "Ready for deployment"
git push
```

**Then:**
1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. **IMPORTANT:** Set Root Directory to `backend`
4. Add these environment variables:
   ```
   SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgwNzE2NSwiZXhwIjoyMDgwMzgzMTY1fQ.pXkSV9iT7XwsYaQhbafuhA1EQbcVyICDDk5j8tB8xtY
   STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV
   RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK
   CORS_ORIGINS=*
   ```
5. Wait for deployment (~2 min)
6. **Copy your Railway URL** (e.g., `https://xyz.railway.app`)

---

### 2️⃣ Deploy Frontend to Vercel (2 min)

**Option A: Vercel Dashboard (Easiest)**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Configure:**
   - Root Directory: `frontend`
   - Framework: Create React App
   - Build Command: `yarn build`
   - Output Directory: `build`

4. **Add Environment Variables:**
   ```
   REACT_APP_BACKEND_URL=<YOUR-RAILWAY-URL>
   REACT_APP_SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo
   ```

5. Click "Deploy" and wait (~2 min)

**Option B: Vercel CLI (Fast)**

```bash
npm install -g vercel
cd frontend
vercel --prod
```

Then add env vars in Vercel dashboard.

---

### 3️⃣ Update CORS (1 min)

1. Go to Railway dashboard
2. Update `CORS_ORIGINS` to your Vercel URL:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
3. Save (Railway auto-redeploys)

---

## ✅ Done!

Your app is now live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.railway.app
- **Database:** Supabase (already set up)

---

## Test Your Deployment

1. Visit your Vercel URL
2. Try creating a test tip ($5)
3. Login to admin (admin@tippingpage.com / Admin@123)
4. Test OBS alerts: `/alerts`

---

## What You Get

✅ **Professional hosting** (Vercel + Railway)
✅ **Free tier** for both (or ~$5/month for production)
✅ **Auto-deployments** from GitHub
✅ **Global CDN** for fast loading
✅ **HTTPS/SSL** automatically
✅ **99.9% uptime** guaranteed

---

## Need Help?

Read full guide: `VERCEL_DEPLOYMENT.md`
