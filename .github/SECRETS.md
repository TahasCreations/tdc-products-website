# GitHub Secrets Configuration

This document lists all the required secrets for the GitHub Actions workflows.

## Required Secrets

### Vercel Deployment
- `VERCEL_TOKEN` - Vercel API token for deployment
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Security Scanning
- `SNYK_TOKEN` - Snyk security scanning token
- `SONAR_TOKEN` - SonarCloud analysis token

### Notifications
- `SLACK_WEBHOOK_URL` - Slack webhook URL for notifications

## How to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with its corresponding value

## Vercel Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing one
3. Go to Project Settings → General
4. Copy the following values:
   - **Project ID**: Found in Project Settings → General
   - **Team ID**: Found in Team Settings → General
   - **Token**: Create in Account Settings → Tokens

## Security Tokens

### Snyk
1. Go to [Snyk.io](https://snyk.io)
2. Sign up/Login
3. Go to Account Settings → API Token
4. Copy the token

### SonarCloud
1. Go to [SonarCloud.io](https://sonarcloud.io)
2. Sign up/Login
3. Go to My Account → Security
4. Generate a new token

## Slack Notifications

1. Go to your Slack workspace
2. Create a new app or use existing one
3. Go to Incoming Webhooks
4. Create a new webhook
5. Copy the webhook URL

## Environment Variables for Production

### Database
- `DATABASE_URL` - PostgreSQL connection string
- `POSTGRES_DB` - Database name
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password

### Redis
- `REDIS_URL` - Redis connection string

### Application
- `NODE_ENV` - Environment (production/development)
- `NEXT_PUBLIC_API_URL` - Public API URL
- `PORT` - Application port

### S3 Storage
- `S3_ENDPOINT` - S3 endpoint URL
- `S3_BUCKET` - S3 bucket name
- `S3_KEY` - S3 access key
- `S3_SECRET` - S3 secret key

### Payment
- `PAYMENT_MERCHANT_ID` - Payment merchant ID
- `PAYMENT_KEY` - Payment API key
- `PAYMENT_SECRET` - Payment secret key

### Authentication
- `NEXTAUTH_SECRET` - NextAuth secret
- `JWT_SECRET` - JWT secret

## Docker Registry

The Docker images are automatically pushed to GitHub Container Registry (GHCR):
- `ghcr.io/tdc-market/api-gateway:latest`
- `ghcr.io/tdc-market/web-storefront:latest`
- `ghcr.io/tdc-market/web-admin:latest`
- `ghcr.io/tdc-market/background-worker:latest`
- `ghcr.io/tdc-market/orders-worker:latest`

## Kubernetes Deployment

For Kubernetes deployment, you can use the following commands:

```bash
# Pull images
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=tdc-market \
  --docker-password=$GITHUB_TOKEN

# Deploy applications
kubectl apply -f k8s/
```

## Monitoring

The workflows include:
- Security scanning with Snyk and Trivy
- Code quality analysis with SonarCloud
- Performance testing with Lighthouse
- Docker image vulnerability scanning
- Slack notifications for success/failure

