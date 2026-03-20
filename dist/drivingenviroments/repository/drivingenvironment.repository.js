"use strict";
/**
 * ðŸ—„ï¸ DrivingEnvironment Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrivingEnvironmentRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class DrivingEnvironmentRepository {
    async getAll() {
        const query = `
      SELECT driving_environment_id, alias, descripcion, "default", created_at, updated_at
      FROM driving_environments
      ORDER BY driving_environment_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('drivingenvironments', row));
    }
    async getById(id) {
        const query = `
      SELECT driving_environment_id, alias, descripcion, "default", created_at, updated_at
      FROM driving_environments
      WHERE driving_environment_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('drivingenvironments', row) : undefined;
    }
    async getByAlias(alias) {
        const query = `
      SELECT driving_environment_id, alias, descripcion, "default", created_at, updated_at
      FROM driving_environments
      WHERE alias = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [alias]);
        return row ? (0, database_config_1.dbToDto)('drivingenvironments', row) : undefined;
    }
    async getDefault() {
        const query = `
      SELECT driving_environment_id, alias, descripcion, "default", created_at, updated_at
      FROM driving_environments
      WHERE "default" = true
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? (0, database_config_1.dbToDto)('drivingenvironments', row) : undefined;
    }
    async create(drivingEnvironment) {
        if (!drivingEnvironment.Alias) {
            throw new Error('Missing required field: Alias');
        }
        const query = `
      INSERT INTO driving_environments (alias, descripcion, "default", created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING driving_environment_id, alias, descripcion, "default", created_at, updated_at
    `;
        const params = [
            drivingEnvironment.Alias,
            drivingEnvironment.Descripcion || null,
            drivingEnvironment.Default || false,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create driving environment');
        return (0, database_config_1.dbToDto)('drivingenvironments', row);
    }
    async update(id, drivingEnvironment) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (drivingEnvironment.Alias !== undefined) {
            updates.push(`alias = $${paramCount++}`);
            params.push(drivingEnvironment.Alias);
        }
        if (drivingEnvironment.Descripcion !== undefined) {
            updates.push(`descripcion = $${paramCount++}`);
            params.push(drivingEnvironment.Descripcion || null);
        }
        if (drivingEnvironment.Default !== undefined) {
            updates.push(`"default" = $${paramCount++}`);
            params.push(drivingEnvironment.Default);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE driving_environments
      SET ${updates.join(', ')}
      WHERE driving_environment_id = $${paramCount}
      RETURNING driving_environment_id, alias, descripcion, "default", created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('drivingenvironments', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM driving_environments WHERE driving_environment_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM driving_environments`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.DrivingEnvironmentRepository = DrivingEnvironmentRepository;
