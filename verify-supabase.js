#!/usr/bin/env node

/**
 * Script de verificación y configuración de Supabase
 * Uso: node verify-supabase.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('\n' + '='.repeat(60));
console.log('🔍 VERIFICADOR DE CONFIGURACIÓN SUPABASE');
console.log('='.repeat(60) + '\n');

// 1. Verificar si .env existe
console.log('1️⃣  Verificando archivo .env...');
if (!fs.existsSync(envPath)) {
  console.log('   ❌ Archivo .env NO encontrado');
  console.log('   📝 Creando .env desde .env.example...\n');
  
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  fs.writeFileSync(envPath, envExample);
  
  console.log('   ✅ Archivo .env creado');
  console.log('   ⚠️  IMPORTANTE: Edita .env y reemplaza los valores:\n');
  console.log('       - DB_HOST: Reemplaza "XXXXXXXXXXXX" con tu ID de proyecto');
  console.log('       - DB_PASSWORD: Usa tu contraseña de postgres de Supabase\n');
  console.log('   Para obtener los valores: https://supabase.com/dashboard');
  console.log('   → Settings → Database → Connection string\n');
} else {
  console.log('   ✅ Archivo .env encontrado');
  
  // Verificar valores
  const env = fs.readFileSync(envPath, 'utf8');
  const lines = env.split('\n');
  
  console.log('\n2️⃣  Verificando valores de configuración...\n');
  
  const checks = {
    'DB_HOST': 'Host de base de datos',
    'DB_PORT': 'Puerto de base de datos',
    'DB_USER': 'Usuario de base de datos',
    'DB_PASSWORD': 'Contraseña de base de datos',
    'DB_NAME': 'Nombre de base de datos'
  };
  
  let allConfigured = true;
  
  Object.entries(checks).forEach(([key, description]) => {
    const line = lines.find(l => l.startsWith(key + '='));
    const value = line ? line.split('=')[1]?.trim() : '';
    
    if (!value || value === 'XXXXXXXXXXXX' || value.includes('tu_contraseña') || value.includes('tu_contrase')) {
      console.log(`   ❌ ${key}: NO CONFIGURADO`);
      console.log(`      (${description})`);
      allConfigured = false;
    } else {
      // Mostrar valor parcial por seguridad
      const display = value.length > 20 
        ? value.substring(0, 10) + '...' + value.substring(value.length - 5)
        : value;
      console.log(`   ✅ ${key}: ${display}`);
    }
  });
  
  console.log('\n');
  
  if (allConfigured) {
    console.log('3️⃣  Verificando conexión a Supabase...\n');
    console.log('   Para verificar la conexión, ejecuta:');
    console.log('   npm run dev\n');
    console.log('   Deberías ver:');
    console.log('   ✅ PostgreSQL/Supabase conectado exitosamente');
    console.log('   🚀 Servidor escuchando en http://localhost:3000\n');
  } else {
    console.log('⚠️  VALORES PENDIENTES DE CONFIGURAR:\n');
    console.log('   1. Abre tu proyecto en https://supabase.com/dashboard');
    console.log('   2. Ve a Settings → Database');
    console.log('   3. Copia tu Connection String');
    console.log('   4. Extrae estos valores:');
    console.log('      - DB_HOST: ejemplo → db.abc123.supabase.co');
    console.log('      - DB_PORT: 5432');
    console.log('      - DB_USER: postgres');
    console.log('      - DB_PASSWORD: tu contraseña de postgres');
    console.log('      - DB_NAME: postgres');
    console.log('\n   5. Edita .env y actualiza los valores');
    console.log('   6. Guarda el archivo');
    console.log('   7. Ejecuta: npm run dev\n');
  }
}

// 4. Instrucciones finales
console.log('=' + '='.repeat(59));
console.log('\n📊 PRÓXIMOS PASOS:\n');
console.log('   1. Editar .env con tus credenciales de Supabase');
console.log('   2. Ejecutar: npm run dev');
console.log('   3. Verificar tablas en Supabase SQL Editor');
console.log('   4. Probar endpoints con curl o Postman\n');
console.log('   Guía completa: SUPABASE_SETUP.md\n');
console.log('=' + '='.repeat(59) + '\n');
