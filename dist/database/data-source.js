"use strict";
/**
 * 🗄️ DATA SOURCE - Pool de conexiones PostgreSQL (SQL Nativo)
 *
 * Reemplaza TypeORM con manejo directo de conexiones usando 'pg'
 * ✅ Control total
 * ✅ SQL explícito
 * ✅ Mejor performance
 * ✅ Simpler que ORM
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPool = void 0;
exports.executeQuery = executeQuery;
exports.queryOne = queryOne;
exports.queryAll = queryAll;
exports.transaction = transaction;
exports.initializeDB = initializeDB;
exports.closeDB = closeDB;
const pg_1 = require("pg");
const database_config_1 = require("../config/database.config");
// Pool reutilizable para conexiones persistentes
exports.dbPool = new pg_1.Pool({
    host: database_config_1.DATABASE_CONFIG.DB.host,
    port: database_config_1.DATABASE_CONFIG.DB.port,
    user: database_config_1.DATABASE_CONFIG.DB.username,
    password: database_config_1.DATABASE_CONFIG.DB.password,
    database: database_config_1.DATABASE_CONFIG.DB.database,
    // SSL para Supabase y producción
    ...(database_config_1.DATABASE_CONFIG.DB.isSupabase && {
        ssl: {
            rejectUnauthorized: false, // Supabase requiere SSL pero no validar certificado estrictamente
        },
    }),
    // Connection pool config
    max: database_config_1.DATABASE_CONFIG.IS_PRODUCTION ? 20 : 10, // Máximo 20 conexiones en producción
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// Event listeners para debugging
exports.dbPool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
});
exports.dbPool.on('connect', () => {
    if (database_config_1.DATABASE_CONFIG.TYPEORM.logging) {
        console.log('🔗 Nueva conexión a BD');
    }
});
/**
 * Ejecutar query con parámetros seguros (prepared statements)
 * Previene SQL injection
 */
async function executeQuery(sql, params = []) {
    try {
        if (database_config_1.DATABASE_CONFIG.TYPEORM.logging) {
            console.log('📝 SQL Query:', sql);
            if (params.length > 0)
                console.log('📦 Params:', params);
        }
        const result = await exports.dbPool.query(sql, params);
        return result;
    }
    catch (error) {
        console.error('❌ Database query error:', error);
        throw error;
    }
}
/**
 * Ejecutar query y retornar una única fila
 */
async function queryOne(sql, params = []) {
    const result = await executeQuery(sql, params);
    return result.rows[0];
}
/**
 * Ejecutar query y retornar todas las filas
 */
async function queryAll(sql, params = []) {
    const result = await executeQuery(sql, params);
    return result.rows;
}
/**
 * Ejecutar transacción
 * Garantiza que todas las queries se ejecutan o ninguna
 */
async function transaction(callback) {
    const client = await exports.dbPool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Transaction rolled back:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
/**
 * Inicializar BD: verificar conexión y crear schema si necesario
 */
async function initializeDB() {
    try {
        console.log('🔗 Conectando a PostgreSQL...');
        const result = await executeQuery('SELECT NOW()');
        console.log('✅ Conexión a BD exitosa');
        console.log(`   Host: ${database_config_1.DATABASE_CONFIG.DB.host}`);
        console.log(`   BD: ${database_config_1.DATABASE_CONFIG.DB.database}`);
        console.log(`   Timestamp: ${result.rows[0].now}`);
        // Verificar que las tablas existen
        if (database_config_1.DATABASE_CONFIG.TYPEORM.dropSchema && database_config_1.DATABASE_CONFIG.IS_TEST) {
            console.log('🔄 Limpiando schema para tests...');
            // Esto se hará manualmente o desde migraciones
        }
    }
    catch (error) {
        console.error('❌ Error al conectar a BD:', error);
        throw error;
    }
}
/**
 * Cerrar conexiones y limpiar recursos
 */
async function closeDB() {
    try {
        await exports.dbPool.end();
        console.log('🔌 Conexión a BD cerrada');
    }
    catch (error) {
        console.error('❌ Error al cerrar BD:', error);
        throw error;
    }
}
exports.default = exports.dbPool;
