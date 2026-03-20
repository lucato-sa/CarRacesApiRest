"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.EventRepository = void 0;
const data_source_1 = require("../../database/data-source");
const event_entity_1 = require("../entities/event.entity");
/**
 * Repository con PostgreSQL para persistencia de Events
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
class EventRepository {
    getRepository() {
        if (!this.repository) {
            this.repository = data_source_1.AppDataSource.getRepository(event_entity_1.EventEntity);
        }
        return this.repository;
    }
    /**
     * Obtiene todos los events
     */
    async getAll() {
        const entities = await this.getRepository().find({ order: { event_id: 'ASC' } });
        return entities.map(e => this.entityToDto(e));
    }
    /**
     * Obtiene un event por ID
     */
    async getById(id) {
        const entity = await this.getRepository().findOne({ where: { event_id: id } });
        return entity ? this.entityToDto(entity) : undefined;
    }
    /**
     * Crea un nuevo event
     */
    async create(event) {
        const entity = this.getRepository().create({
            descripcion: event.Descripcion,
            fecha_inicio: event.FechaInicio,
            fecha_fin: event.FechaFin,
            club_id: event.ClubId,
        });
        const saved = await this.getRepository().save(entity);
        return this.entityToDto(saved);
    }
    /**
     * Actualiza un event existente
     */
    async update(id, event) {
        const existing = await this.getRepository().findOne({ where: { event_id: id } });
        if (!existing)
            return undefined;
        const updates = {};
        if (event.Descripcion !== undefined)
            updates.descripcion = event.Descripcion;
        if (event.FechaInicio !== undefined)
            updates.fecha_inicio = event.FechaInicio;
        if (event.FechaFin !== undefined)
            updates.fecha_fin = event.FechaFin;
        if (event.ClubId !== undefined)
            updates.club_id = event.ClubId;
        await this.getRepository().update({ event_id: id }, updates);
        const updated = await this.getRepository().findOne({ where: { event_id: id } });
        return updated ? this.entityToDto(updated) : undefined;
    }
    /**
     * Elimina un event
     */
    async delete(id) {
        const result = await this.getRepository().delete({ event_id: id });
        return (result.affected || 0) > 0;
    }
    /**
     * Convierte una entidad TypeORM a DTO
     */
    entityToDto(entity) {
        return {
            EventId: entity.event_id,
            Descripcion: entity.descripcion,
            FechaInicio: entity.fecha_inicio,
            FechaFin: entity.fecha_fin,
            ClubId: entity.club_id,
        };
    }
}
exports.EventRepository = EventRepository;
