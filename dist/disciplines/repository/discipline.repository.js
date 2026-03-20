"use strict";
/**
 * ðŸ—„ï¸ Discipline Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplineRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class DisciplineRepository {
    async getAll() {
        const query = `
      SELECT discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
      FROM disciplines
      ORDER BY discipline_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('disciplines', row));
    }
    async getById(id) {
        const query = `
      SELECT discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
      FROM disciplines
      WHERE discipline_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('disciplines', row) : undefined;
    }
    async getByAlias(alias) {
        const query = `
      SELECT discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
      FROM disciplines
      WHERE alias = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [alias]);
        return row ? (0, database_config_1.dbToDto)('disciplines', row) : undefined;
    }
    async create(discipline) {
        if (!discipline.Alias) {
            throw new Error('Missing required field: Alias');
        }
        const query = `
      INSERT INTO disciplines (speciality_id, format_id, surface_id, alias, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
    `;
        const params = [
            discipline.SpecialityId || null,
            discipline.FormatId || null,
            discipline.SurfaceId || null,
            discipline.Alias,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create discipline');
        return (0, database_config_1.dbToDto)('disciplines', row);
    }
    async update(id, discipline) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (discipline.Alias !== undefined) {
            updates.push(`alias = $${paramCount++}`);
            params.push(discipline.Alias);
        }
        if (discipline.SpecialityId !== undefined) {
            updates.push(`speciality_id = $${paramCount++}`);
            params.push(discipline.SpecialityId || null);
        }
        if (discipline.FormatId !== undefined) {
            updates.push(`format_id = $${paramCount++}`);
            params.push(discipline.FormatId || null);
        }
        if (discipline.SurfaceId !== undefined) {
            updates.push(`surface_id = $${paramCount++}`);
            params.push(discipline.SurfaceId || null);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE disciplines
      SET ${updates.join(', ')}
      WHERE discipline_id = $${paramCount}
      RETURNING discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('disciplines', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM disciplines WHERE discipline_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM disciplines`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.DisciplineRepository = DisciplineRepository;
