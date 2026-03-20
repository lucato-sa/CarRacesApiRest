"use strict";
/**
 * 🐘 POSTGRES BACKEND - SQL Native con pg driver
 * Ideal para tests de integración realistas
 * Perfecto para: Tests de integración, staging, producción
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresBackend = void 0;
const data_source_1 = require("../database/data-source");
class PostgresBackend {
    constructor() {
        this.ready = false;
    }
    async initialize() {
        console.log('🐘 Initializing PostgreSQL Backend...');
        try {
            await (0, data_source_1.initializeDB)();
            this.ready = true;
            console.log('✅ PostgreSQL Backend initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize PostgreSQL Backend:', error);
            throw error;
        }
    }
    async clear() {
        console.log('🧹 Clearing PostgreSQL Backend...');
        if (!this.ready)
            throw new Error('Backend not initialized');
        try {
            // Truncate all tables (disable constraints temporarily)
            const tables = [
                'users',
                'clubs',
                'races',
                'competitions',
                'championships',
                'events',
                'registrations',
                'disciplines',
                'formats',
                'surfaces',
                'divisions',
                'roles',
                'role_entities',
                'user_entities',
                'race_results',
                'entity_links',
                'specialities',
                'driving_environments',
            ];
            // Disable foreign key constraints
            await (0, data_source_1.executeQuery)('SET session_replication_role = REPLICA', []);
            for (const table of tables) {
                try {
                    await (0, data_source_1.executeQuery)(`TRUNCATE TABLE ${table} CASCADE`, []);
                }
                catch (e) {
                    // Table might not exist, skip silently
                }
            }
            // Re-enable foreign key constraints
            await (0, data_source_1.executeQuery)('SET session_replication_role = DEFAULT', []);
            console.log('✅ PostgreSQL Backend cleared');
        }
        catch (error) {
            console.error('❌ Failed to clear PostgreSQL Backend:', error);
            throw error;
        }
    }
    async close() {
        console.log('🔌 Closing PostgreSQL Backend...');
        try {
            await (0, data_source_1.closeDB)();
            this.ready = false;
            console.log('✅ PostgreSQL Backend closed');
        }
        catch (error) {
            console.error('❌ Failed to close PostgreSQL Backend:', error);
            throw error;
        }
    }
    async create(entity, data) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        try {
            const columns = Object.keys(data);
            const values = Object.values(data);
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
            const result = await (0, data_source_1.executeQuery)(`INSERT INTO ${entity} (${columns.join(', ')}) 
         VALUES (${placeholders}) 
         RETURNING *`, values);
            return result.rows[0];
        }
        catch (error) {
            console.error(`Error creating ${entity}:`, error);
            throw error;
        }
    }
    async read(entity, id) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        try {
            const idField = this.getIdField(entity);
            const result = await (0, data_source_1.queryOne)(`SELECT * FROM ${entity} WHERE ${idField} = $1`, [id]);
            return result;
        }
        catch (error) {
            console.error(`Error reading ${entity}:`, error);
            throw error;
        }
    }
    async readAll(entity, filters) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        try {
            let query = `SELECT * FROM ${entity}`;
            const params = [];
            if (filters && Object.keys(filters).length > 0) {
                const conditions = Object.entries(filters).map(([key, value], i) => {
                    params.push(value);
                    return `${key} = $${i + 1}`;
                });
                query += ` WHERE ${conditions.join(' AND ')}`;
            }
            return await (0, data_source_1.queryAll)(query, params);
        }
        catch (error) {
            console.error(`Error reading all ${entity}:`, error);
            throw error;
        }
    }
    async update(entity, id, data) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        try {
            const idField = this.getIdField(entity);
            const setClause = Object.keys(data)
                .map((key, i) => `${key} = $${i + 1}`)
                .join(', ');
            const params = [...Object.values(data), id];
            const result = await (0, data_source_1.queryOne)(`UPDATE ${entity} SET ${setClause} WHERE ${idField} = $${Object.keys(data).length + 1} RETURNING *`, params);
            return result;
        }
        catch (error) {
            console.error(`Error updating ${entity}:`, error);
            throw error;
        }
    }
    async delete(entity, id) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        try {
            const idField = this.getIdField(entity);
            await (0, data_source_1.executeQuery)(`DELETE FROM ${entity} WHERE ${idField} = $1`, [id]);
        }
        catch (error) {
            console.error(`Error deleting ${entity}:`, error);
            throw error;
        }
    }
    async count(entity) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        try {
            const result = await (0, data_source_1.queryOne)(`SELECT COUNT(*) as count FROM ${entity}`, []);
            return parseInt(result?.count || 0, 10);
        }
        catch (error) {
            console.error(`Error counting ${entity}:`, error);
            throw error;
        }
    }
    isReady() {
        return this.ready;
    }
    /**
     * Helper: Get ID field for each entity
     */
    getIdField(entity) {
        // Convert entity name to id field: "users" -> "user_id", "clubs" -> "club_id"
        const singular = entity.endsWith('s') ? entity.slice(0, -1) : entity;
        return `${singular}_id`;
    }
    /**
     * Debug: Check connection status
     */
    isConnected() {
        return this.ready && data_source_1.dbPool.totalCount > 0;
    }
    /**
     * Execute raw query (for special operations)
     */
    async query(query, params) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        return (0, data_source_1.executeQuery)(query, params || []);
    }
}
exports.PostgresBackend = PostgresBackend;
