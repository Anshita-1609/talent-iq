#!/bin/bash

echo "🚀 Talent-IQ Deployment Script"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote 'origin' not found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/talent-iq.git"
    exit 1
fi

echo "✅ Git repository configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Check if build was successful
if [ ! -d "frontend/dist" ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Build completed"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: $(date)" || echo "No changes to commit"
git push origin main

echo ""
echo "🎉 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com and deploy the frontend"
echo "2. Go to https://render.com and deploy the backend"
echo "3. Update the URLs in both services"
echo ""
echo "See DEPLOYMENT.md for detailed instructions"