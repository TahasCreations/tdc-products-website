#!/bin/bash

echo "🚀 Deploying Web App Only to Vercel..."

# Create clean web app directory
echo "📁 Creating clean web app directory..."
rm -rf tdc-market-webapp
mkdir tdc-market-webapp
cd tdc-market-webapp

# Copy only web app files
echo "📁 Copying web app files..."
cp -r ../apps/web/* .

# Create clean package.json without workspace dependencies
echo "📝 Creating clean package.json..."
cat > package.json << 'EOF'
{
  "name": "@tdc/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^1.6.0",
    "@heroicons/react": "^2.2.0",
    "@prisma/client": "^5.16.2",
    "bcryptjs": "^2.4.3",
    "next": "^14.2.33",
    "next-auth": "^5.0.0-beta.19",
    "prisma": "^5.16.2",
    "pusher": "^5.2.0",
    "pusher-js": "^8.4.0-rc2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "remixicon": "^4.6.0",
    "zod": "^3.23.8",
    "clsx": "^2.1.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.14.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^9.36.0",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

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

# Create README
echo "📝 Creating README..."
cat > README.md << 'EOF'
# TDC Market - Web App

Türkiye'nin Tasarım & Figür Pazarı - Next.js 14 Web Application

## Features

- Next.js 14 with App Router
- Tailwind CSS with TDC Design System
- TypeScript
- Responsive Design
- SEO Optimized
- Performance Optimized

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Deploy

This app is optimized for Vercel deployment.

## License

Private
EOF

# Remove any workspace-related files
echo "🧹 Cleaning workspace files..."
rm -f package-standalone.json
rm -f .npmrc
rm -f vercel.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Clean web app created successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. cd tdc-market-webapp"
    echo "2. git init"
    echo "3. git add ."
    echo "4. git commit -m 'Initial commit: TDC Market Web App'"
    echo "5. Create GitHub repository: tdc-market-webapp"
    echo "6. git remote add origin https://github.com/KULLANICI_ADI/tdc-market-webapp.git"
    echo "7. git push -u origin main"
    echo "8. Deploy to Vercel! 🚀"
    echo ""
    echo "Vercel Settings:"
    echo "- Root Directory: / (root)"
    echo "- Build Command: npm run build"
    echo "- Output Directory: .next"
    echo "- Install Command: npm install"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
