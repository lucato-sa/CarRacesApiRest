"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitylinks = exports.EntityLinkRepository = void 0;
const data_source_1 = require("../../database/data-source");
const entitylink_entity_1 = require("../entities/entitylink.entity");
/**
 * Repository con PostgreSQL para persistencia de EntityLinks
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class EntityLinkRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(entitylink_entity_1.EntityLinkEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los entity links
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { entity_link_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un entity link por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { entity_link_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            EntityLinkId: entity.entity_link_id,
            EntityName: entity.entity_name,
            EntityId: entity.entity_id,
        };
    }
}
exports.EntityLinkRepository = EntityLinkRepository;
