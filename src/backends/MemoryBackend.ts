/**
 * 📱 MEMORY BACKEND - Almacena datos en RAM
 * Ideal para tests rápidos, sin persistencia
 * Perfecto para: Tests unitarios, TDD, CI/CD
 */

import { IBackend } from './IBackend';

interface DataStore {
  [entityName: string]: {
    [id: string]: any;
  };
}

interface Counters {
  [entityName: string]: number;
}

export class MemoryBackend implements IBackend {
  private dataStore: DataStore = {};
  private counters: Counters = {};
  private ready: boolean = false;

  // Entidades soportadas
  private readonly entities = [
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

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Memory Backend...');

    // Crear almacenamiento para cada entidad
    this.entities.forEach(entity => {
      this.dataStore[entity] = {};
      this.counters[entity] = 0;
    });

    this.ready = true;
    console.log('✅ Memory Backend initialized');
  }

  async clear(): Promise<void> {
    console.log('🧹 Clearing Memory Backend...');

    // Resetear todos los datos
    this.entities.forEach(entity => {
      this.dataStore[entity] = {};
      this.counters[entity] = 0;
    });

    console.log('✅ Memory Backend cleared');
  }

  async close(): Promise<void> {
    console.log('🔌 Closing Memory Backend...');
    this.dataStore = {};
    this.counters = {};
    this.ready = false;
    console.log('✅ Memory Backend closed');
  }

  async create(entity: string, data: any): Promise<any> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    // Generar ID autoincremental
    const id = ++this.counters[entity];
    const idField = this.getIdField(entity);

    const record = {
      [idField]: id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.dataStore[entity][id] = record;
    return record;
  }

  async read(entity: string, id: any): Promise<any | undefined> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    return this.dataStore[entity][id];
  }

  async readAll(entity: string, filters?: any): Promise<any[]> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    let records = Object.values(this.dataStore[entity]);

    // Aplicar filtros si existen
    if (filters) {
      records = records.filter(record => {
        return Object.entries(filters).every(([key, value]) => record[key] === value);
      });
    }

    return records;
  }

  async update(entity: string, id: any, data: any): Promise<any | undefined> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    const existing = this.dataStore[entity][id];
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.dataStore[entity][id] = updated;
    return updated;
  }

  async delete(entity: string, id: any): Promise<void> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    delete this.dataStore[entity][id];
  }

  async count(entity: string): Promise<number> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    return Object.keys(this.dataStore[entity]).length;
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
   * Debug: Ver estado del backend
   */
  getStats(): object {
    const stats: any = {};
    this.entities.forEach(entity => {
      stats[entity] = Object.keys(this.dataStore[entity]).length;
    });
    return stats;
  }
}
