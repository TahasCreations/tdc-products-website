#!/bin/bash

# Vercel Deploy Script
echo "🚀 Starting Vercel deployment..."

# Clean build files only (keep node_modules and .git)
echo "🧹 Cleaning build files..."
rm -rf .next
rm -rf .vercel
rm -rf .turbo
rm -rf dist
rm -rf out

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --force

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo "❌ Build failed!"
    exit 1
fi
