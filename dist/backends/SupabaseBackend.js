"use strict";
/**
 * ☁️ SUPABASE BACKEND - Usa cliente Supabase (PostgreSQL hosted)
 * Ideal para tests en cloud
 * Perfecto para: Staging en cloud, tests remotos
 *
 * ⚠️ IMPORTANTE: Este backend asume que la BD Supabase tiene las mismas
 * columnas que PostgreSQL local (en snake_case).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseBackend = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const database_config_1 = require("../config/database.config");
class SupabaseBackend {
    constructor(supabaseUrl, supabaseKey) {
        this.supabaseClient = null;
        this.ready = false;
        this.supabaseUrl = supabaseUrl || database_config_1.DATABASE_CONFIG.SUPABASE.url;
        this.supabaseKey = supabaseKey || database_config_1.DATABASE_CONFIG.SUPABASE.key;
    }
    async initialize() {
        console.log('☁️ Initializing Supabase Backend...');
        try {
            // Validar credenciales
            if (!this.supabaseUrl || !this.supabaseKey) {
                throw new Error('Supabase URL and Key are required. Set SUPABASE_URL and SUPABASE_KEY env vars.');
            }
            // Crear cliente Supabase
            this.supabaseClient = (0, supabase_js_1.createClient)(this.supabaseUrl, this.supabaseKey);
            // Probar conexión
            const { error } = await this.supabaseClient.from('users').select('count()', { count: 'exact' }).limit(0);
            if (error) {
                console.warn('⚠️ Supabase connection test warning:', error.message);
            }
            this.ready = true;
            console.log('✅ Supabase Backend initialized');
            console.log(`   URL: ${this.supabaseUrl.substring(0, 30)}...`);
        }
        catch (error) {
            console.error('❌ Failed to initialize Supabase Backend:', error);
            throw error;
        }
    }
    async clear() {
        console.log('🧹 Clearing Supabase Backend...');
        if (!this.ready || !this.supabaseClient)
            throw new Error('Backend not initialized');
        try {
            // Limpiar todas las tablas (requiere que el usuario tenga permisos)
            const entities = [
                'users', 'clubs', 'races', 'competitions', 'championships',
                'events', 'registrations', 'disciplines', 'formats', 'surfaces',
                'divisions', 'roles', 'rolentities', 'userentities', 'raceresults',
                'entitylinks', 'specialities', 'drivingenvironments'
            ];
            for (const entity of entities) {
                try {
                    const idColumn = database_config_1.DATABASE_CONFIG.ID_COLUMNS[entity] || 'id';
                    await this.supabaseClient.from(entity).delete().gte(idColumn, -1);
                }
                catch (e) {
                    // Ignorar error si la tabla no existe o no tiene permisos de delete
                    console.debug(`  Tabla ${entity} no encontrada o no se puede limpiar`);
                }
            }
            console.log('✅ Supabase Backend cleared');
        }
        catch (error) {
            console.error('❌ Failed to clear Supabase Backend:', error);
            throw error;
        }
    }
    async close() {
        console.log('🔌 Closing Supabase Backend...');
        try {
            // Supabase no requiere cierre explícito
            this.supabaseClient = null;
            this.ready = false;
            console.log('✅ Supabase Backend closed');
        }
        catch (error) {
            console.error('❌ Failed to close Supabase Backend:', error);
            throw error;
        }
    }
    async create(entity, data) {
        if (!this.ready || !this.supabaseClient)
            throw new Error('Backend not initialized');
        try {
            // 🔄 Transformar DTO → BD (PascalCase → snake_case)
            const dbData = (0, database_config_1.dtoToDb)(entity, data);
            console.log(`📝 Inserting ${entity}:`, dbData);
            const { data: result, error } = await this.supabaseClient
                .from(entity)
                .insert([dbData])
                .select();
            if (error) {
                console.error(`❌ Supabase error for ${entity}:`, error);
                throw new Error(`${error.message} (table: ${entity})`);
            }
            // 🔄 Transformar BD → DTO (snake_case → PascalCase)
            const transformed = result ? (0, database_config_1.dbToDto)(entity, result[0]) : data;
            return transformed;
        }
        catch (error) {
            console.error(`Error creating ${entity} in Supabase:`, error);
            throw error;
        }
    }
    async read(entity, id) {
        if (!this.ready || !this.supabaseClient)
            throw new Error('Backend not initialized');
        try {
            const idColumn = database_config_1.DATABASE_CONFIG.ID_COLUMNS[entity] || 'id';
            const { data, error } = await this.supabaseClient
                .from(entity)
                .select()
                .eq(idColumn, id)
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return undefined; // Not found
                throw error;
            }
            // 🔄 Transformar BD → DTO
            return data ? (0, database_config_1.dbToDto)(entity, data) : undefined;
        }
        catch (error) {
            console.error(`Error reading ${entity} from Supabase:`, error);
            throw error;
        }
    }
    async readAll(entity, filters) {
        if (!this.ready || !this.supabaseClient)
            throw new Error('Backend not initialized');
        try {
            let query = this.supabaseClient.from(entity).select();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }
            const { data, error } = await query;
            if (error)
                throw error;
            // 🔄 Transformar BD → DTO para cada registro
            return (data || []).map(d => (0, database_config_1.dbToDto)(entity, d));
        }
        catch (error) {
            console.error(`Error reading all ${entity} from Supabase:`, error);
            throw error;
        }
    }
    async update(entity, id, data) {
        if (!this.ready || !this.supabaseClient)
            throw new Error('Backend not initialized');
        try {
            // 🔄 Transformar DTO → BD
            const dbData = (0, database_config_1.dtoToDb)(entity, data);
            const idColumn = database_config_1.DATABASE_CONFIG.ID_COLUMNS[entity] || 'id';
            const { data: result, error } = await this.supabaseClient
                .from(entity)
                .update(dbData)
                .eq(idColumn, id)
                .select()
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return undefined; // Not found
                throw error;
            }
            // 🔄 Transformar BD → DTO
            return result ? (0, database_config_1.dbToDto)(entity, result) : undefined;
        }
        catch (error) {
            console.error(`Error updating ${entity} in Supabase:`, error);
            throw error;
        }
    }
    async delete(entity, id) {
        if (!this.ready || !this.supabaseClient)
            throw new Error('Backend not initialized');
        try {
            const idColumn = database_config_1.DATABASE_CONFIG.ID_COLUMNS[entity] || 'id';
            const { error } = await this.supabaseClient
                .from(entity)
                .delete()
                .eq(idColumn, id);
            if (error)
                throw error;
        }
        catch (error) {
            console.error(`Error deleting ${entity} from Supabase:`, error);
            throw error;
        }
    }
    async count(entity) {
        if (!this.ready || !this.supabaseClient)
            throw new Error('Backend not initialized');
        try {
            const { count, error } = await this.supabaseClient
                .from(entity)
                .select('*', { count: 'exact', head: true });
            if (error)
                throw error;
            return count || 0;
        }
        catch (error) {
            console.error(`Error counting ${entity} in Supabase:`, error);
            throw error;
        }
    }
    isReady() {
        return this.ready;
    }
    /**
     * Debug: Ver estado del backend
     */
    getStats() {
        return { ready: this.ready, client: this.supabaseClient ? 'connected' : 'disconnected' };
    }
}
exports.SupabaseBackend = SupabaseBackend;
