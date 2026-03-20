"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divisions = exports.DivisionRepository = void 0;
const data_source_1 = require("../../database/data-source");
const division_entity_1 = require("../entities/division.entity");
/**
 * Repository con PostgreSQL para persistencia de Divisions
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class DivisionRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(division_entity_1.DivisionEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los divisions
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { division_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un division por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { division_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            DivisionId: entity.division_id,
            DisciplineId: entity.discipline_id,
            Alias: entity.alias,
            Descripcion: entity.descripcion,
        };
    }
}
exports.DivisionRepository = DivisionRepository;
