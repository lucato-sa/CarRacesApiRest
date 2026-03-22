require('dotenv').config({ path: '.env.test.supabase' });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function listTables() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📊 Tablas en la base de datos:\n');
    result.rows.forEach((row, idx) => {
      const match = row.table_name.includes('driving') || row.table_name.includes('environment');
      const marker = match ? '⭐' : '  ';
      console.log(`${marker} ${idx + 1}. ${row.table_name}`);
    });

    console.log(`\n✅ Total: ${result.rows.length} tablas`);
    
    // Buscar tabla relacionada con driving environments
    const drivingTables = result.rows.filter(r => r.table_name.includes('driving') || r.table_name.includes('environment'));
    if (drivingTables.length === 0) {
      console.log('\n⚠️ No se encontró ninguna tabla relacionada con "driving" o "environment"');
    } else {
      console.log('\n🔍 Tablas encontradas relacionadas:');
      drivingTables.forEach(t => console.log(`   - ${t.table_name}`));
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

listTables();
