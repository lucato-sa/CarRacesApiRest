"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialities = exports.SpecialityRepository = void 0;
const data_source_1 = require("../../database/data-source");
const speciality_entity_1 = require("../entities/speciality.entity");
/**
 * Repository con PostgreSQL para persistencia de Specialities
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class SpecialityRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(speciality_entity_1.SpecialityEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los specialities
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { speciality_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un speciality por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { speciality_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            SpecialityId: entity.speciality_id,
            Alias: entity.alias,
            Descripcion: entity.descripcion,
            default: entity.default,
        };
    }
}
exports.SpecialityRepository = SpecialityRepository;
