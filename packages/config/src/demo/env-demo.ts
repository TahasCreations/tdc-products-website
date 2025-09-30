#!/usr/bin/env node

/**
 * Environment Validation Demo
 * 
 * This script demonstrates how to use the environment validation
 * Run with: pnpm demo:env
 */

import { validateEnv, safeValidateEnv, env } from '../environment/index.js';

console.log('🔧 Environment Validation Demo\n');

// Demo 1: Safe validation (doesn't exit on error)
console.log('1️⃣ Safe Environment Validation:');
const safeResult = safeValidateEnv();

if (safeResult.success) {
  console.log('✅ Environment validation passed!');
  console.log('📊 Environment Summary:');
  console.log(JSON.stringify(env.getEnvSummary(), null, 2));
} else {
  console.log('❌ Environment validation failed:');
  safeResult.errors?.forEach(error => console.log(`   - ${error}`));
  console.log('\n💡 Please check your .env file and ensure all required variables are set.');
  console.log('📋 See env.example for reference.');
}

console.log('\n' + '='.repeat(50) + '\n');

// Demo 2: Environment helper functions
console.log('2️⃣ Environment Helper Functions:');

try {
  const envVars = env.getEnv();
  
  console.log('🏗️  Application Config:');
  console.log(`   - Environment: ${env.getAppConfig().nodeEnv}`);
  console.log(`   - Port: ${env.getAppConfig().port}`);
  console.log(`   - Log Level: ${env.getAppConfig().logLevel}`);
  
  console.log('\n🔐 Authentication Config:');
  const authConfig = env.getAuthConfig();
  console.log(`   - NextAuth Secret: ${authConfig.nextAuthSecret ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - JWT Secret: ${authConfig.jwtSecret ? '✅ Set' : '❌ Using NextAuth Secret'}`);
  
  console.log('\n💳 Payment Config:');
  const paymentConfig = env.getPaymentConfig();
  console.log(`   - Merchant ID: ${paymentConfig.merchantId ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - API Key: ${paymentConfig.key ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - Secret: ${paymentConfig.secret ? '✅ Set' : '❌ Missing'}`);
  
  console.log('\n📦 Storage Config:');
  const s3Config = env.getS3Config();
  console.log(`   - Endpoint: ${s3Config.endpoint}`);
  console.log(`   - Bucket: ${s3Config.bucket}`);
  console.log(`   - Access Key: ${s3Config.accessKeyId ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - Secret Key: ${s3Config.secretAccessKey ? '✅ Set' : '❌ Missing'}`);
  
  console.log('\n🚀 Feature Flags:');
  const features = env.getFeatureFlags();
  console.log(`   - Analytics: ${features.analytics ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   - PWA: ${features.pwa ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   - AI: ${features.ai ? '✅ Enabled' : '❌ Disabled'}`);
  
  console.log('\n🌐 Site Config:');
  const siteConfig = env.getSiteConfig();
  console.log(`   - URL: ${siteConfig.url}`);
  console.log(`   - Allowed Origins: ${siteConfig.allowedOrigins.join(', ')}`);
  
} catch (error) {
  console.log('❌ Error accessing environment variables:');
  console.log(`   ${error instanceof Error ? error.message : 'Unknown error'}`);
}

console.log('\n' + '='.repeat(50) + '\n');

// Demo 3: Environment validation with strict mode
console.log('3️⃣ Strict Environment Validation:');

if (process.env.NODE_ENV === 'production') {
  console.log('🔒 Production environment detected. Running strict validation...');
  try {
    validateEnv(); // This will exit if validation fails
    console.log('✅ All environment variables are valid for production!');
  } catch (error) {
    console.log('❌ Production environment validation failed!');
    process.exit(1);
  }
} else {
  console.log('⚠️  Development environment detected. Using safe validation.');
  const result = safeValidateEnv();
  if (result.success) {
    console.log('✅ Environment is ready for development!');
  } else {
    console.log('⚠️  Some environment variables are missing, but continuing in development mode.');
  }
}

console.log('\n🎉 Environment validation demo completed!');

