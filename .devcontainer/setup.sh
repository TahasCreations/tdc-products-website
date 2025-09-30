#!/bin/bash

# TDC Market Dev Container Setup Script
echo "🚀 Setting up TDC Market development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Installing dependencies with pnpm..."
if pnpm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Building the project..."
if pnpm build; then
    print_success "Project built successfully"
else
    print_warning "Build failed, but continuing..."
fi

print_status "Setting up database..."
if command -v psql &> /dev/null; then
    print_status "PostgreSQL client found, setting up database..."
    # Database setup will be handled by docker-compose
else
    print_warning "PostgreSQL client not found, database setup will be handled by docker-compose"
fi

print_status "Setting up Redis..."
if command -v redis-cli &> /dev/null; then
    print_status "Redis client found"
else
    print_warning "Redis client not found, Redis setup will be handled by docker-compose"
fi

print_status "Setting up MeiliSearch..."
if command -v meilisearch &> /dev/null; then
    print_success "MeiliSearch CLI is available"
else
    print_warning "MeiliSearch CLI not found"
fi

print_status "Setting up AWS CLI..."
if command -v aws &> /dev/null; then
    print_success "AWS CLI is available"
    print_status "Run 'aws configure' to set up your credentials"
else
    print_warning "AWS CLI not found"
fi

print_status "Setting up Prisma..."
if command -v prisma &> /dev/null; then
    print_success "Prisma CLI is available"
    print_status "Run 'pnpm db:migrate' to set up the database schema"
else
    print_warning "Prisma CLI not found"
fi

print_success "🎉 TDC Market development environment is ready!"
print_status "Available commands:"
echo "  pnpm dev                    - Start all development servers"
echo "  pnpm dev --filter=@tdc/api-gateway - Start API Gateway only"
echo "  pnpm test                   - Run tests"
echo "  pnpm lint                   - Run linting"
echo "  pnpm build                  - Build the project"
echo "  pnpm db:migrate             - Run database migrations"
echo "  pnpm db:studio              - Open Prisma Studio"
echo "  pnpm format                 - Format code"
echo "  pnpm type-check             - Run TypeScript type checking"

print_status "🌐 Available services:"
echo "  Web Storefront: http://localhost:3000"
echo "  Web Admin:      http://localhost:3001"
echo "  API Gateway:    http://localhost:3002"
echo "  PostgreSQL:     localhost:5432"
echo "  Redis:          localhost:6379"

print_success "Happy coding! 🚀"

