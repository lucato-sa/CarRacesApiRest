"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drivingenviroments = exports.DrivingEnvironmentRepository = void 0;
const data_source_1 = require("../../database/data-source");
const drivingenvironment_entity_1 = require("../entities/drivingenvironment.entity");
/**
 * Repository con PostgreSQL para persistencia de DrivingEnvironments
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class DrivingEnvironmentRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(drivingenvironment_entity_1.DrivingEnvironmentEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los driving environments
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { driving_environment_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un driving environment por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { driving_environment_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Crea un nuevo driving environment
     */
    async create(env) {
        const entity = this.getRepository().create({
            alias: env.Alias,
            descripcion: env.Descripcion,
            default: env.default || false,
        });
        const saved = await this.getRepository().save(entity);
        return this.entityToDto(saved);
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            DrivingEnviromentId: entity.driving_environment_id,
            Alias: entity.alias,
            Descripcion: entity.descripcion,
            default: entity.default,
        };
    }
}
exports.DrivingEnvironmentRepository = DrivingEnvironmentRepository;
