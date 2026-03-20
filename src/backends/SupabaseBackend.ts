/**
 * ☁️ SUPABASE BACKEND - Usa cliente Supabase (PostgreSQL hosted)
 * Ideal para tests en cloud
 * Perfecto para: Staging en cloud, tests remotos
 * 
 * ⚠️ IMPORTANTE: Este backend asume que la BD Supabase tiene las mismas
 * columnas que PostgreSQL local (en snake_case).
 */

import { IBackend } from './IBackend';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { dtoToDb, dbToDto, DATABASE_CONFIG } from '../config/database.config';

export class SupabaseBackend implements IBackend {
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabaseClient: SupabaseClient | null = null;
  private ready: boolean = false;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabaseUrl = supabaseUrl || DATABASE_CONFIG.SUPABASE.url;
    this.supabaseKey = supabaseKey || DATABASE_CONFIG.SUPABASE.key;
  }

  async initialize(): Promise<void> {
    console.log('☁️ Initializing Supabase Backend...');

    try {
      // Validar credenciales
      if (!this.supabaseUrl || !this.supabaseKey) {
        throw new Error('Supabase URL and Key are required. Set SUPABASE_URL and SUPABASE_KEY env vars.');
      }

      // Crear cliente Supabase
      this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
      
      // Probar conexión
      const { error } = await this.supabaseClient.from('users').select('count()', { count: 'exact' }).limit(0);
      
      if (error) {
        console.warn('⚠️ Supabase connection test warning:', error.message);
      }

      this.ready = true;
      console.log('✅ Supabase Backend initialized');
      console.log(`   URL: ${this.supabaseUrl.substring(0, 30)}...`);
    } catch (error) {
      console.error('❌ Failed to initialize Supabase Backend:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    console.log('🧹 Clearing Supabase Backend...');

    if (!this.ready || !this.supabaseClient) throw new Error('Backend not initialized');

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
          const idColumn = DATABASE_CONFIG.ID_COLUMNS[entity as keyof typeof DATABASE_CONFIG.ID_COLUMNS] || 'id';
          await this.supabaseClient.from(entity).delete().gte(idColumn, -1);
        } catch (e) {
          // Ignorar error si la tabla no existe o no tiene permisos de delete
          console.debug(`  Tabla ${entity} no encontrada o no se puede limpiar`);
        }
      }

      console.log('✅ Supabase Backend cleared');
    } catch (error) {
      console.error('❌ Failed to clear Supabase Backend:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    console.log('🔌 Closing Supabase Backend...');

    try {
      // Supabase no requiere cierre explícito
      this.supabaseClient = null;
      this.ready = false;
      console.log('✅ Supabase Backend closed');
    } catch (error) {
      console.error('❌ Failed to close Supabase Backend:', error);
      throw error;
    }
  }

  async create(entity: string, data: any): Promise<any> {
    if (!this.ready || !this.supabaseClient) throw new Error('Backend not initialized');

    try {
      // 🔄 Transformar DTO → BD (PascalCase → snake_case)
      const dbData = dtoToDb(entity as any, data);
      
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
      const transformed = result ? dbToDto(entity as any, result[0]) : data;
      return transformed;
    } catch (error) {
      console.error(`Error creating ${entity} in Supabase:`, error);
      throw error;
    }
  }

  async read(entity: string, id: any): Promise<any | undefined> {
    if (!this.ready || !this.supabaseClient) throw new Error('Backend not initialized');

    try {
      const idColumn = DATABASE_CONFIG.ID_COLUMNS[entity as keyof typeof DATABASE_CONFIG.ID_COLUMNS] || 'id';
      const { data, error } = await this.supabaseClient
        .from(entity)
        .select()
        .eq(idColumn, id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return undefined; // Not found
        throw error;
      }

      // 🔄 Transformar BD → DTO
      return data ? dbToDto(entity as any, data) : undefined;
    } catch (error) {
      console.error(`Error reading ${entity} from Supabase:`, error);
      throw error;
    }
  }

  async readAll(entity: string, filters?: any): Promise<any[]> {
    if (!this.ready || !this.supabaseClient) throw new Error('Backend not initialized');

    try {
      let query = this.supabaseClient.from(entity).select();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      // 🔄 Transformar BD → DTO para cada registro
      return (data || []).map(d => dbToDto(entity as any, d));
    } catch (error) {
      console.error(`Error reading all ${entity} from Supabase:`, error);
      throw error;
    }
  }

  async update(entity: string, id: any, data: any): Promise<any | undefined> {
    if (!this.ready || !this.supabaseClient) throw new Error('Backend not initialized');

    try {
      // 🔄 Transformar DTO → BD
      const dbData = dtoToDb(entity as any, data);
      const idColumn = DATABASE_CONFIG.ID_COLUMNS[entity as keyof typeof DATABASE_CONFIG.ID_COLUMNS] || 'id';

      const { data: result, error } = await this.supabaseClient
        .from(entity)
        .update(dbData)
        .eq(idColumn, id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return undefined; // Not found
        throw error;
      }

      // 🔄 Transformar BD → DTO
      return result ? dbToDto(entity as any, result) : undefined;
    } catch (error) {
      console.error(`Error updating ${entity} in Supabase:`, error);
      throw error;
    }
  }

  async delete(entity: string, id: any): Promise<void> {
    if (!this.ready || !this.supabaseClient) throw new Error('Backend not initialized');

    try {
      const idColumn = DATABASE_CONFIG.ID_COLUMNS[entity as keyof typeof DATABASE_CONFIG.ID_COLUMNS] || 'id';
      const { error } = await this.supabaseClient
        .from(entity)
        .delete()
        .eq(idColumn, id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting ${entity} from Supabase:`, error);
      throw error;
    }
  }

  async count(entity: string): Promise<number> {
    if (!this.ready || !this.supabaseClient) throw new Error('Backend not initialized');

    try {
      const { count, error } = await this.supabaseClient
        .from(entity)
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error(`Error counting ${entity} in Supabase:`, error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.ready;
  }

  /**
   * Debug: Ver estado del backend
   */
  getStats(): object {
    return { ready: this.ready, client: this.supabaseClient ? 'connected' : 'disconnected' };
  }
}
