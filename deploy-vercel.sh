#!/bin/bash

echo "🚀 Vercel + Railway Deployment Helper"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
    echo "✓ Git initialized"
else
    echo "✓ Git already initialized"
    echo "📝 Committing latest changes..."
    git add .
    git commit -m "Prepare for Vercel deployment" || echo "No changes to commit"
fi

echo ""
echo "📋 Deployment Instructions:"
echo ""
echo "STEP 1: Deploy Backend to Railway"
echo "=================================="
echo "1. Go to https://railway.app"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select your repository"
echo "4. ⚠️  IMPORTANT: Set Root Directory to 'backend'"
echo "5. Add environment variables (see below)"
echo "6. Wait for deployment"
echo "7. Copy your Railway URL"
echo ""
echo "Environment Variables for Railway:"
echo "-----------------------------------"
echo "SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co"
echo "SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDgwNzE2NSwiZXhwIjoyMDgwMzgzMTY1fQ.pXkSV9iT7XwsYaQhbafuhA1EQbcVyICDDk5j8tB8xtY"
echo "STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV"
echo "RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK"
echo "CORS_ORIGINS=*"
echo ""
read -p "Press Enter after Railway backend is deployed..."

echo ""
read -p "Enter your Railway backend URL (e.g., https://xyz.railway.app): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required!"
    exit 1
fi

echo ""
echo "STEP 2: Deploy Frontend to Vercel"
echo "=================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✓ Vercel CLI ready"
echo ""
echo "Choose deployment method:"
echo "1. Deploy via Vercel CLI (automated)"
echo "2. Deploy via Vercel Dashboard (manual)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🚀 Deploying to Vercel..."
    
    # Create temporary .env for Vercel
    cd frontend
    echo "REACT_APP_BACKEND_URL=$BACKEND_URL" > .env.production
    echo "REACT_APP_SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co" >> .env.production
    echo "REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo" >> .env.production
    
    vercel --prod
    
    cd ..
    echo ""
    echo "✓ Frontend deployed!"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "📋 Manual Deployment Steps:"
    echo ""
    echo "1. Go to https://vercel.com/new"
    echo "2. Import your GitHub repository"
    echo "3. Configure:"
    echo "   - Root Directory: frontend"
    echo "   - Framework: Create React App"
    echo "   - Build Command: yarn build"
    echo "   - Output Directory: build"
    echo ""
    echo "4. Add Environment Variables:"
    echo "   REACT_APP_BACKEND_URL=$BACKEND_URL"
    echo "   REACT_APP_SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co"
    echo "   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG5sZ2VhemNpbmZiY3ZoY3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDcxNjUsImV4cCI6MjA4MDM4MzE2NX0.rRe864VNE6JmKvA2lNZM9wQkd2DBgtEtbxYm37MmENo"
    echo ""
    echo "5. Click Deploy!"
    echo ""
    read -p "Press Enter after Vercel deployment is complete..."
    
    read -p "Enter your Vercel URL (e.g., https://your-app.vercel.app): " FRONTEND_URL
    
    if [ ! -z "$FRONTEND_URL" ]; then
        echo ""
        echo "STEP 3: Update CORS on Railway"
        echo "==============================="
        echo ""
        echo "Go to Railway dashboard and update:"
        echo "CORS_ORIGINS=$FRONTEND_URL"
        echo ""
    fi
else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "Your app is live:"
echo "Frontend: Check your Vercel dashboard"
echo "Backend: $BACKEND_URL"
echo ""
echo "Next steps:"
echo "1. Update CORS_ORIGINS on Railway to your Vercel URL"
echo "2. Test your app"
echo "3. Update admin password"
echo "4. Replace Stripe test keys with production keys"
echo ""
