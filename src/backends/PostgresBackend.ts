/**
 * 🐘 POSTGRES BACKEND - SQL Native con pg driver
 * Ideal para tests de integración realistas
 * Perfecto para: Tests de integración, staging, producción
 */

import { IBackend } from './IBackend';
import { dbPool, queryOne, queryAll, executeQuery, initializeDB, closeDB } from '../database/data-source';

export class PostgresBackend implements IBackend {
  private ready: boolean = false;

  async initialize(): Promise<void> {
    console.log('🐘 Initializing PostgreSQL Backend...');

    try {
      await initializeDB();
      this.ready = true;
      console.log('✅ PostgreSQL Backend initialized');
    } catch (error) {
      console.error('❌ Failed to initialize PostgreSQL Backend:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    console.log('🧹 Clearing PostgreSQL Backend...');

    if (!this.ready) throw new Error('Backend not initialized');

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
      await executeQuery('SET session_replication_role = REPLICA', []);

      for (const table of tables) {
        try {
          await executeQuery(`TRUNCATE TABLE ${table} CASCADE`, []);
        } catch (e) {
          // Table might not exist, skip silently
        }
      }

      // Re-enable foreign key constraints
      await executeQuery('SET session_replication_role = DEFAULT', []);

      console.log('✅ PostgreSQL Backend cleared');
    } catch (error) {
      console.error('❌ Failed to clear PostgreSQL Backend:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    console.log('🔌 Closing PostgreSQL Backend...');

    try {
      await closeDB();
      this.ready = false;
      console.log('✅ PostgreSQL Backend closed');
    } catch (error) {
      console.error('❌ Failed to close PostgreSQL Backend:', error);
      throw error;
    }
  }

  async create(entity: string, data: any): Promise<any> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

      const result = await executeQuery(
        `INSERT INTO ${entity} (${columns.join(', ')}) 
         VALUES (${placeholders}) 
         RETURNING *`,
        values
      );

      return result.rows[0];
    } catch (error) {
      console.error(`Error creating ${entity}:`, error);
      throw error;
    }
  }

  async read(entity: string, id: any): Promise<any | undefined> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const idField = this.getIdField(entity);
      const result = await queryOne(
        `SELECT * FROM ${entity} WHERE ${idField} = $1`,
        [id]
      );

      return result;
    } catch (error) {
      console.error(`Error reading ${entity}:`, error);
      throw error;
    }
  }

  async readAll(entity: string, filters?: any): Promise<any[]> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      let query = `SELECT * FROM ${entity}`;
      const params: any[] = [];

      if (filters && Object.keys(filters).length > 0) {
        const conditions = Object.entries(filters).map(([key, value], i) => {
          params.push(value);
          return `${key} = $${i + 1}`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      return await queryAll(query, params);
    } catch (error) {
      console.error(`Error reading all ${entity}:`, error);
      throw error;
    }
  }

  async update(entity: string, id: any, data: any): Promise<any | undefined> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const idField = this.getIdField(entity);
      const setClause = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');

      const params = [...Object.values(data), id];

      const result = await queryOne(
        `UPDATE ${entity} SET ${setClause} WHERE ${idField} = $${Object.keys(data).length + 1} RETURNING *`,
        params
      );

      return result;
    } catch (error) {
      console.error(`Error updating ${entity}:`, error);
      throw error;
    }
  }

  async delete(entity: string, id: any): Promise<void> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const idField = this.getIdField(entity);
      await executeQuery(`DELETE FROM ${entity} WHERE ${idField} = $1`, [id]);
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error);
      throw error;
    }
  }

  async count(entity: string): Promise<number> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const result = await queryOne(`SELECT COUNT(*) as count FROM ${entity}`, []);
      return parseInt(result?.count || 0, 10);
    } catch (error) {
      console.error(`Error counting ${entity}:`, error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.ready;
  }

  /**
   * Helper: Get ID field for each entity
   */
  private getIdField(entity: string): string {
    // Convert entity name to id field: "users" -> "user_id", "clubs" -> "club_id"
    const singular = entity.endsWith('s') ? entity.slice(0, -1) : entity;
    return `${singular}_id`;
  }

  /**
   * Debug: Check connection status
   */
  isConnected(): boolean {
    return this.ready && dbPool.totalCount > 0;
  }

  /**
   * Execute raw query (for special operations)
   */
  async query(query: string, params?: any[]): Promise<any> {
    if (!this.ready) throw new Error('Backend not initialized');
    return executeQuery(query, params || []);
  }
}
