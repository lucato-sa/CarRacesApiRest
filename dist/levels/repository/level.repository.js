"use strict";
/**
 * 🗄️ Level Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class LevelRepository {
    async getAll() {
        const query = `
      SELECT level_id, descripcion, created_at, updated_at
      FROM levels
      ORDER BY level_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('levels', row));
    }
    async getById(id) {
        const query = `
      SELECT level_id, descripcion, created_at, updated_at
      FROM levels
      WHERE level_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('levels', row) : undefined;
    }
    async create(level) {
        if (!level.Descripcion) {
            throw new Error('Missing required field: Descripcion');
        }
        const query = `
      INSERT INTO levels (descripcion, created_at, updated_at)
      VALUES ($1, NOW(), NOW())
      RETURNING level_id, descripcion, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, [level.Descripcion]);
        return row ? (0, database_config_1.dbToDto)('levels', row) : {};
    }
    async update(id, level) {
        const setClauses = [];
        const params = [];
        let paramCount = 1;
        if (level.Descripcion !== undefined) {
            setClauses.push(`descripcion = $${paramCount++}`);
            params.push(level.Descripcion);
        }
        setClauses.push(`updated_at = $${paramCount++}`);
        params.push(new Date());
        params.push(id);
        const query = `
      UPDATE levels
      SET ${setClauses.join(', ')}
      WHERE level_id = $${paramCount}
      RETURNING level_id, descripcion, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('levels', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM levels WHERE level_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return result.rowCount > 0;
    }
}
exports.LevelRepository = LevelRepository;
