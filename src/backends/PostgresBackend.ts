/**
 * 🐘 POSTGRES BACKEND - Usa TypeORM y PostgreSQL
 * Ideal para tests de integración realistas
 * Perfecto para: Tests de integración, staging, producción
 */

import { IBackend } from './IBackend';
import { DataSource } from 'typeorm';

export class PostgresBackend implements IBackend {
  private dataSource: DataSource;
  private ready: boolean = false;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async initialize(): Promise<void> {
    console.log('🐘 Initializing PostgreSQL Backend...');

    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      // Opcionalmente sincronizar esquema en tests
      if (process.env.DB_SYNCHRONIZE === 'true') {
        console.log('  ⚠️  Synchronizing database schema...');
        await this.dataSource.synchronize();
      }

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
      const entities = [
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
        'rolEntities',
        'userEntities',
        'raceResults',
        'entityLinks',
        'specialities',
        'drivingEnvironments',
      ];

      for (const entity of entities) {
        try {
          await this.dataSource.query(`TRUNCATE TABLE "${entity}" CASCADE`);
        } catch (e) {
          // Table might not exist, skip silently
        }
      }

      console.log('✅ PostgreSQL Backend cleared');
    } catch (error) {
      console.error('❌ Failed to clear PostgreSQL Backend:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    console.log('🔌 Closing PostgreSQL Backend...');

    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }
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
      const result = await this.dataSource.query(
        `INSERT INTO "${entity}" (${Object.keys(data).join(', ')}) 
         VALUES (${Object.keys(data).map((_, i) => `$${i + 1}`).join(', ')}) 
         RETURNING *`,
        Object.values(data)
      );

      return result[0];
    } catch (error) {
      console.error(`Error creating ${entity}:`, error);
      throw error;
    }
  }

  async read(entity: string, id: any): Promise<any | undefined> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const idField = this.getIdField(entity);
      const result = await this.dataSource.query(
        `SELECT * FROM "${entity}" WHERE "${idField}" = $1`,
        [id]
      );

      return result[0];
    } catch (error) {
      console.error(`Error reading ${entity}:`, error);
      throw error;
    }
  }

  async readAll(entity: string, filters?: any): Promise<any[]> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      let query = `SELECT * FROM "${entity}"`;
      const params: any[] = [];

      if (filters && Object.keys(filters).length > 0) {
        const conditions = Object.entries(filters).map(([key, value], i) => {
          params.push(value);
          return `"${key}" = $${i + 1}`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      return await this.dataSource.query(query, params);
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
        .map((key, i) => `"${key}" = $${i + 1}`)
        .join(', ');

      const params = [...Object.values(data), id];

      const result = await this.dataSource.query(
        `UPDATE "${entity}" SET ${setClause} WHERE "${idField}" = $${Object.keys(data).length + 1} RETURNING *`,
        params
      );

      return result[0];
    } catch (error) {
      console.error(`Error updating ${entity}:`, error);
      throw error;
    }
  }

  async delete(entity: string, id: any): Promise<void> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const idField = this.getIdField(entity);
      await this.dataSource.query(`DELETE FROM "${entity}" WHERE "${idField}" = $1`, [id]);
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error);
      throw error;
    }
  }

  async count(entity: string): Promise<number> {
    if (!this.ready) throw new Error('Backend not initialized');

    try {
      const result = await this.dataSource.query(`SELECT COUNT(*) as count FROM "${entity}"`);
      return parseInt(result[0].count, 10);
    } catch (error) {
      console.error(`Error counting ${entity}:`, error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.ready && this.dataSource.isInitialized;
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
   * Debug: Ver conexión
   */
  isConnected(): boolean {
    return this.dataSource.isInitialized;
  }

  /**
   * Ejecutar query raw (para operaciones especiales)
   */
  async query(query: string, params?: any[]): Promise<any> {
    if (!this.ready) throw new Error('Backend not initialized');
    return this.dataSource.query(query, params);
  }
}
