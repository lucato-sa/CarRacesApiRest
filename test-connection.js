#!/usr/bin/env node

/**
 * Script para probar conexión a Supabase
 * Uso: node test-connection.js
 */

require('dotenv').config();
const { AppDataSource } = require('./src/database/data-source');

console.log('\n' + '='.repeat(60));
console.log('🧪 TEST DE CONEXIÓN A SUPABASE');
console.log('='.repeat(60) + '\n');

console.log('📡 Configuración detectada:');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Puerto: ${process.env.DB_PORT}`);
console.log(`   BD: ${process.env.DB_NAME}`);
console.log(`   Usuario: ${process.env.DB_USER}\n`);

async function testConnection() {
  try {
    console.log('⏳ Conectando a base de datos...');
    await AppDataSource.initialize();
    console.log('✅ CONEXIÓN EXITOSA!\n');
    
    // Listar tablas
    const query = `
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const result = await AppDataSource.query(query);
    console.log(`📊 Se encontraron ${result.length} tablas:\n`);
    
    result.forEach((row, index) => {
      console.log(`   ${String(index + 1).padStart(2, ' ')}. ${row.table_name}`);
    });
    
    console.log('\n✅ Base de datos lista para usar!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. npm run dev     (iniciar servidor)');
    console.log('   2. curl http://localhost:3000/api/clubs');
    console.log('   3. Crear nuevos registros vía API');
    console.log('   4. Verificar en Supabase dashboard\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR EN LA CONEXIÓN:\n');
    console.error(error.message);
    console.error('\n🔍 Verificaciones:');
    console.error('   ✓ DB_HOST debe terminar en ".supabase.co"');
    console.error('   ✓ DB_PASSWORD debe ser la contraseña de postgres');
    console.error('   ✓ DB_USER debe ser "postgres"');
    console.error('   ✓ DB_NAME debe ser "postgres"');
    console.error('   ✓ Puerto debe ser 5432');
    console.error('\n📖 Para obtener credenciales correctas:');
    console.error('   https://supabase.com/dashboard → Settings → Database\n');
    process.exit(1);
  }
}

testConnection();
