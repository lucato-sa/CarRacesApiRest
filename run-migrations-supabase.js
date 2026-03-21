#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE MIGRACIÓN PARA SUPABASE
 * 
 * Ejecuta archivos SQL de migración contra Supabase
 * Uso: node run-migrations-supabase.js [archivo-migracion]
 * 
 * Ejemplo:
 *   node run-migrations-supabase.js src/database/migrations/002-add-missing-entities.sql
 *   node run-migrations-supabase.js all  (ejecuta todas las migraciones)
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.test.supabase' });

// ============================================
// 📋 CONFIGURACIÓN
// ============================================

const DATABASE_URL = process.env.DATABASE_URL || 
  `postgresql://postgres:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/postgres`;

const SUPABASE_CONFIG = {
  host: process.env.DB_HOST || 'zpjtezlpqipgozgdgyla.supabase.co',
  port: 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
};

const MIGRATIONS_DIR = path.join(__dirname, 'src', 'database', 'migrations');

// ============================================
// 🛠️ FUNCIONES UTILITARIAS
// ============================================

async function runMigration(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo de migración no encontrado: ${filePath}`);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);

  console.log(`\n📝 Leyendo migración: ${fileName}`);
  console.log(`📏 Tamaño: ${Math.round(migrationSQL.length / 1024)} KB`);

  // Crear pool de conexión
  const pool = new Pool(SUPABASE_CONFIG);

  try {
    // Conectar a Supabase
    console.log(`\n🔗 Conectando a Supabase...`);
    console.log(`   Host: ${SUPABASE_CONFIG.host}`);
    console.log(`   Usuario: ${SUPABASE_CONFIG.user}`);
    console.log(`   Base de datos: ${SUPABASE_CONFIG.database}`);

    const client = await pool.connect();
    console.log('✅ Conexión exitosa a Supabase\n');

    // Dividir el SQL en statements individuales
    // Limpiar comentarios de línea pero preservar statements
    const lines = migrationSQL.split('\n');
    const cleanedLines = lines
      .map(line => {
        // Remover comentarios de línea pero no comentarios en medio de SQL
        if (line.trim().startsWith('--')) return '';
        return line;
      })
      .join('\n');
    
    // Dividir por punto y coma
    const statements = cleanedLines
      .split(';')
      .map(stmt => stmt
        .trim()
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' '))
      .filter(stmt => stmt.length > 0);

    console.log(`📊 Total de statements SQL: ${statements.length}\n`);

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];

    // Ejecutar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      const stepNum = i + 1;

      try {
        console.log(`[${stepNum}/${statements.length}] Ejecutando...`);
        
        // Mostrar preview del SQL (primeras 80 caracteres)
        const preview = statement.substring(0, 80).replace(/\n/g, ' ');
        console.log(`   SQL: ${preview}${statement.length > 80 ? '...' : ''}`);

        await client.query(statement);

        console.log(`   ✅ OK\n`);
        successCount++;

      } catch (error) {
        // Si es una tabla que ya existe, no es error crítico
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate')) {
          console.log(`   ⚠️  YA EXISTE (ignorado)\n`);
          skippedCount++;
        } else {
          console.log(`   ❌ ERROR: ${error.message}\n`);
          errorCount++;
          errors.push({
            statement: statement.substring(0, 100),
            error: error.message
          });
        }
      }
    }

    client.release();

    // ============================================
    // 📊 RESUMEN
    // ============================================

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`⚠️  Ignorados: ${skippedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log('='.repeat(60));

    if (errors.length > 0) {
      console.log('\n❌ ERRORES ENCONTRADOS:\n');
      errors.forEach((err, idx) => {
        console.log(`${idx + 1}. SQL: ${err.statement}...`);
        console.log(`   Error: ${err.error}\n`);
      });
    }

    if (errorCount === 0) {
      console.log('\n✅ Migración completada exitosamente');
      process.exit(0);
    } else {
      console.log('\n❌ Migración completada con errores');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function runAllMigrations() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`\n📂 Encontradas ${files.length} migraciones\n`);

  for (const file of files) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📌 Ejecutando: ${file}`);
    console.log('='.repeat(60));

    const migrationSQL = fs.readFileSync(filePath, 'utf8');
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    const pool = new Pool(SUPABASE_CONFIG);
    try {
      const client = await pool.connect();

      for (const statement of statements) {
        try {
          await client.query(statement + ';');
        } catch (error) {
          if (!error.message.includes('already exists') && 
              !error.message.includes('duplicate')) {
            throw error;
          }
        }
      }

      client.release();
      console.log(`✅ ${file} completado`);
    } catch (error) {
      console.error(`❌ Error en ${file}:`, error.message);
    } finally {
      await pool.end();
    }
  }

  console.log('\n✅ Todas las migraciones ejecutadas');
}

// ============================================
// 🚀 MAIN
// ============================================

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('\n📖 USO:');
  console.log('  node run-migrations-supabase.js [archivo-migracion | all]');
  console.log('\n📋 EJEMPLOS:');
  console.log('  node run-migrations-supabase.js src/database/migrations/002-add-missing-entities.sql');
  console.log('  node run-migrations-supabase.js all');
  console.log('\n');
  process.exit(0);
}

const target = args[0];

if (target === 'all') {
  runAllMigrations();
} else {
  const filePath = path.isAbsolute(target) ? target : path.join(process.cwd(), target);
  runMigration(filePath);
}
