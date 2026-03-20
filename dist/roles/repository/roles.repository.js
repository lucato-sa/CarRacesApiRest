"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = exports.RoleRepository = void 0;
const data_source_1 = require("../../database/data-source");
const role_entity_1 = require("../entities/role.entity");
/**
 * Repository con PostgreSQL para persistencia de Roles
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class RoleRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(role_entity_1.RoleEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los roles
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { rol_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un role por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { rol_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            RolId: entity.rol_id,
            Nombre: entity.nombre,
            Pseudonimo: entity.pseudonimo,
        };
    }
}
exports.RoleRepository = RoleRepository;
