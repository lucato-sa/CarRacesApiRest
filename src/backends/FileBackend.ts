/**
 * 📁 FILE BACKEND - Almacena datos en JSON files
 * Ideal para tests locales, persistencia simple
 * Perfecto para: Tests de integración local, desarrollo
 */

import { IBackend } from './IBackend';
import * as fs from 'fs';
import * as path from 'path';

interface DataStore {
  [entityName: string]: any[];
}

export class FileBackend implements IBackend {
  private dataDir: string;
  private dataStore: DataStore = {};
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

  constructor(dataDir: string = './test-data') {
    this.dataDir = dataDir;
  }

  async initialize(): Promise<void> {
    console.log(`📁 Initializing File Backend at ${this.dataDir}...`);

    // Crear directorio si no existe
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    // Cargar o crear archivos JSON para cada entidad
    for (const entity of this.entities) {
      const filePath = path.join(this.dataDir, `${entity}.json`);

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        this.dataStore[entity] = JSON.parse(content);
      } else {
        this.dataStore[entity] = [];
        this.saveEntity(entity);
      }
    }

    this.ready = true;
    console.log('✅ File Backend initialized');
  }

  async clear(): Promise<void> {
    console.log('🧹 Clearing File Backend...');

    // Limpiar todos los archivos
    for (const entity of this.entities) {
      this.dataStore[entity] = [];
      this.saveEntity(entity);
    }

    console.log('✅ File Backend cleared');
  }

  async close(): Promise<void> {
    console.log('🔌 Closing File Backend...');

    // Guardar todos los datos antes de cerrar
    for (const entity of this.entities) {
      this.saveEntity(entity);
    }

    this.dataStore = {};
    this.ready = false;
    console.log('✅ File Backend closed');
  }

  async create(entity: string, data: any): Promise<any> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    const records = this.dataStore[entity];
    const id = records.length > 0 ? Math.max(...records.map(r => r[this.getIdField(entity)] || 0)) + 1 : 1;
    const idField = this.getIdField(entity);

    const record = {
      [idField]: id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    records.push(record);
    this.saveEntity(entity);
    return record;
  }

  async read(entity: string, id: any): Promise<any | undefined> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    const idField = this.getIdField(entity);
    return this.dataStore[entity].find(r => r[idField] === id);
  }

  async readAll(entity: string, filters?: any): Promise<any[]> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    let records = this.dataStore[entity];

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

    const idField = this.getIdField(entity);
    const record = this.dataStore[entity].find(r => r[idField] === id);

    if (!record) return undefined;

    Object.assign(record, data, {
      updatedAt: new Date().toISOString(),
    });

    this.saveEntity(entity);
    return record;
  }

  async delete(entity: string, id: any): Promise<void> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    const idField = this.getIdField(entity);
    const index = this.dataStore[entity].findIndex(r => r[idField] === id);

    if (index > -1) {
      this.dataStore[entity].splice(index, 1);
      this.saveEntity(entity);
    }
  }

  async count(entity: string): Promise<number> {
    if (!this.ready) throw new Error('Backend not initialized');
    if (!this.dataStore[entity]) throw new Error(`Entity ${entity} not found`);

    return this.dataStore[entity].length;
  }

  isReady(): boolean {
    return this.ready;
  }

  /**
   * Helper: Guardar entidad a archivo JSON
   */
  private saveEntity(entity: string): void {
    const filePath = path.join(this.dataDir, `${entity}.json`);
    fs.writeFileSync(filePath, JSON.stringify(this.dataStore[entity], null, 2), 'utf-8');
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
      stats[entity] = this.dataStore[entity]?.length || 0;
    });
    return stats;
  }
}
