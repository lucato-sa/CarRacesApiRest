"use strict";
/**
 * 📁 FILE BACKEND - Almacena datos en JSON files
 * Ideal para tests locales, persistencia simple
 * Perfecto para: Tests de integración local, desarrollo
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBackend = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FileBackend {
    constructor(dataDir = './test-data') {
        this.dataStore = {};
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
        this.dataDir = dataDir;
    }
    async initialize() {
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
            }
            else {
                this.dataStore[entity] = [];
                this.saveEntity(entity);
            }
        }
        this.ready = true;
        console.log('✅ File Backend initialized');
    }
    async clear() {
        console.log('🧹 Clearing File Backend...');
        // Limpiar todos los archivos
        for (const entity of this.entities) {
            this.dataStore[entity] = [];
            this.saveEntity(entity);
        }
        console.log('✅ File Backend cleared');
    }
    async close() {
        console.log('🔌 Closing File Backend...');
        // Guardar todos los datos antes de cerrar
        for (const entity of this.entities) {
            this.saveEntity(entity);
        }
        this.dataStore = {};
        this.ready = false;
        console.log('✅ File Backend closed');
    }
    async create(entity, data) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
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
    async read(entity, id) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        const idField = this.getIdField(entity);
        return this.dataStore[entity].find(r => r[idField] === id);
    }
    async readAll(entity, filters) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        let records = this.dataStore[entity];
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
        const idField = this.getIdField(entity);
        const record = this.dataStore[entity].find(r => r[idField] === id);
        if (!record)
            return undefined;
        Object.assign(record, data, {
            updatedAt: new Date().toISOString(),
        });
        this.saveEntity(entity);
        return record;
    }
    async delete(entity, id) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        const idField = this.getIdField(entity);
        const index = this.dataStore[entity].findIndex(r => r[idField] === id);
        if (index > -1) {
            this.dataStore[entity].splice(index, 1);
            this.saveEntity(entity);
        }
    }
    async count(entity) {
        if (!this.ready)
            throw new Error('Backend not initialized');
        if (!this.dataStore[entity])
            throw new Error(`Entity ${entity} not found`);
        return this.dataStore[entity].length;
    }
    isReady() {
        return this.ready;
    }
    /**
     * Helper: Guardar entidad a archivo JSON
     */
    saveEntity(entity) {
        const filePath = path.join(this.dataDir, `${entity}.json`);
        fs.writeFileSync(filePath, JSON.stringify(this.dataStore[entity], null, 2), 'utf-8');
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
            stats[entity] = this.dataStore[entity]?.length || 0;
        });
        return stats;
    }
}
exports.FileBackend = FileBackend;
