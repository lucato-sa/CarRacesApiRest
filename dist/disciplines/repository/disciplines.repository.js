"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disciplines = exports.DisciplineRepository = void 0;
const data_source_1 = require("../../database/data-source");
const discipline_entity_1 = require("../entities/discipline.entity");
/**
 * Repository con PostgreSQL para persistencia de Disciplines
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class DisciplineRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(discipline_entity_1.DisciplineEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los disciplines
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { discipline_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un discipline por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { discipline_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            DisciplineId: entity.discipline_id,
            SpecialityId: entity.speciality_id,
            FormatId: entity.format_id,
            SurfaceId: entity.surface_id,
            Alias: entity.alias,
        };
    }
}
exports.DisciplineRepository = DisciplineRepository;
