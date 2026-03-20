"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.surfaces = exports.SurfaceRepository = void 0;
const data_source_1 = require("../../database/data-source");
const surface_entity_1 = require("../entities/surface.entity");
/**
 * Repository con PostgreSQL para persistencia de Surfaces
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class SurfaceRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(surface_entity_1.SurfaceEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los surfaces
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { surface_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un surface por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { surface_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Crea un nuevo surface
     */
    async create(surface) {
        const entity = this.getRepository().create({
            alias: surface.Alias,
            descripcion: surface.Descripcion,
        });
        const saved = await this.getRepository().save(entity);
        return this.entityToDto(saved);
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            SurfaceId: entity.surface_id,
            Alias: entity.alias,
            Descripcion: entity.descripcion,
        };
    }
}
exports.SurfaceRepository = SurfaceRepository;
