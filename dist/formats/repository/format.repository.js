"use strict";
/**
 * ðŸ—„ï¸ Format Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class FormatRepository {
    async getAll() {
        const query = `
      SELECT format_id, alias, descripcion, created_at, updated_at
      FROM formats
      ORDER BY format_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('formats', row));
    }
    async getById(id) {
        const query = `
      SELECT format_id, alias, descripcion, created_at, updated_at
      FROM formats
      WHERE format_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('formats', row) : undefined;
    }
    async getByAlias(alias) {
        const query = `
      SELECT format_id, alias, descripcion, created_at, updated_at
      FROM formats
      WHERE alias = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [alias]);
        return row ? (0, database_config_1.dbToDto)('formats', row) : undefined;
    }
    async create(format) {
        if (!format.Alias) {
            throw new Error('Missing required field: Alias');
        }
        const query = `
      INSERT INTO formats (alias, descripcion, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING format_id, alias, descripcion, created_at, updated_at
    `;
        const params = [
            format.Alias,
            format.Descripcion || null,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create format');
        return (0, database_config_1.dbToDto)('formats', row);
    }
    async update(id, format) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (format.Alias !== undefined) {
            updates.push(`alias = $${paramCount++}`);
            params.push(format.Alias);
        }
        if (format.Descripcion !== undefined) {
            updates.push(`descripcion = $${paramCount++}`);
            params.push(format.Descripcion || null);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE formats
      SET ${updates.join(', ')}
      WHERE format_id = $${paramCount}
      RETURNING format_id, alias, descripcion, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('formats', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM formats WHERE format_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM formats`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.FormatRepository = FormatRepository;
