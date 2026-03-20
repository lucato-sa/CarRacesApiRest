"use strict";
/**
 * ðŸ—„ï¸ Division Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class DivisionRepository {
    async getAll() {
        const query = `
      SELECT division_id, discipline_id, alias, descripcion, created_at, updated_at
      FROM divisions
      ORDER BY division_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('divisions', row));
    }
    async getById(id) {
        const query = `
      SELECT division_id, discipline_id, alias, descripcion, created_at, updated_at
      FROM divisions
      WHERE division_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('divisions', row) : undefined;
    }
    async getByAlias(alias) {
        const query = `
      SELECT division_id, discipline_id, alias, descripcion, created_at, updated_at
      FROM divisions
      WHERE alias = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [alias]);
        return row ? (0, database_config_1.dbToDto)('divisions', row) : undefined;
    }
    async getByDiscipline(disciplineId) {
        const query = `
      SELECT division_id, discipline_id, alias, descripcion, created_at, updated_at
      FROM divisions
      WHERE discipline_id = $1
      ORDER BY division_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [disciplineId]);
        return rows.map(row => (0, database_config_1.dbToDto)('divisions', row));
    }
    async create(division) {
        if (!division.Alias) {
            throw new Error('Missing required field: Alias');
        }
        const query = `
      INSERT INTO divisions (discipline_id, alias, descripcion, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING division_id, discipline_id, alias, descripcion, created_at, updated_at
    `;
        const params = [
            division.DisciplineId || null,
            division.Alias,
            division.Descripcion || null,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create division');
        return (0, database_config_1.dbToDto)('divisions', row);
    }
    async update(id, division) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (division.Alias !== undefined) {
            updates.push(`alias = $${paramCount++}`);
            params.push(division.Alias);
        }
        if (division.Descripcion !== undefined) {
            updates.push(`descripcion = $${paramCount++}`);
            params.push(division.Descripcion || null);
        }
        if (division.DisciplineId !== undefined) {
            updates.push(`discipline_id = $${paramCount++}`);
            params.push(division.DisciplineId || null);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE divisions
      SET ${updates.join(', ')}
      WHERE division_id = $${paramCount}
      RETURNING division_id, discipline_id, alias, descripcion, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('divisions', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM divisions WHERE division_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM divisions`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.DivisionRepository = DivisionRepository;
