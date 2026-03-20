"use strict";
/**
 * ðŸ—„ï¸ Registration Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class RegistrationRepository {
    async getAll() {
        const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      ORDER BY registration_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('registrations', row));
    }
    async getById(id) {
        const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      WHERE registration_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('registrations', row) : undefined;
    }
    async getByCompetition(competitionId) {
        const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      WHERE competition_id = $1
      ORDER BY registration_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [competitionId]);
        return rows.map(row => (0, database_config_1.dbToDto)('registrations', row));
    }
    async getByUser(userId) {
        const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      WHERE user_id = $1
      ORDER BY registration_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [userId]);
        return rows.map(row => (0, database_config_1.dbToDto)('registrations', row));
    }
    async getByCompetitionAndUser(competitionId, userId) {
        const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      WHERE competition_id = $1 AND user_id = $2
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [competitionId, userId]);
        return row ? (0, database_config_1.dbToDto)('registrations', row) : undefined;
    }
    async create(registration) {
        if (!registration.CompetitionId || !registration.UserId) {
            throw new Error('Missing required fields: CompetitionId, UserId');
        }
        const query = `
      INSERT INTO registrations (competition_id, user_id, fecha_registro, estado, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
    `;
        const params = [
            registration.CompetitionId,
            registration.UserId,
            registration.FechaRegistro || new Date().toISOString().split('T')[0],
            registration.Estado || 'ACTIVE',
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create registration');
        return (0, database_config_1.dbToDto)('registrations', row);
    }
    async update(id, registration) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (registration.Estado !== undefined) {
            updates.push(`estado = $${paramCount++}`);
            params.push(registration.Estado);
        }
        if (registration.FechaRegistro !== undefined) {
            updates.push(`fecha_registro = $${paramCount++}`);
            params.push(registration.FechaRegistro);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE registrations
      SET ${updates.join(', ')}
      WHERE registration_id = $${paramCount}
      RETURNING registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('registrations', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM registrations WHERE registration_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM registrations`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.RegistrationRepository = RegistrationRepository;
