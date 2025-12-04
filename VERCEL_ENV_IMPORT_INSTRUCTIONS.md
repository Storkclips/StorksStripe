# 📥 Import Environment Variables into Vercel

## Method 1: Using Template File (Easiest)

### Step 1: Download and Edit the Template

1. In your GitHub repo, find the file: **`vercel-env-template.txt`**
2. Download it to your computer
3. Open in a text editor
4. Replace `REPLACE_WITH_YOUR_RAILWAY_URL` with your actual Railway backend URL
5. Save as `vercel.env` (remove the `-template.txt` part)

**Example:**
```env
# Before
REACT_APP_BACKEND_URL="REPLACE_WITH_YOUR_RAILWAY_URL"

# After (replace with your actual Railway URL)
REACT_APP_BACKEND_URL="https://web-production-abc123.up.railway.app"
```

### Step 2: Import in Vercel Dashboard

**Option A: During Initial Setup**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. In the "Environment Variables" section, click **"Import .env"**
4. Select the `vercel.env` file you just created (the edited template)
5. Click "Deploy"

**OR use the JSON file:**
1. Find `vercel-env-variables.json` in your repo
2. Edit the Railway URL in that file
3. In Vercel, you can paste the JSON values directly

**Option B: After Project is Created**

1. Go to your Vercel project dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in sidebar
4. Click **"Import .env"** button
5. Select the `vercel.env` file
6. Click "Import"
7. **Important:** Go to "Deployments" tab and click "Redeploy"

---

## Method 2: Copy-Paste (Alternative)

If import doesn't work, copy-paste each variable manually:

### Variables to Add in Vercel:

**Variable 1:**
```
Name:  REACT_APP_BACKEND_URL
Value: [YOUR-RAILWAY-URL]
```

**Variable 2:**
```
Name:  REACT_APP_SUPABASE_URL
Value: https://mltnlgeazcinfbcvhcut.supabase.co
```

**Variable 3:**
```
Name:  REACT_APP_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo
```

**For each variable, select:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

## Method 3: Using Vercel CLI

If you prefer command line:

```bash
# Navigate to your project root
cd /app

# Update vercel.env with your Railway URL first!

# Then import
vercel env pull .env.local

# Or add manually via CLI
vercel env add REACT_APP_BACKEND_URL production
# Paste your Railway URL when prompted

vercel env add REACT_APP_SUPABASE_URL production
# Paste: https://mltnlgeazcinfbcvhcut.supabase.co

vercel env add REACT_APP_SUPABASE_ANON_KEY production
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Deploy with new env vars
vercel --prod
```

---

## Where to Find Your Railway Backend URL

### Visual Guide:

```
1. Go to https://railway.app/dashboard
2. Click your project
3. Click your backend service
4. Look for "Domains" section

   ┌────────────────────────────────────┐
   │  Domains                           │
   │                                    │
   │  Public Networking                 │
   │  ┌──────────────────────────────┐ │
   │  │ https://web-production-      │ │ ← Copy this!
   │  │ abc123.up.railway.app        │ │
   │  └──────────────────────────────┘ │
   └────────────────────────────────────┘
```

### Copy the URL that looks like:
- `https://web-production-abc123.up.railway.app`
- `https://backend-production-xyz.railway.app`
- `https://your-app-name.railway.app`

**Important:**
- ✅ Use `https://` (not http)
- ✅ NO trailing slash at the end
- ✅ Don't include `/api` at the end

---

## Verification Checklist

After importing, verify in Vercel dashboard:

```
Settings → Environment Variables

Should see:

☑ REACT_APP_BACKEND_URL = https://your-railway-url.railway.app
☑ REACT_APP_SUPABASE_URL = https://mltnlgeazcinfbcvhcut.supabase.co
☑ REACT_APP_SUPABASE_ANON_KEY = eyJhbGciOiJI...

All with:
☑ Production environment selected
☑ Preview environment selected
☑ Development environment selected
```

---

## Troubleshooting

### ❌ Import button not visible

**Solution:** Make sure you're in:
- Settings → Environment Variables (if project exists)
- Or during initial project setup

### ❌ Variables not working after import

**Solution:** Redeploy your project
1. Go to "Deployments" tab
2. Click latest deployment → "Redeploy"

### ❌ File not found

**Solution:** The file is located at `/app/vercel.env`
- Use absolute path when importing
- Or navigate to project root first

### ❌ Railway URL is wrong

**Solution:** Check the URL format:
```
✅ Correct: https://web-production-abc.railway.app
❌ Wrong: http://web-production-abc.railway.app (no https)
❌ Wrong: https://web-production-abc.railway.app/ (trailing slash)
❌ Wrong: https://0.0.0.0:8001 (local URL)
```

---

## Quick Start Summary

```bash
# 1. Edit vercel.env file
nano vercel.env  # or use any text editor

# 2. Replace REPLACE_WITH_YOUR_RAILWAY_URL with actual URL

# 3. Import in Vercel dashboard
# Settings → Environment Variables → Import .env → Select vercel.env

# 4. Redeploy
# Deployments → Redeploy

# Done! ✅
```

---

## Alternative: Pre-filled File

If you know your Railway URL now, I can create a pre-filled file:

**Tell me your Railway backend URL and I'll create a ready-to-import file!**

Example:
```
Railway URL: https://web-production-abc123.up.railway.app
```

Then the `vercel.env` will be automatically filled and ready to import.

---

## Need More Help?

- **Detailed guide:** `VERCEL_ENV_VARS_GUIDE.md`
- **Visual guide:** `DEPLOYMENT_VISUAL_GUIDE.md`
- **Quick guide:** `DEPLOY_NOW.md`
