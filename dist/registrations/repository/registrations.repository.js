"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrations = exports.RegistrationRepository = void 0;
const data_source_1 = require("../../database/data-source");
const registration_entity_1 = require("../entities/registration.entity");
/**
 * Repository con PostgreSQL para persistencia de Registrations
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class RegistrationRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(registration_entity_1.RegistrationEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los registrations
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { registration_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un registration por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { registration_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Crea un nuevo registration
     */
    async create(registration) {
        const entity = this.getRepository().create({
            competition_id: registration.CompetitionId,
            user_id: registration.UserId,
            fecha_registro: registration.FechaRegistro,
            estado: registration.Estado,
        });
        const saved = await this.getRepository().save(entity);
        return this.entityToDto(saved);
    }
    /**
     * Elimina un registration
     */
    async delete(id) {
        const result = await this.getRepository().delete({ registration_id: id });
        return (result.affected || 0) > 0;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            RegistrationId: entity.registration_id,
            CompetitionId: entity.competition_id,
            UserId: entity.user_id,
            FechaRegistro: entity.fecha_registro,
            Estado: entity.estado,
        };
    }
}
exports.RegistrationRepository = RegistrationRepository;
