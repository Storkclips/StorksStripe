# 🚀 Quick Deploy to Railway

## Fastest Method: GitHub + Railway (5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to **https://railway.app**
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Click **"Deploy from GitHub repo"**
5. Select your repository
6. Railway auto-detects configuration ✅

### Step 3: Add Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```env
SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgwNzE2NSwiZXhwIjoyMDgwMzgzMTY1fQ.pXkSV9iT7XwsYaQhbafuhA1EQbcVyICDDk5j8tB8xtY
STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV
RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK
CORS_ORIGINS=*
```

### Step 4: Done! 🎉
- Railway automatically builds and deploys
- Get your live URL from dashboard
- App is live in ~3-5 minutes

---

## Alternative: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Run deployment script
./deploy-to-railway.sh
```

---

## Important Notes

### Backend vs Frontend
**Recommended Approach:**
- Deploy **backend only** to Railway
- Deploy **frontend** to Vercel/Netlify (free, faster, optimized)

**Why?**
- Railway is perfect for Python/FastAPI backend
- Vercel/Netlify are optimized for React frontend
- Saves costs and improves performance

### If deploying frontend to Vercel/Netlify:
1. Deploy backend to Railway first
2. Get Railway backend URL (e.g., `https://your-app.railway.app`)
3. Update frontend `.env`:
   ```
   REACT_APP_BACKEND_URL=https://your-app.railway.app
   ```
4. Deploy frontend to Vercel/Netlify

---

## Production Checklist

Before going live:
- [ ] Replace Stripe test keys with production keys
- [ ] Update `CORS_ORIGINS` to your frontend domain
- [ ] Verify Supabase tables are created
- [ ] Change admin password from default
- [ ] Test full payment flow
- [ ] Test OBS alerts page

---

## Cost Estimate

**Railway:**
- Free tier: $5 credit/month (good for testing)
- Hobby: $5/month (recommended)

**Vercel (for frontend):**
- Free tier: Perfect for this app

**Total: ~$5/month for production**

---

## Need Help?

- Read full guide: `RAILWAY_DEPLOYMENT.md`
- Railway docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
