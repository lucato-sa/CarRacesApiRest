/**
 * ☁️ SUPABASE BACKEND - Usa cliente Supabase (PostgreSQL hosted)
 * Ideal para tests en cloud
 * Perfecto para: Staging en cloud, tests remotos
 */

import { IBackend } from './IBackend';

// Type para cliente Supabase (si está instalado)
// import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseBackend implements IBackend {
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabaseClient: any; // SupabaseClient
  private ready: boolean = false;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabaseUrl = supabaseUrl || process.env.SUPABASE_URL || '';
    this.supabaseKey = supabaseKey || process.env.SUPABASE_KEY_ANON || '';
  }

  async initialize(): Promise<void> {
    console.log('☁️ Initializing Supabase Backend...');

    try {
      // Validar credenciales
      if (!this.supabaseUrl || !this.supabaseKey) {
        throw new Error('Supabase URL and Key are required');
      }

      // Nota: Para usar esto, necesitas: npm install @supabase/supabase-js
      // Descomenta las siguientes líneas cuando esté disponible:
      // const { createClient } = await import('@supabase/supabase-js');
      // this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);

      // Por ahora, simulamos la conexión
      console.log('⚠️  Supabase client not fully configured');
      console.log(`   URL: ${this.supabaseUrl.substring(0, 30)}...`);

      this.ready = true;
      console.log('✅ Supabase Backend initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase Backend:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    console.log('🧹 Clearing Supabase Backend...');

    if (!this.ready) throw new Error('Backend not initialized');

    try {
      // En Supabase, truncar tablas requiere admin key
      // Implementar cuando esté disponible el cliente completo
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
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      // Implementar cuando esté disponible el cliente completo
      // const { data: result, error } = await this.supabaseClient
      //   .from(entity)
      //   .insert([data])
      //   .select();
      //
      // if (error) throw error;
      // return result[0];

      console.warn(`[TODO] Create operation for ${entity} in Supabase`);
      return data;
    } catch (error) {
      console.error(`Error creating ${entity} in Supabase:`, error);
      throw error;
    }
  }

  async read(entity: string, id: any): Promise<any | undefined> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const idField = this.getIdField(entity);

      // Implementar cuando esté disponible el cliente completo
      // const { data, error } = await this.supabaseClient
      //   .from(entity)
      //   .select('*')
      //   .eq(idField, id)
      //   .single();
      //
      // if (error && error.code !== 'PGRST116') throw error;
      // return data;

      console.warn(`[TODO] Read operation for ${entity} in Supabase`);
      return undefined;
    } catch (error) {
      console.error(`Error reading ${entity} from Supabase:`, error);
      throw error;
    }
  }

  async readAll(entity: string, filters?: any): Promise<any[]> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      // Implementar cuando esté disponible el cliente completo
      // let query = this.supabaseClient.from(entity).select('*');
      //
      // if (filters) {
      //   Object.entries(filters).forEach(([key, value]) => {
      //     query = query.eq(key, value);
      //   });
      // }
      //
      // const { data, error } = await query;
      // if (error) throw error;
      // return data || [];

      console.warn(`[TODO] ReadAll operation for ${entity} in Supabase`);
      return [];
    } catch (error) {
      console.error(`Error reading all ${entity} from Supabase:`, error);
      throw error;
    }
  }

  async update(entity: string, id: any, data: any): Promise<any | undefined> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const idField = this.getIdField(entity);

      // Implementar cuando esté disponible el cliente completo
      // const { data: result, error } = await this.supabaseClient
      //   .from(entity)
      //   .update(data)
      //   .eq(idField, id)
      //   .select()
      //   .single();
      //
      // if (error) throw error;
      // return result;

      console.warn(`[TODO] Update operation for ${entity} in Supabase`);
      return data;
    } catch (error) {
      console.error(`Error updating ${entity} in Supabase:`, error);
      throw error;
    }
  }

  async delete(entity: string, id: any): Promise<void> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const idField = this.getIdField(entity);

      // Implementar cuando esté disponible el cliente completo
      // const { error } = await this.supabaseClient
      //   .from(entity)
      //   .delete()
      //   .eq(idField, id);
      //
      // if (error) throw error;

      console.warn(`[TODO] Delete operation for ${entity} in Supabase`);
    } catch (error) {
      console.error(`Error deleting ${entity} from Supabase:`, error);
      throw error;
    }
  }

  async count(entity: string): Promise<number> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      // Implementar cuando esté disponible el cliente completo
      // const { count, error } = await this.supabaseClient
      //   .from(entity)
      //   .select('*', { count: 'exact', head: true });
      //
      // if (error) throw error;
      // return count || 0;

      console.warn(`[TODO] Count operation for ${entity} in Supabase`);
      return 0;
    } catch (error) {
      console.error(`Error counting ${entity} in Supabase:`, error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.ready;
  }

  /**
   * Helper: Obtener campo ID para cada entidad
   */
  private getIdField(entity: string): string {
    const idFields: { [key: string]: string } = {
      users: 'UserId',
      clubs: 'ClubId',
      races: 'RaceId',
      competitions: 'CompetitionId',
      championships: 'ChampionshipId',
      events: 'EventId',
      registrations: 'RegistrationId',
      disciplines: 'DisciplineId',
      formats: 'FormatId',
      surfaces: 'SurfaceId',
      divisions: 'DivisionId',
      roles: 'RoleId',
      rolEntities: 'RolEntityId',
      userEntities: 'UserEntityId',
      raceResults: 'RaceResultId',
      entityLinks: 'EntityLinkId',
      specialities: 'SpecialityId',
      drivingEnvironments: 'DrivingEnviromentId',
    };

    return idFields[entity] || 'id';
  }

  /**
   * Debug: Información de conexión
   */
  getConnectionInfo(): object {
    return {
      url: this.supabaseUrl.substring(0, 50) + '...',
      ready: this.ready,
      note: 'Full Supabase integration requires @supabase/supabase-js package',
    };
  }

  /**
   * Obtener cliente Supabase para operaciones avanzadas
   */
  getClient(): any {
    return this.supabaseClient;
  }
}
