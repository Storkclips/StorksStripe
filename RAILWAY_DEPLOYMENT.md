# Railway Deployment Guide

## Prerequisites
1. Create a Railway account at https://railway.app
2. Install Railway CLI (optional): `npm install -g @railway/cli`

## Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Railway:**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect the configuration

3. **Configure Environment Variables:**
   Go to your project settings and add:
   
   **Backend Variables:**
   ```
   SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgwNzE2NSwiZXhwIjoyMDgwMzgzMTY1fQ.pXkSV9iT7XwsYaQhbafuhA1EQbcVyICDDk5j8tB8xtY
   STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV
   RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK
   CORS_ORIGINS=*
   PORT=8001
   ```
   
   **Frontend Variables (if deploying separately):**
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app
   REACT_APP_SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo
   ```

4. **Deploy:**
   - Railway will automatically build and deploy
   - Wait for deployment to complete
   - Get your production URL from Railway dashboard

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize Project:**
   ```bash
   railway init
   ```

4. **Add Environment Variables:**
   ```bash
   railway variables set SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
   railway variables set SUPABASE_SERVICE_KEY=<your-key>
   railway variables set STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV
   railway variables set RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK
   railway variables set CORS_ORIGINS=*
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

## Important Notes

### Backend-Only Deployment
Railway is best for deploying your **backend only**. For the frontend:
- Deploy React to **Vercel** or **Netlify** (free and optimized for React)
- Update `REACT_APP_BACKEND_URL` to point to your Railway backend URL

### Full-Stack Deployment
If deploying both on Railway:
1. Create **two separate services** in Railway
2. Deploy backend to one service
3. Deploy frontend to another service
4. Configure frontend to use backend URL

### Production Checklist
- [ ] Update Stripe keys to production keys (remove `_test_`)
- [ ] Set `CORS_ORIGINS` to your actual frontend domain
- [ ] Verify Supabase RLS policies
- [ ] Test payment flow end-to-end
- [ ] Update admin credentials
- [ ] Test OBS alerts page

## Database Setup

Your app uses **external Supabase** - no additional database setup needed on Railway!
Just ensure your Supabase tables are created (see /app/SUPABASE_SETUP.md)

## Troubleshooting

**Build fails:**
- Check Railway build logs
- Verify all dependencies in requirements.txt and package.json

**App crashes on start:**
- Check environment variables are set correctly
- Review Railway deployment logs
- Ensure PORT variable is used correctly

**CORS errors:**
- Update CORS_ORIGINS to include your frontend domain
- Format: `https://yourdomain.com` (no trailing slash)

## Cost

- **Free Tier:** $5 credit/month (good for testing)
- **Hobby Plan:** $5/month (recommended for production)
- **Pro Plan:** $20/month (for higher traffic)

## Support

Railway Documentation: https://docs.railway.app
Railway Discord: https://discord.gg/railway
