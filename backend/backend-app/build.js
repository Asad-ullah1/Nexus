#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Starting custom build process...');

try {
  // Try nest build first
  console.log('📦 Attempting nest build...');
  execSync('npx nest build', { stdio: 'inherit' });
  console.log('✅ Nest build successful!');
} catch (error) {
  console.log('⚠️ Nest build failed, trying TypeScript build...');
  try {
    // Fallback to tsc
    execSync('npx tsc -p tsconfig.build.json', { stdio: 'inherit' });
    console.log('✅ TypeScript build successful!');
  } catch (tscError) {
    console.error('❌ Both builds failed');
    console.error('Nest error:', error.message);
    console.error('TSC error:', tscError.message);
    process.exit(1);
  }
}

// Verify dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Dist folder not created');
  process.exit(1);
}

console.log('🎉 Build completed successfully!');
