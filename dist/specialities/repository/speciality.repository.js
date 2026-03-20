"use strict";
/**
 * ðŸ—„ï¸ Speciality Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialityRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class SpecialityRepository {
    async getAll() {
        const query = `
      SELECT speciality_id, alias, descripcion, "default", created_at, updated_at
      FROM specialities
      ORDER BY speciality_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('specialities', row));
    }
    async getById(id) {
        const query = `
      SELECT speciality_id, alias, descripcion, "default", created_at, updated_at
      FROM specialities
      WHERE speciality_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('specialities', row) : undefined;
    }
    async getByAlias(alias) {
        const query = `
      SELECT speciality_id, alias, descripcion, "default", created_at, updated_at
      FROM specialities
      WHERE alias = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [alias]);
        return row ? (0, database_config_1.dbToDto)('specialities', row) : undefined;
    }
    async getDefault() {
        const query = `
      SELECT speciality_id, alias, descripcion, "default", created_at, updated_at
      FROM specialities
      WHERE "default" = true
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? (0, database_config_1.dbToDto)('specialities', row) : undefined;
    }
    async create(speciality) {
        if (!speciality.Alias) {
            throw new Error('Missing required field: Alias');
        }
        const query = `
      INSERT INTO specialities (alias, descripcion, "default", created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING speciality_id, alias, descripcion, "default", created_at, updated_at
    `;
        const params = [
            speciality.Alias,
            speciality.Descripcion || null,
            speciality.Default || false,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create speciality');
        return (0, database_config_1.dbToDto)('specialities', row);
    }
    async update(id, speciality) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (speciality.Alias !== undefined) {
            updates.push(`alias = $${paramCount++}`);
            params.push(speciality.Alias);
        }
        if (speciality.Descripcion !== undefined) {
            updates.push(`descripcion = $${paramCount++}`);
            params.push(speciality.Descripcion || null);
        }
        if (speciality.Default !== undefined) {
            updates.push(`"default" = $${paramCount++}`);
            params.push(speciality.Default);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE specialities
      SET ${updates.join(', ')}
      WHERE speciality_id = $${paramCount}
      RETURNING speciality_id, alias, descripcion, "default", created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('specialities', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM specialities WHERE speciality_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM specialities`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.SpecialityRepository = SpecialityRepository;
