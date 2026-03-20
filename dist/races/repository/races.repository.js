"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.races = exports.RaceRepository = void 0;
const data_source_1 = require("../../database/data-source");
const race_entity_1 = require("../entities/race.entity");
/**
 * Repository con PostgreSQL para persistencia de Races
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class RaceRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(race_entity_1.RaceEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene una race por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { race_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Actualiza una race existente
     */
    async update(id, race) {
        const existing = await this.getRepository().findOne({ where: { race_id: id } });
        if (!existing)
            return undefined;
        const updates = {};
        if (race.CompetitionId !== undefined)
            updates.competition_id = race.CompetitionId;
        if (race.NumRace !== undefined)
            updates.num_race = race.NumRace;
        if (race.Fecha !== undefined)
            updates.fecha = race.Fecha;
        if (race.Hora !== undefined)
            updates.hora = race.Hora;
        if (race.Estado !== undefined)
            updates.estado = race.Estado;
        await this.getRepository().update({ race_id: id }, updates);
        const updated = await this.getRepository().findOne({ where: { race_id: id } });
        return updated ? this.entityToDto(updated) : undefined;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            RaceId: entity.race_id,
            CompetitionId: entity.competition_id,
            NumRace: entity.num_race,
            Fecha: entity.fecha,
            Hora: entity.hora,
            Estado: entity.estado,
        };
    }
}
exports.RaceRepository = RaceRepository;
