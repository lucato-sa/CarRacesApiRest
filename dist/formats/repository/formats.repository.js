"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formats = exports.FormatRepository = void 0;
const data_source_1 = require("../../database/data-source");
const format_entity_1 = require("../entities/format.entity");
/**
 * Repository con PostgreSQL para persistencia de Formats
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class FormatRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(format_entity_1.FormatEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los formats
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { format_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un format por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { format_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Crea un nuevo format
     */
    async create(format) {
        const entity = this.getRepository().create({
            alias: format.Alias,
            descripcion: format.Descripcion,
        });
        const saved = await this.getRepository().save(entity);
        return this.entityToDto(saved);
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            FormatId: entity.format_id,
            Alias: entity.alias,
            Descripcion: entity.descripcion,
        };
    }
}
exports.FormatRepository = FormatRepository;
