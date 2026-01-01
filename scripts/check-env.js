#!/usr/bin/env node
// Validate environment variables for the SDK

const fs = require('fs');
const path = require('path');

const REQUIRED_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_CHIPI_API_KEY',
  'CHIPI_SECRET_KEY'
];

const OPTIONAL_VARS = [
  'NEXT_PUBLIC_CHIPI_ALPHA_URL',
  'NEXT_PUBLIC_ENCRYPT_SALT',
  'NEXT_PUBLIC_STARKNET_SEPOLIA_ETH',
  'NEXT_PUBLIC_STARKNET_SEPOLIA_USDC',
  'NEXT_PUBLIC_STARKNET_SEPOLIA_STRK',
  'NEXT_PUBLIC_STARKNET_MAINNET_ETH',
  'NEXT_PUBLIC_STARKNET_MAINNET_USDC',
  'NEXT_PUBLIC_STARKNET_MAINNET_STRK'
];

console.log('🔍 Verificando configuración del SDK...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró .env.local');
  console.log('💡 Crea un archivo .env.local con las variables necesarias\n');
  process.exit(1);
}

// Load .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

// Check required variables
let missingVars = [];
let emptyVars = [];

REQUIRED_VARS.forEach(varName => {
  if (!envVars[varName]) {
    missingVars.push(varName);
  } else if (envVars[varName] === '' || envVars[varName] === '...') {
    emptyVars.push(varName);
  } else {
    console.log(`✅ ${varName}`);
  }
});

// Check optional variables
console.log('\n📋 Variables opcionales:');
OPTIONAL_VARS.forEach(varName => {
  if (envVars[varName] && envVars[varName] !== '') {
    console.log(`✅ ${varName}`);
  } else {
    console.log(`⚪ ${varName} (no configurada)`);
  }
});

// Report issues
if (missingVars.length > 0) {
  console.log('\n❌ Variables faltantes:');
  missingVars.forEach(v => console.log(`   - ${v}`));
}

if (emptyVars.length > 0) {
  console.log('\n⚠️  Variables vacías o con placeholders:');
  emptyVars.forEach(v => console.log(`   - ${v}`));
}

if (missingVars.length > 0 || emptyVars.length > 0) {
  console.log('\n💡 Revisa el README.md para obtener las credenciales necesarias\n');
  process.exit(1);
}

console.log('\n✅ Configuración válida - el SDK está listo para ejecutarse\n');
