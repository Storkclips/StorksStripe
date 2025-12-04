#!/bin/bash

echo "🚂 Railway Deployment Setup Script"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git already initialized"
fi

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo ""
    echo "❌ Railway CLI not found!"
    echo "Install it with: npm install -g @railway/cli"
    echo ""
    echo "Alternative: Deploy via GitHub (recommended)"
    echo "1. Push this code to GitHub"
    echo "2. Go to https://railway.app"
    echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
    exit 1
fi

echo ""
echo "✓ Railway CLI found"
echo ""

# Login check
echo "Checking Railway login status..."
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
fi

echo ""
echo "✓ Logged in to Railway"
echo ""

# Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << EOF
node_modules/
__pycache__/
*.pyc
.pytest_cache/
.env
.env.local
.DS_Store
*.log
build/
dist/
.venv/
venv/
EOF
    echo "✓ .gitignore created"
fi

# Commit changes
echo ""
echo "📝 Preparing files for deployment..."
git add .
git commit -m "Prepare for Railway deployment" || echo "No changes to commit"

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Choose deployment method:"
echo "1. Deploy now with Railway CLI"
echo "2. Setup GitHub deployment (recommended)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Initializing Railway project..."
    railway init
    
    echo ""
    echo "⚙️  Setting environment variables..."
    echo "Please set the following variables in Railway dashboard:"
    echo ""
    echo "SUPABASE_URL=https://mltnlgeazcinfbcvhcut.supabase.co"
    echo "SUPABASE_SERVICE_KEY=<your-key>"
    echo "STRIPE_API_KEY=sk_test_Ydd9sndM4d0bMBBXxyoxNblV"
    echo "RESEND_API_KEY=re_2tskrrXi_MKmQ4F65r5ijGhGggyo5wtRK"
    echo "CORS_ORIGINS=*"
    echo ""
    echo "Opening Railway dashboard..."
    railway open
    
    echo ""
    read -p "Press Enter after setting environment variables..."
    
    echo ""
    echo "🚀 Deploying to Railway..."
    railway up
    
    echo ""
    echo "✓ Deployment initiated!"
    echo "Check status: railway logs"
    echo "Open app: railway open"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "📋 GitHub Deployment Steps:"
    echo ""
    echo "1. Create a new repository on GitHub"
    echo "2. Run these commands:"
    echo ""
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    echo ""
    echo "3. Go to https://railway.app"
    echo "4. Click 'New Project' → 'Deploy from GitHub repo'"
    echo "5. Select your repository"
    echo "6. Add environment variables in Railway dashboard"
    echo ""
    echo "See RAILWAY_DEPLOYMENT.md for detailed instructions"
else
    echo "Invalid choice. Exiting."
    exit 1
fi
