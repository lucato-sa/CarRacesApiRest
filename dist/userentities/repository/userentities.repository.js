"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userentities = exports.UserEntityRepository = void 0;
const data_source_1 = require("../../database/data-source");
const userentity_entity_1 = require("../entities/userentity.entity");
/**
 * Repository con PostgreSQL para persistencia de UserEntities
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class UserEntityRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(userentity_entity_1.UserEntityMapping);
        }
        return this.repository;
    }
    /**
     * Obtiene todas las user entities
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { user_entity_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Crea una nueva user entity
     */
    async create(userEntity) {
        const entity = this.getRepository().create({
            user_id: userEntity.UserId,
            entity_link_id: userEntity.EntityLinkId,
            rol_id: userEntity.RolId,
        });
        const saved = await this.getRepository().save(entity);
        return this.entityToDto(saved);
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            UserEntityId: entity.user_entity_id,
            UserId: entity.user_id,
            EntityLinkId: entity.entity_link_id,
            RolId: entity.rol_id,
        };
    }
}
exports.UserEntityRepository = UserEntityRepository;
