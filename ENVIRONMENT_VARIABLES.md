# 🔑 Environment Variables Quick Reference

## Files in Your GitHub Repo

### 📄 `vercel-env-template.txt`
Template file with all required environment variables.
**Download this, edit it, and import into Vercel!**

### 📄 `vercel-env-variables.json`
JSON format of the same variables (alternative format).

---

## For Vercel (Frontend)

Copy these **3 variables** into Vercel dashboard:

### Variable 1: Backend URL
```
Name:  REACT_APP_BACKEND_URL
Value: [YOUR-RAILWAY-BACKEND-URL]
```
⚠️ **Replace with your actual Railway URL**

**How to get:**
1. Deploy backend to Railway first
2. Railway Dashboard → Your Service → Domains
3. Copy the URL (e.g., `https://web-production-abc123.up.railway.app`)

---

### Variable 2: Supabase URL
```
Name:  REACT_APP_SUPABASE_URL
Value: https://mltnlgeazcinfbcvhcut.supabase.co
```
✅ **Already filled - copy as is**

---

### Variable 3: Supabase Anon Key
```
Name:  REACT_APP_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo
```
✅ **Already filled - copy as is**

---

## For Railway (Backend)

Add these **5 variables** in Railway dashboard:

### Variable 1: Supabase URL
```
SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co
```

### Variable 2: Supabase Service Key
```
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgwNzE2NSwiZXhwIjoyMDgwMzgzMTY1fQ.pXkSV9iT7XwsYaQhbafuhA1EQbcVyICDDk5j8tB8xtY
```

### Variable 3: Stripe API Key
```
STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV
```

### Variable 4: Resend API Key
```
RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK
```

### Variable 5: CORS Origins
```
CORS_ORIGINS=*
```
⚠️ **After deploying to Vercel, update this to your Vercel URL**

Example: `CORS_ORIGINS=https://your-app.vercel.app`

---

## Quick Copy-Paste for Vercel

**Open this file in GitHub and copy:**

```env
REACT_APP_BACKEND_URL="[PASTE-YOUR-RAILWAY-URL-HERE]"
REACT_APP_SUPABASE_URL="https://mltnlgeazcinfbcvhcut.supabase.co"
REACT_APP_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo"
```

**How to use:**
1. Replace `[PASTE-YOUR-RAILWAY-URL-HERE]` with your Railway URL
2. In Vercel dashboard, add these 3 variables one by one
3. Deploy!

---

## Step-by-Step Deployment Order

```
1. Deploy Backend to Railway
   ├─ Add 5 environment variables (listed above)
   └─ Copy Railway URL after deployment
   
2. Deploy Frontend to Vercel
   ├─ Add 3 environment variables
   └─ Use Railway URL from step 1
   
3. Update CORS on Railway
   └─ Change CORS_ORIGINS to your Vercel URL
```

---

## Verification Checklist

### ✅ Railway Backend Variables:
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_KEY
- [ ] STRIPE_API_KEY
- [ ] RESEND_API_KEY
- [ ] CORS_ORIGINS

### ✅ Vercel Frontend Variables:
- [ ] REACT_APP_BACKEND_URL (with Railway URL)
- [ ] REACT_APP_SUPABASE_URL
- [ ] REACT_APP_SUPABASE_ANON_KEY

### ✅ After Deployment:
- [ ] Update CORS_ORIGINS on Railway to Vercel URL
- [ ] Test payment flow
- [ ] Test admin login

---

## Common Mistakes to Avoid

❌ **Wrong:**
```
REACT_APP_BACKEND_URL=http://localhost:8001
```
✅ **Correct:**
```
REACT_APP_BACKEND_URL=https://your-app.railway.app
```

---

❌ **Wrong:**
```
REACT_APP_BACKEND_URL=https://your-app.railway.app/
```
(Trailing slash)

✅ **Correct:**
```
REACT_APP_BACKEND_URL=https://your-app.railway.app
```

---

❌ **Wrong:**
```
BACKEND_URL=...
```
(Missing REACT_APP_ prefix)

✅ **Correct:**
```
REACT_APP_BACKEND_URL=...
```

---

## Need Help?

📖 **Detailed guides in your repo:**
- `VERCEL_ENV_VARS_GUIDE.md` - Complete breakdown
- `DEPLOYMENT_VISUAL_GUIDE.md` - Visual diagrams
- `DEPLOY_NOW.md` - Quick 5-minute guide
