"use strict";
/**
 * ðŸ—„ï¸ UserEntity Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntityRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class UserEntityRepository {
    async getAll() {
        const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      ORDER BY user_entity_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('userentities', row));
    }
    async getById(id) {
        const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      WHERE user_entity_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('userentities', row) : undefined;
    }
    async getByUser(userId) {
        const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      WHERE user_id = $1
      ORDER BY user_entity_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [userId]);
        return rows.map(row => (0, database_config_1.dbToDto)('userentities', row));
    }
    async getByEntityLink(entityLinkId) {
        const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      WHERE entity_link_id = $1
      ORDER BY user_entity_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [entityLinkId]);
        return rows.map(row => (0, database_config_1.dbToDto)('userentities', row));
    }
    async getByRole(rolId) {
        const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      WHERE rol_id = $1
      ORDER BY user_entity_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [rolId]);
        return rows.map(row => (0, database_config_1.dbToDto)('userentities', row));
    }
    async create(userEntity) {
        if (!userEntity.UserId || !userEntity.EntityLinkId || !userEntity.RolId) {
            throw new Error('Missing required fields: UserId, EntityLinkId, RolId');
        }
        const query = `
      INSERT INTO user_entities (user_id, entity_link_id, rol_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
    `;
        const params = [
            userEntity.UserId,
            userEntity.EntityLinkId,
            userEntity.RolId,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create user entity');
        return (0, database_config_1.dbToDto)('userentities', row);
    }
    async update(id, userEntity) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (userEntity.RolId !== undefined) {
            updates.push(`rol_id = $${paramCount++}`);
            params.push(userEntity.RolId);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE user_entities
      SET ${updates.join(', ')}
      WHERE user_entity_id = $${paramCount}
      RETURNING user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('userentities', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM user_entities WHERE user_entity_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM user_entities`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.UserEntityRepository = UserEntityRepository;
