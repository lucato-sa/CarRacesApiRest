"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.championships = exports.ChampionshipRepository = void 0;
const data_source_1 = require("../../database/data-source");
const championship_entity_1 = require("../entities/championship.entity");
/**
 * Repository con PostgreSQL para persistencia de Championships
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class ChampionshipRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(championship_entity_1.ChampionshipEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los championships
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { championship_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un championship por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { championship_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            ChampionshipId: entity.championship_id,
            Alias: entity.alias,
            Descripcion: entity.descripcion,
            ClubId: entity.club_id,
        };
    }
}
exports.ChampionshipRepository = ChampionshipRepository;
