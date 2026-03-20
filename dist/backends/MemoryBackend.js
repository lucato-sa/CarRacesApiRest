"use strict";
/**
 * 📱 MEMORY BACKEND - Almacena datos en RAM
 * Ideal para tests rápidos, sin persistencia
 * Perfecto para: Tests unitarios, TDD, CI/CD
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryBackend = void 0;
class MemoryBackend {
    constructor() {
        this.dataStore = {};
        this.counters = {};
        this.ready = false;
        // Entidades soportadas
        this.entities = [
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
    }
    async initialize() {
        console.log('🚀 Initializing Memory Backend...');
        // Crear almacenamiento para cada entidad
        this.entities.forEach(entity => {
            this.dataStore[entity] = {};
            this.counters[entity] = 0;
        });
        this.ready = true;
        console.log('✅ Memory Backend initialized');
    }
    async clear() {
        console.log('🧹 Clearing Memory Backend...');
        // Resetear todos los datos
        this.entities.forEach(entity => {
            this.dataStore[entity] = {};
            this.counters[entity] = 0;
        });
        console.log('✅ Memory Backend cleared');
    }
    async close() {
        console.log('🔌 Closing Memory Backend...');
        this.dataStore = {};
        this.counters = {};
        this.ready = false;
        console.log('✅ Memory Backend closed');
    }
    async create(entity, data) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
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
    async read(entity, id) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        return this.dataStore[entity][id];
    }
    async readAll(entity, filters) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        let records = Object.values(this.dataStore[entity]);
        // Aplicar filtros si existen
        if (filters) {
            records = records.filter(record => {
                return Object.entries(filters).every(([key, value]) => record[key] === value);
            });
        }
        return records;
    }
    async update(entity, id, data) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        const existing = this.dataStore[entity][id];
        if (!existing)
            return undefined;
        const updated = {
            ...existing,
            ...data,
            updatedAt: new Date().toISOString(),
        };
        this.dataStore[entity][id] = updated;
        return updated;
    }
    async delete(entity, id) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        delete this.dataStore[entity][id];
    }
    async count(entity) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        return Object.keys(this.dataStore[entity]).length;
    }
    isReady() {
        return this.ready;
    }
    /**
     * Helper: Obtener campo ID para cada entidad
     */
    getIdField(entity) {
        const idFields = {
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
    getStats() {
        const stats = {};
        this.entities.forEach(entity => {
            stats[entity] = Object.keys(this.dataStore[entity]).length;
        });
        return stats;
    }
}
exports.MemoryBackend = MemoryBackend;
