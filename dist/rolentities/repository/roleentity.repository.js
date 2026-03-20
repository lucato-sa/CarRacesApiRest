"use strict";
/**
 * ðŸ—„ï¸ RoleEntity Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleEntityRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class RoleEntityRepository {
    async getAll() {
        const query = `
      SELECT rol_entity_id, entity_link_id, rol_id, created_at, updated_at
      FROM rol_entities
      ORDER BY rol_entity_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('rolentities', row));
    }
    async getById(id) {
        const query = `
      SELECT rol_entity_id, entity_link_id, rol_id, created_at, updated_at
      FROM rol_entities
      WHERE rol_entity_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('rolentities', row) : undefined;
    }
    async getByEntityLink(entityLinkId) {
        const query = `
      SELECT rol_entity_id, entity_link_id, rol_id, created_at, updated_at
      FROM rol_entities
      WHERE entity_link_id = $1
      ORDER BY rol_entity_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [entityLinkId]);
        return rows.map(row => (0, database_config_1.dbToDto)('rolentities', row));
    }
    async getByRole(rolId) {
        const query = `
      SELECT rol_entity_id, entity_link_id, rol_id, created_at, updated_at
      FROM rol_entities
      WHERE rol_id = $1
      ORDER BY rol_entity_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [rolId]);
        return rows.map(row => (0, database_config_1.dbToDto)('rolentities', row));
    }
    async create(roleEntity) {
        if (!roleEntity.EntityLinkId || !roleEntity.RolId) {
            throw new Error('Missing required fields: EntityLinkId, RolId');
        }
        const query = `
      INSERT INTO rol_entities (entity_link_id, rol_id, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING rol_entity_id, entity_link_id, rol_id, created_at, updated_at
    `;
        const params = [
            roleEntity.EntityLinkId,
            roleEntity.RolId,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create role entity');
        return (0, database_config_1.dbToDto)('rolentities', row);
    }
    async update(id, roleEntity) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (roleEntity.EntityLinkId !== undefined) {
            updates.push(`entity_link_id = $${paramCount++}`);
            params.push(roleEntity.EntityLinkId);
        }
        if (roleEntity.RolId !== undefined) {
            updates.push(`rol_id = $${paramCount++}`);
            params.push(roleEntity.RolId);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE rol_entities
      SET ${updates.join(', ')}
      WHERE rol_entity_id = $${paramCount}
      RETURNING rol_entity_id, entity_link_id, rol_id, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('rolentities', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM rol_entities WHERE rol_entity_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM rol_entities`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.RoleEntityRepository = RoleEntityRepository;
