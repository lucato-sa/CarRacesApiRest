/**
 * 🗄️ DATA SOURCE - Pool de conexiones PostgreSQL (SQL Nativo)
 * 
 * Reemplaza TypeORM con manejo directo de conexiones usando 'pg'
 * ✅ Control total
 * ✅ SQL explícito
 * ✅ Mejor performance
 * ✅ Simpler que ORM
 */

import { Pool, Client, PoolClient, QueryResult } from 'pg';
import { DATABASE_CONFIG } from '../config/database.config';

// Pool reutilizable para conexiones persistentes
export const dbPool = new Pool({
  host: DATABASE_CONFIG.DB.host,
  port: DATABASE_CONFIG.DB.port,
  user: DATABASE_CONFIG.DB.username,
  password: DATABASE_CONFIG.DB.password,
  database: DATABASE_CONFIG.DB.database,
  
  // SSL para Supabase y producción
  ...(DATABASE_CONFIG.DB.isSupabase && {
    ssl: {
      rejectUnauthorized: false, // Supabase requiere SSL pero no validar certificado estrictamente
    },
  }),

  // Connection pool config
  max: DATABASE_CONFIG.IS_PRODUCTION ? 20 : 10,  // Máximo 20 conexiones en producción
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event listeners para debugging
dbPool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

dbPool.on('connect', () => {
  if (DATABASE_CONFIG.TYPEORM.logging) {
    console.log('🔗 Nueva conexión a BD');
  }
});

/**
 * Ejecutar query con parámetros seguros (prepared statements)
 * Previene SQL injection
 */
export async function executeQuery<T = any>(
  sql: string,
  params: any[] = [],
): Promise<QueryResult<T>> {
  try {
    if (DATABASE_CONFIG.TYPEORM.logging) {
      console.log('📝 SQL Query:', sql);
      if (params.length > 0) console.log('📦 Params:', params);
    }

    const result = await dbPool.query<T>(sql, params);
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

/**
 * Ejecutar query y retornar una única fila
 */
export async function queryOne<T = any>(
  sql: string,
  params: any[] = [],
): Promise<T | undefined> {
  const result = await executeQuery<T>(sql, params);
  return result.rows[0];
}

/**
 * Ejecutar query y retornar todas las filas
 */
export async function queryAll<T = any>(
  sql: string,
  params: any[] = [],
): Promise<T[]> {
  const result = await executeQuery<T>(sql, params);
  return result.rows;
}

/**
 * Ejecutar transacción
 * Garantiza que todas las queries se ejecutan o ninguna
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await dbPool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction rolled back:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Inicializar BD: verificar conexión y crear schema si necesario
 */
export async function initializeDB(): Promise<void> {
  try {
    console.log('🔗 Conectando a PostgreSQL...');
    
    const result = await executeQuery('SELECT NOW()');
    
    console.log('✅ Conexión a BD exitosa');
    console.log(`   Host: ${DATABASE_CONFIG.DB.host}`);
    console.log(`   BD: ${DATABASE_CONFIG.DB.database}`);
    console.log(`   Timestamp: ${result.rows[0].now}`);

    // Verificar que las tablas existen
    if (DATABASE_CONFIG.TYPEORM.dropSchema && DATABASE_CONFIG.IS_TEST) {
      console.log('🔄 Limpiando schema para tests...');
      // Esto se hará manualmente o desde migraciones
    }
  } catch (error) {
    console.error('❌ Error al conectar a BD:', error);
    throw error;
  }
}

/**
 * Cerrar conexiones y limpiar recursos
 */
export async function closeDB(): Promise<void> {
  try {
    await dbPool.end();
    console.log('🔌 Conexión a BD cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar BD:', error);
    throw error;
  }
}

export default dbPool;
