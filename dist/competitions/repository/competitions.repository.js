"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.competitions = exports.CompetitionRepository = void 0;
const data_source_1 = require("../../database/data-source");
const competition_entity_1 = require("../entities/competition.entity");
/**
 * Repository con PostgreSQL para persistencia de Competitions
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class CompetitionRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(competition_entity_1.CompetitionEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los competitions
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { competition_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un competition por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { competition_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Crea un nuevo competition
     */
    async create(competition) {
        const entity = this.getRepository().create({
            season_id: competition.SeasonId,
            event_id: competition.EventId,
            venue_id: competition.VenueId,
            alias: competition.Alias,
            total_races: competition.TotalRaces,
            fecha_inicio_inscrip_pri: competition.FechaInicioInscripPri,
            fecha_fin_inscrip_pri: competition.FechaFinInscripPri,
            fecha_inicio_inscrip: competition.FechaInicioInscrip,
            fecha_fin_inscrip: competition.FechaFinInscrip,
            pilotos_min_inscrip: competition.PilotosMinInscrip,
            pilotos_max_inscrip: competition.PilotosMaxInscrip,
            responsable: competition.Responsable,
            solo_usuarios_reg: competition.SoloUsuariosReg,
            notas: competition.Notas,
        });
        const saved = await this.getRepository().save(entity);
        return this.entityToDto(saved);
    }
    /**
     * Actualiza un competition existente
     */
    async update(id, competition) {
        const existing = await this.getRepository().findOne({ where: { competition_id: id } });
        if (!existing)
            return undefined;
        const updates = {};
        if (competition.SeasonId !== undefined)
            updates.season_id = competition.SeasonId;
        if (competition.EventId !== undefined)
            updates.event_id = competition.EventId;
        if (competition.VenueId !== undefined)
            updates.venue_id = competition.VenueId;
        if (competition.Alias !== undefined)
            updates.alias = competition.Alias;
        if (competition.TotalRaces !== undefined)
            updates.total_races = competition.TotalRaces;
        if (competition.FechaInicioInscripPri !== undefined)
            updates.fecha_inicio_inscrip_pri = competition.FechaInicioInscripPri;
        if (competition.FechaFinInscripPri !== undefined)
            updates.fecha_fin_inscrip_pri = competition.FechaFinInscripPri;
        if (competition.FechaInicioInscrip !== undefined)
            updates.fecha_inicio_inscrip = competition.FechaInicioInscrip;
        if (competition.FechaFinInscrip !== undefined)
            updates.fecha_fin_inscrip = competition.FechaFinInscrip;
        if (competition.PilotosMinInscrip !== undefined)
            updates.pilotos_min_inscrip = competition.PilotosMinInscrip;
        if (competition.PilotosMaxInscrip !== undefined)
            updates.pilotos_max_inscrip = competition.PilotosMaxInscrip;
        if (competition.Responsable !== undefined)
            updates.responsable = competition.Responsable;
        if (competition.SoloUsuariosReg !== undefined)
            updates.solo_usuarios_reg = competition.SoloUsuariosReg;
        if (competition.Notas !== undefined)
            updates.notas = competition.Notas;
        await this.getRepository().update({ competition_id: id }, updates);
        const updated = await this.getRepository().findOne({ where: { competition_id: id } });
        return updated ? this.entityToDto(updated) : undefined;
    }
    /**
     * Elimina un competition
     */
    async delete(id) {
        const result = await this.getRepository().delete({ competition_id: id });
        return (result.affected || 0) > 0;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            CompetitionId: entity.competition_id,
            SeasonId: entity.season_id,
            EventId: entity.event_id,
            VenueId: entity.venue_id,
            Alias: entity.alias,
            TotalRaces: entity.total_races,
            FechaInicioInscripPri: entity.fecha_inicio_inscrip_pri,
            FechaFinInscripPri: entity.fecha_fin_inscrip_pri,
            FechaInicioInscrip: entity.fecha_inicio_inscrip,
            FechaFinInscrip: entity.fecha_fin_inscrip,
            PilotosMinInscrip: entity.pilotos_min_inscrip,
            PilotosMaxInscrip: entity.pilotos_max_inscrip,
            Responsable: entity.responsable,
            SoloUsuariosReg: entity.solo_usuarios_reg,
            Notas: entity.notas,
        };
    }
}
exports.CompetitionRepository = CompetitionRepository;
