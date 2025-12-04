# 🎯 Tipping Page App - Deployment Ready

## What You Have

A complete **Streamlabs-like tipping platform** with:
- ✅ Stripe payment integration
- ✅ Cyberpunk OBS alerts
- ✅ Admin authentication
- ✅ Password management
- ✅ Supabase database
- ✅ Real-time tip notifications

## Deploy in 5 Minutes

### Quick Start: Read `DEPLOY_NOW.md`

**TL;DR:**
1. Deploy **backend** to Railway (set root dir to `backend`)
2. Deploy **frontend** to Vercel (set root dir to `frontend`)
3. Update CORS with Vercel URL

### Detailed Guides

📖 **Full Vercel Guide:** `VERCEL_DEPLOYMENT.md`
📖 **Quick Reference:** `DEPLOY_NOW.md`

### Automated Script

```bash
./deploy-vercel.sh
```

## Architecture

```
Users → Vercel (React) → Railway (FastAPI) → Supabase (PostgreSQL)
                              ↓
                         Stripe API
```

## Default Credentials

**Admin Login:**
- Email: `admin@tippingpage.com`
- Password: `Admin@123`

⚠️ **Change these after first login!**

## Environment Variables Needed

### Backend (Railway)
```env
SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
SUPABASE_SERVICE_KEY=<your-key>
STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV
RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK
CORS_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_BACKEND_URL=https://your-backend.railway.app
REACT_APP_SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
```

## Production Checklist

Before going live:
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Update CORS with Vercel URL
- [ ] Test payment flow
- [ ] Change admin password
- [ ] Replace Stripe test keys with production
- [ ] Test OBS alerts
- [ ] Verify Supabase tables exist

## Cost

- **Vercel:** Free
- **Railway:** $5/month (or $5 free credit)
- **Supabase:** Free tier
- **Total:** ~$5/month

## Support

- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Issues: Check deployment guides above

## File Structure

```
/app/
├── backend/          # FastAPI server
├── frontend/         # React app
├── vercel.json       # Vercel config
├── railway.json      # Railway config (unused for split deploy)
└── DEPLOY_NOW.md     # Quick deploy guide
```

## Key Features

🎯 **Tipping System**
- Custom amounts
- Preset amounts ($5, $10, $25, $50, $100)
- Optional messages
- Stripe integration

🔐 **Admin Panel**
- Secure login
- Password management
- Alert testing dashboard

📺 **OBS Alerts**
- Cyberpunk-styled alerts
- Real-time notifications
- Transparent background

💾 **Database**
- Supabase PostgreSQL
- Secure credential storage
- Transaction history

## Next Steps After Deployment

1. **Custom Domain** (optional)
   - Vercel: Project Settings → Domains
   - Railway: Service Settings → Domains

2. **Production Stripe Keys**
   - Get from https://dashboard.stripe.com
   - Update in Railway env vars

3. **Monitoring**
   - Vercel Analytics (built-in)
   - Railway Metrics (built-in)

4. **Backups**
   - Supabase auto-backups (check dashboard)

---

Made with ❤️ for streamers and content creators
