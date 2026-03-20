"use strict";
/**
 * ðŸ—„ï¸ Role Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class RoleRepository {
    async getAll() {
        const query = `
      SELECT rol_id, nombre, pseudonimo, created_at, updated_at
      FROM roles
      ORDER BY rol_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('roles', row));
    }
    async getById(id) {
        const query = `
      SELECT rol_id, nombre, pseudonimo, created_at, updated_at
      FROM roles
      WHERE rol_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('roles', row) : undefined;
    }
    async getByNombre(nombre) {
        const query = `
      SELECT rol_id, nombre, pseudonimo, created_at, updated_at
      FROM roles
      WHERE nombre = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [nombre]);
        return row ? (0, database_config_1.dbToDto)('roles', row) : undefined;
    }
    async create(role) {
        if (!role.Nombre) {
            throw new Error('Missing required field: Nombre');
        }
        const query = `
      INSERT INTO roles (nombre, pseudonimo, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING rol_id, nombre, pseudonimo, created_at, updated_at
    `;
        const params = [
            role.Nombre,
            role.Pseudonimo || null,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create role');
        return (0, database_config_1.dbToDto)('roles', row);
    }
    async update(id, role) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (role.Nombre !== undefined) {
            updates.push(`nombre = $${paramCount++}`);
            params.push(role.Nombre);
        }
        if (role.Pseudonimo !== undefined) {
            updates.push(`pseudonimo = $${paramCount++}`);
            params.push(role.Pseudonimo || null);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE roles
      SET ${updates.join(', ')}
      WHERE rol_id = $${paramCount}
      RETURNING rol_id, nombre, pseudonimo, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('roles', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM roles WHERE rol_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM roles`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.RoleRepository = RoleRepository;
