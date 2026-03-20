"use strict";
/**
 * ðŸ—„ï¸ Event Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class EventRepository {
    async getAll() {
        const query = `
      SELECT event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
      FROM events
      ORDER BY event_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('events', row));
    }
    async getById(id) {
        const query = `
      SELECT event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
      FROM events
      WHERE event_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('events', row) : undefined;
    }
    async getByClub(clubId) {
        const query = `
      SELECT event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
      FROM events
      WHERE club_id = $1
      ORDER BY event_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [clubId]);
        return rows.map(row => (0, database_config_1.dbToDto)('events', row));
    }
    async create(event) {
        if (!event.Descripcion) {
            throw new Error('Missing required field: Descripcion');
        }
        const query = `
      INSERT INTO events (descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
    `;
        const params = [
            event.Descripcion,
            event.FechaInicio || null,
            event.FechaFin || null,
            event.ClubId || null,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create event');
        return (0, database_config_1.dbToDto)('events', row);
    }
    async update(id, event) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (event.Descripcion !== undefined) {
            updates.push(`descripcion = $${paramCount++}`);
            params.push(event.Descripcion);
        }
        if (event.FechaInicio !== undefined) {
            updates.push(`fecha_inicio = $${paramCount++}`);
            params.push(event.FechaInicio || null);
        }
        if (event.FechaFin !== undefined) {
            updates.push(`fecha_fin = $${paramCount++}`);
            params.push(event.FechaFin || null);
        }
        if (event.ClubId !== undefined) {
            updates.push(`club_id = $${paramCount++}`);
            params.push(event.ClubId || null);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE events
      SET ${updates.join(', ')}
      WHERE event_id = $${paramCount}
      RETURNING event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('events', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM events WHERE event_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM events`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.EventRepository = EventRepository;
