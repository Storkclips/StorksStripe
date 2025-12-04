# 🔴 CRITICAL: How to Set Root Directory in Vercel

## The Problem

Vercel is running: `cd frontend && yarn install`

This means the **Root Directory is NOT set** in your Vercel project.

When root directory IS set correctly, Vercel runs: `yarn install` (no cd command)

---

## Solution: Set Root Directory Correctly

### Method 1: During Initial Import (Start Fresh)

**Step 1: Delete Old Project**
1. Go to your Vercel dashboard
2. Find your project
3. Settings → General → scroll to bottom
4. Click "Delete Project"
5. Confirm deletion

**Step 2: Import Fresh**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo
4. **STOP! Don't click Deploy yet!**

**Step 3: Configure Project (BEFORE deploying)**

You'll see a screen like this:

```
┌─────────────────────────────────────────────────────────┐
│ Configure Project                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Project Name:                                           │
│ ┌─────────────────────────────────────┐                │
│ │ your-tipping-app                    │                │
│ └─────────────────────────────────────┘                │
│                                                         │
│ Framework Preset:                                       │
│ ┌─────────────────────────────────────┐                │
│ │ Create React App              [▼]  │ ← Select this  │
│ └─────────────────────────────────────┘                │
│                                                         │
│ Root Directory:                    [Edit]               │
│ ┌─────────────────────────────────────┐                │
│ │ ./                                  │ ← CLICK "Edit" │
│ └─────────────────────────────────────┘                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Step 4: Click "Edit" next to Root Directory**

A popup will appear showing your repository structure:

```
┌─────────────────────────────────────────────────────────┐
│ Select Root Directory                            [Close]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Repository Structure:                                   │
│                                                         │
│ ☐ .github/                                              │
│ ☐ backend/                                              │
│ ☑ frontend/           ← CHECK THIS BOX!                │
│   ├─ public/                                            │
│   ├─ src/                                               │
│   ├─ package.json                                       │
│   └─ ...                                                │
│ ☐ tests/                                                │
│ ☐ README.md                                             │
│                                                         │
│                                        [Continue]       │
└─────────────────────────────────────────────────────────┘
```

**Step 5: Select `frontend` folder**
- Click on the `frontend` folder checkbox
- Click "Continue"

Now you should see:

```
Root Directory:                    [Edit]
┌─────────────────────────────────────┐
│ frontend                            │ ← Should say "frontend"
└─────────────────────────────────────┘
```

**Step 6: Add Environment Variables**

Scroll down to "Environment Variables" section and add:

```
REACT_APP_BACKEND_URL = [your-railway-url]
REACT_APP_SUPABASE_URL = https://mltnlgeazcinfbcvhcut.supabase.co
REACT_APP_SUPABASE_ANON_KEY = eyJhbGciOiJI...
```

**Step 7: Deploy**

Click "Deploy" button

---

### Method 2: Update Existing Project

If you don't want to delete and recreate:

**Step 1: Go to Project Settings**
1. Open your Vercel project
2. Click "Settings" tab at the top

**Step 2: Find General Settings**
1. In the left sidebar, click "General"
2. Scroll down to find "Root Directory"

**Step 3: Edit Root Directory**

You'll see:

```
Root Directory

The directory within your project from which your Vercel Project will be built.

┌─────────────────────────────────────┐
│ ./                          [Edit]  │ ← Currently blank or "./"
└─────────────────────────────────────┘

This is the default setting.
```

**Step 4: Click "Edit"**

A modal will appear:

```
┌─────────────────────────────────────────────────────────┐
│ Edit Root Directory                              [Close]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ☐ backend/                                              │
│ ☑ frontend/           ← SELECT THIS!                   │
│ ☐ tests/                                                │
│                                                         │
│                                        [Save]           │
└─────────────────────────────────────────────────────────┘
```

**Step 5: Select frontend and Save**
- Click the checkbox next to `frontend/`
- Click "Save"

**Step 6: Redeploy**
1. Go to "Deployments" tab
2. Click latest deployment
3. Click "..." menu → "Redeploy"

---

## How to Verify It's Set Correctly

### In Project Settings:

```
Root Directory

┌─────────────────────────────────────┐
│ frontend                    [Edit]  │ ← Should say "frontend"
└─────────────────────────────────────┘
```

**NOT:**
```
┌─────────────────────────────────────┐
│ ./                          [Edit]  │ ← This is WRONG
└─────────────────────────────────────┘
```

### In Build Logs:

When root directory is correct, the build log will show:

```
[12:34:56.789] Running "yarn install" in frontend directory...
[12:34:57.000] Installing dependencies...
```

**NOT:**
```
[12:34:56.789] Running "cd frontend && yarn install"...  ← This is WRONG
```

---

## Why This Happens

Vercel defaults to deploying the **root** of your repository.

Your project structure is:
```
/
├── backend/
└── frontend/
```

Without setting root directory, Vercel tries to deploy `/` (the root), which doesn't have a `package.json`, so it can't find the React app.

When you set root directory to `frontend`, Vercel deploys from `/frontend` which has the React app.

---

## Screenshot Guide

### What You Should See:

**✅ CORRECT Configuration:**

```
┌──────────────────────────────────────────┐
│ Configure Project                        │
├──────────────────────────────────────────┤
│ Framework Preset: Create React App       │
│ Root Directory: frontend          [Edit] │
│ Build Command: yarn build                │
│ Output Directory: build                  │
│ Install Command: yarn install            │
└──────────────────────────────────────────┘
```

**❌ WRONG Configuration:**

```
┌──────────────────────────────────────────┐
│ Configure Project                        │
├──────────────────────────────────────────┤
│ Framework Preset: Other                  │
│ Root Directory: ./                [Edit] │ ← WRONG!
│ Build Command: cd frontend && yarn build │
│ Output Directory: frontend/build         │
│ Install Command: cd frontend && ...      │
└──────────────────────────────────────────┘
```

---

## Alternative: Deploy Only Frontend

If you keep having issues, you can deploy the frontend folder directly:

### Option A: Push Frontend to Separate Repo

1. Create new GitHub repo (e.g., `tipping-app-frontend`)
2. Copy only the `/frontend` folder contents to this new repo
3. Deploy this new repo in Vercel (no root directory needed)

### Option B: Use Vercel CLI from Frontend Folder

```bash
cd frontend
vercel --prod
```

This deploys from the frontend directory directly.

---

## Still Not Working?

**Share these details:**

1. Screenshot of Vercel project settings showing:
   - Root Directory field
   - Build settings

2. First 20 lines of build log from Vercel

3. Your GitHub repository structure (run: `ls -la`)

Then we can diagnose the exact issue!

---

## Quick Checklist

Before deploying, verify:

- [ ] Root Directory is set to: `frontend` (not blank, not `./`)
- [ ] Framework Preset is: Create React App
- [ ] 3 environment variables added
- [ ] Railway backend is already deployed and running
- [ ] You have the Railway backend URL

If all checked, deployment should work! ✅
