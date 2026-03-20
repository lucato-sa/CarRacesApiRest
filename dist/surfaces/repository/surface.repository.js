"use strict";
/**
 * ðŸ—„ï¸ Surface Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurfaceRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class SurfaceRepository {
    async getAll() {
        const query = `
      SELECT surface_id, alias, descripcion, created_at, updated_at
      FROM surfaces
      ORDER BY surface_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('surfaces', row));
    }
    async getById(id) {
        const query = `
      SELECT surface_id, alias, descripcion, created_at, updated_at
      FROM surfaces
      WHERE surface_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('surfaces', row) : undefined;
    }
    async getByAlias(alias) {
        const query = `
      SELECT surface_id, alias, descripcion, created_at, updated_at
      FROM surfaces
      WHERE alias = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [alias]);
        return row ? (0, database_config_1.dbToDto)('surfaces', row) : undefined;
    }
    async create(surface) {
        if (!surface.Alias) {
            throw new Error('Missing required field: Alias');
        }
        const query = `
      INSERT INTO surfaces (alias, descripcion, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING surface_id, alias, descripcion, created_at, updated_at
    `;
        const params = [
            surface.Alias,
            surface.Descripcion || null,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create surface');
        return (0, database_config_1.dbToDto)('surfaces', row);
    }
    async update(id, surface) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (surface.Alias !== undefined) {
            updates.push(`alias = $${paramCount++}`);
            params.push(surface.Alias);
        }
        if (surface.Descripcion !== undefined) {
            updates.push(`descripcion = $${paramCount++}`);
            params.push(surface.Descripcion || null);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE surfaces
      SET ${updates.join(', ')}
      WHERE surface_id = $${paramCount}
      RETURNING surface_id, alias, descripcion, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('surfaces', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM surfaces WHERE surface_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM surfaces`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.SurfaceRepository = SurfaceRepository;
