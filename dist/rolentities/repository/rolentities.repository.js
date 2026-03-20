"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolentities = exports.RolEntityRepository = void 0;
const data_source_1 = require("../../database/data-source");
const rolentity_entity_1 = require("../entities/rolentity.entity");
/**
 * Repository con PostgreSQL para persistencia de RolEntities
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class RolEntityRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(rolentity_entity_1.RolEntityMapping);
        }
        return this.repository;
    }
    /**
     * Obtiene todas las rol entities
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { rol_entity_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Crea una nueva rol entity
     */
    async create(rolEntity) {
        const entity = this.getRepository().create({
            entity_link_id: rolEntity.EntityLinkId,
            rol_id: rolEntity.RolId,
        });
        const saved = await this.getRepository().save(entity);
        return this.entityToDto(saved);
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            RolEntityId: entity.rol_entity_id,
            EntityLinkId: entity.entity_link_id,
            RolId: entity.rol_id,
        };
    }
}
exports.RolEntityRepository = RolEntityRepository;
