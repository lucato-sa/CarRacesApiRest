#!/usr/bin/env node

/**
 * Script interactivo para configurar Supabase
 * Uso: node setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

async function setupSupabase() {
  console.clear();
  console.log('\n' + '='.repeat(60));
  console.log('⚙️  CONFIGURADOR DE SUPABASE');
  console.log('='.repeat(60) + '\n');
  
  // Paso 1: Introducción
  console.log('Este asistente te ayudará a configurar tu conexión a Supabase.\n');
  console.log('Necesitarás:');
  console.log('  • Account en https://supabase.com');
  console.log('  • Un proyecto creado');
  console.log('  • Credenciales de base de datos\n');
  
  const ready = await question('¿Estás listo? (s/n): ');
  if (ready.toLowerCase() !== 's') {
    console.log('\n👋 Configuración cancelada.\n');
    rl.close();
    return;
  }
  
  // Paso 2: Obtener datos
  console.log('\n📋 INFORMACIÓN DE SUPABASE\n');
  console.log('Obtén estos valores de:');
  console.log('  https://supabase.com/dashboard');
  console.log('  → Settings → Database → Connection string\n');
  
  const dbHost = await question('1. DB_HOST (ej: db.abc123xyz.supabase.co): ');
  const dbPort = await question('2. DB_PORT (default: 5432): ') || '5432';
  const dbUser = await question('3. DB_USER (default: postgres): ') || 'postgres';
  const dbPassword = await question('4. DB_PASSWORD (contraseña de postgres): ');
  const dbName = await question('5. DB_NAME (default: postgres): ') || 'postgres';
  
  // Validar
  console.log('\n🔍 Validando...\n');
  
  const errors = [];
  if (!dbHost || dbHost.includes('XXXX')) errors.push('• DB_HOST es inválido');
  if (!dbPassword) errors.push('• DB_PASSWORD no puede estar vacío');
  if (!dbHost.includes('supabase.co') && dbHost !== 'localhost') {
    errors.push('• DB_HOST debe terminar en "supabase.co" o ser "localhost"');
  }
  
  if (errors.length > 0) {
    console.log('❌ Errores encontrados:\n');
    errors.forEach(e => console.log(`   ${e}`));
    console.log('\n👋 Por favor, intenta de nuevo.\n');
    rl.close();
    return;
  }
  
  // Paso 3: Crear .env
  console.log('✅ Datos válidos!\n');
  console.log('📝 Creando archivo .env...\n');
  
  let envContent = fs.readFileSync(envExamplePath, 'utf8');
  envContent = envContent
    .replace('DB_HOST=db.XXXXXXXXXXXX.supabase.co', `DB_HOST=${dbHost}`)
    .replace('DB_PORT=5432', `DB_PORT=${dbPort}`)
    .replace('DB_USER=postgres', `DB_USER=${dbUser}`)
    .replace('DB_PASSWORD=tu_contraseña_postgres_supabase', `DB_PASSWORD=${dbPassword}`)
    .replace('DB_NAME=postgres', `DB_NAME=${dbName}`);
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Archivo .env creado correctamente!\n');
  console.log('📊 Configuración guardada:\n');
  console.log(`   ✓ Host: ${dbHost}`);
  console.log(`   ✓ Puerto: ${dbPort}`);
  console.log(`   ✓ Usuario: ${dbUser}`);
  console.log(`   ✓ Base de datos: ${dbName}`);
  console.log('   ✓ Contraseña: ****\n');
  
  // Paso 4: Verificar conexión
  const testConn = await question('¿Quieres verificar la conexión ahora? (s/n): ');
  if (testConn.toLowerCase() === 's') {
    console.log('\n⏳ Probando conexión...\n');
    
    try {
      require('dotenv').config({ path: envPath });
      // Nota: el test real requeriría compilar TypeScript
      console.log('✅ Archivo .env válido\n');
      console.log('📝 Para completar el test de conexión, ejecuta:');
      console.log('   npm run dev\n');
    } catch (error) {
      console.log('⚠️  No se pudo verificar la conexión\n');
    }
  }
  
  // Paso 5: Instrucciones finales
  console.log('='.repeat(60));
  console.log('\n🚀 PRÓXIMOS PASOS:\n');
  console.log('   1. Verificar credenciales en .env');
  console.log('   2. Ejecutar: npm run dev');
  console.log('   3. Ver logs de conexión');
  console.log('   4. Probar endpoints:');
  console.log('      curl http://localhost:3000/api/clubs');
  console.log('\n 📖 Documentación: SUPABASE_SETUP.md\n');
  console.log('='.repeat(60) + '\n');
  
  rl.close();
}

setupSupabase().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
