"use strict";
/**
 * ðŸ—„ï¸ EntityLink Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityLinkRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class EntityLinkRepository {
    async getAll() {
        const query = `
      SELECT entity_link_id, entity_name, entity_id, created_at, updated_at
      FROM entity_links
      ORDER BY entity_link_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('entitylinks', row));
    }
    async getById(id) {
        const query = `
      SELECT entity_link_id, entity_name, entity_id, created_at, updated_at
      FROM entity_links
      WHERE entity_link_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('entitylinks', row) : undefined;
    }
    async getByEntity(entityName, entityId) {
        const query = `
      SELECT entity_link_id, entity_name, entity_id, created_at, updated_at
      FROM entity_links
      WHERE entity_name = $1 AND entity_id = $2
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [entityName, entityId]);
        return row ? (0, database_config_1.dbToDto)('entitylinks', row) : undefined;
    }
    async getByEntityName(entityName) {
        const query = `
      SELECT entity_link_id, entity_name, entity_id, created_at, updated_at
      FROM entity_links
      WHERE entity_name = $1
      ORDER BY entity_link_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [entityName]);
        return rows.map(row => (0, database_config_1.dbToDto)('entitylinks', row));
    }
    async create(entityLink) {
        if (!entityLink.EntityName || !entityLink.EntityId) {
            throw new Error('Missing required fields: EntityName, EntityId');
        }
        const query = `
      INSERT INTO entity_links (entity_name, entity_id, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING entity_link_id, entity_name, entity_id, created_at, updated_at
    `;
        const params = [
            entityLink.EntityName,
            entityLink.EntityId,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create entity link');
        return (0, database_config_1.dbToDto)('entitylinks', row);
    }
    async update(id, entityLink) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (entityLink.EntityName !== undefined) {
            updates.push(`entity_name = $${paramCount++}`);
            params.push(entityLink.EntityName);
        }
        if (entityLink.EntityId !== undefined) {
            updates.push(`entity_id = $${paramCount++}`);
            params.push(entityLink.EntityId);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE entity_links
      SET ${updates.join(', ')}
      WHERE entity_link_id = $${paramCount}
      RETURNING entity_link_id, entity_name, entity_id, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('entitylinks', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM entity_links WHERE entity_link_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM entity_links`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.EntityLinkRepository = EntityLinkRepository;
