/**
 * ðŸ—„ï¸ UserEntity Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { UserEntity, CreateUserEntityInput, UpdateUserEntityInput, UserEntityRow } from '../models/userentity.model';
import { dbToDto } from '../../config/database.config';

export class UserEntityRepository {
  
  async getAll(): Promise<UserEntity[]> {
    const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      ORDER BY user_entity_id ASC
    `;
    
    const rows = await queryAll<UserEntityRow>(query);
    return rows.map(row => dbToDto('userentities', row));
  }

  async getById(id: number): Promise<UserEntity | undefined> {
    const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      WHERE user_entity_id = $1
      LIMIT 1
    `;

    const row = await queryOne<UserEntityRow>(query, [id]);
    return row ? dbToDto('userentities', row) : undefined;
  }

  async getByUser(userId: number): Promise<UserEntity[]> {
    const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      WHERE user_id = $1
      ORDER BY user_entity_id ASC
    `;

    const rows = await queryAll<UserEntityRow>(query, [userId]);
    return rows.map(row => dbToDto('userentities', row));
  }

  async getByEntityLink(entityLinkId: number): Promise<UserEntity[]> {
    const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      WHERE entity_link_id = $1
      ORDER BY user_entity_id ASC
    `;

    const rows = await queryAll<UserEntityRow>(query, [entityLinkId]);
    return rows.map(row => dbToDto('userentities', row));
  }

  async getByRole(rolId: number): Promise<UserEntity[]> {
    const query = `
      SELECT user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
      FROM user_entities
      WHERE rol_id = $1
      ORDER BY user_entity_id ASC
    `;

    const rows = await queryAll<UserEntityRow>(query, [rolId]);
    return rows.map(row => dbToDto('userentities', row));
  }

  async create(userEntity: CreateUserEntityInput): Promise<UserEntity> {
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

    const row = await queryOne<UserEntityRow>(query, params);
    if (!row) throw new Error('Failed to create user entity');
    
    return dbToDto('userentities', row);
  }

  async update(id: number, userEntity: UpdateUserEntityInput): Promise<UserEntity | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (userEntity.RolId !== undefined) {
      updates.push(`rol_id = $${paramCount++}`);
      params.push(userEntity.RolId);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE user_entities
      SET ${updates.join(', ')}
      WHERE user_entity_id = $${paramCount}
      RETURNING user_entity_id, user_id, entity_link_id, rol_id, created_at, updated_at
    `;

    const row = await queryOne<UserEntityRow>(query, params);
    return row ? dbToDto('userentities', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM user_entities WHERE user_entity_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM user_entities`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

