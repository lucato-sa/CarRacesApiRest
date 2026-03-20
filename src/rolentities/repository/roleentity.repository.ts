/**
 * ðŸ—„ï¸ RoleEntity Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { RoleEntity, CreateRoleEntityInput, UpdateRoleEntityInput, RoleEntityRow } from '../models/roleentity.model';
import { dbToDto } from '../../config/database.config';

export class RoleEntityRepository {
  
  async getAll(): Promise<RoleEntity[]> {
    const query = `
      SELECT rol_entity_id, entity_link_id, rol_id, created_at, updated_at
      FROM rol_entities
      ORDER BY rol_entity_id ASC
    `;
    
    const rows = await queryAll<RoleEntityRow>(query);
    return rows.map(row => dbToDto('rolentities', row));
  }

  async getById(id: number): Promise<RoleEntity | undefined> {
    const query = `
      SELECT rol_entity_id, entity_link_id, rol_id, created_at, updated_at
      FROM rol_entities
      WHERE rol_entity_id = $1
      LIMIT 1
    `;

    const row = await queryOne<RoleEntityRow>(query, [id]);
    return row ? dbToDto('rolentities', row) : undefined;
  }

  async getByEntityLink(entityLinkId: number): Promise<RoleEntity[]> {
    const query = `
      SELECT rol_entity_id, entity_link_id, rol_id, created_at, updated_at
      FROM rol_entities
      WHERE entity_link_id = $1
      ORDER BY rol_entity_id ASC
    `;

    const rows = await queryAll<RoleEntityRow>(query, [entityLinkId]);
    return rows.map(row => dbToDto('rolentities', row));
  }

  async getByRole(rolId: number): Promise<RoleEntity[]> {
    const query = `
      SELECT rol_entity_id, entity_link_id, rol_id, created_at, updated_at
      FROM rol_entities
      WHERE rol_id = $1
      ORDER BY rol_entity_id ASC
    `;

    const rows = await queryAll<RoleEntityRow>(query, [rolId]);
    return rows.map(row => dbToDto('rolentities', row));
  }

  async create(roleEntity: CreateRoleEntityInput): Promise<RoleEntity> {
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

    const row = await queryOne<RoleEntityRow>(query, params);
    if (!row) throw new Error('Failed to create role entity');
    
    return dbToDto('rolentities', row);
  }

  async update(id: number, roleEntity: UpdateRoleEntityInput): Promise<RoleEntity | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (roleEntity.EntityLinkId !== undefined) {
      updates.push(`entity_link_id = $${paramCount++}`);
      params.push(roleEntity.EntityLinkId);
    }
    if (roleEntity.RolId !== undefined) {
      updates.push(`rol_id = $${paramCount++}`);
      params.push(roleEntity.RolId);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE rol_entities
      SET ${updates.join(', ')}
      WHERE rol_entity_id = $${paramCount}
      RETURNING rol_entity_id, entity_link_id, rol_id, created_at, updated_at
    `;

    const row = await queryOne<RoleEntityRow>(query, params);
    return row ? dbToDto('rolentities', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM rol_entities WHERE rol_entity_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM rol_entities`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

