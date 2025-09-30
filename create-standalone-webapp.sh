#!/bin/bash

echo "🚀 Creating Standalone Web App for Vercel..."

# Create standalone web app directory
mkdir -p tdc-market-standalone
cd tdc-market-standalone

# Copy web app files
echo "📁 Copying web app files..."
cp -r ../apps/web/* .

# Copy root files that might be needed
echo "📁 Copying root files..."
cp ../.gitignore .
cp ../README.md .

# Update package.json to standalone version
echo "📝 Updating package.json..."
cp package-standalone.json package.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Standalone web app created successfully!"
    echo "📝 Next steps:"
    echo "1. cd tdc-market-standalone"
    echo "2. git init"
    echo "3. git add ."
    echo "4. git commit -m 'Initial commit: TDC Market Standalone'"
    echo "5. Create GitHub repository"
    echo "6. git remote add origin <your-repo-url>"
    echo "7. git push -u origin main"
    echo "8. Deploy to Vercel! 🚀"
else
    echo "❌ Build failed. Check errors above."
fi
