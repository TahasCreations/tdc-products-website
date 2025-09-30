#!/bin/bash

echo "🚀 Creating Clean Web App for Vercel..."

# Create clean web app directory
mkdir -p tdc-market-clean
cd tdc-market-clean

# Copy only web app files
echo "📁 Copying web app files..."
cp -r ../apps/web/* .

# Remove workspace dependencies
echo "🔧 Cleaning package.json..."
# Remove workspace dependencies from package.json
sed -i 's/"@tdc\/[^"]*": "workspace:\*",//g' package.json
sed -i 's/"@tdc\/[^"]*": "workspace:\*"//g' package.json

# Clean up any empty lines or trailing commas
sed -i '/^[[:space:]]*$/d' package.json
sed -i 's/,$//' package.json

# Add engines
echo "📝 Adding engines to package.json..."
# Add engines after version
sed -i '/"version": "1.0.0",/a\  "engines": {\n    "node": ">=18.0.0",\n    "npm": ">=8.0.0"\n  },' package.json

# Create .gitignore
echo "📝 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
.next/
out/
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out
storybook-static

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
Thumbs.db
ehthumbs.db

# Turbo
.turbo

# Vercel
.vercel

# Docker
.dockerignore

# Database
*.db
*.sqlite
*.sqlite3

# Prisma
prisma/migrations/

# Test files
test-*.js
*.test.js
*.spec.js

# Backup files
*backup*
EOF

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Clean web app created successfully!"
    echo "📝 Next steps:"
    echo "1. cd tdc-market-clean"
    echo "2. git init"
    echo "3. git add ."
    echo "4. git commit -m 'Initial commit: TDC Market Clean'"
    echo "5. Create GitHub repository: tdc-market-clean"
    echo "6. git remote add origin <your-repo-url>"
    echo "7. git push -u origin main"
    echo "8. Deploy to Vercel! 🚀"
else
    echo "❌ Build failed. Check errors above."
fi
