"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raceresults = exports.RaceResultRepository = void 0;
const data_source_1 = require("../../database/data-source");
const raceresult_entity_1 = require("../entities/raceresult.entity");
/**
 * Repository con PostgreSQL para persistencia de RaceResults
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class RaceResultRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(raceresult_entity_1.RaceResultEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene un race result por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { result_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Actualiza un race result existente
     */
    async update(id, result) {
        const existing = await this.getRepository().findOne({ where: { result_id: id } });
        if (!existing)
            return undefined;
        const updates = {};
        if (result.RaceId !== undefined)
            updates.race_id = result.RaceId;
        if (result.UserId !== undefined)
            updates.user_id = result.UserId;
        if (result.Posicion !== undefined)
            updates.posicion = result.Posicion;
        if (result.Vueltas !== undefined)
            updates.vueltas = result.Vueltas;
        if (result.PrimeraLinea !== undefined)
            updates.primera_linea = result.PrimeraLinea;
        if (result.VueltaRapida !== undefined)
            updates.vuelta_rapida = result.VueltaRapida;
        await this.getRepository().update({ result_id: id }, updates);
        const updated = await this.getRepository().findOne({ where: { result_id: id } });
        return updated ? this.entityToDto(updated) : undefined;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            ResultId: entity.result_id,
            RaceId: entity.race_id,
            UserId: entity.user_id,
            Posicion: entity.posicion,
            Vueltas: entity.vueltas,
            PrimeraLinea: entity.primera_linea,
            VueltaRapida: entity.vuelta_rapida,
        };
    }
}
exports.RaceResultRepository = RaceResultRepository;
