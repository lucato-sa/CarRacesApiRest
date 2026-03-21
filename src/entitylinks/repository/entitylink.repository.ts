/**
 * ðŸ—„ï¸ EntityLink Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { EntityLink, CreateEntityLinkInput, UpdateEntityLinkInput, EntityLinkRow } from '../models/entitylink.model';
import { dbToDto } from '../../config/database.config';

export class EntityLinkRepository {
  
  async getAll(): Promise<EntityLink[]> {
    const query = `
      SELECT entity_link_id, entity_name, created_at, updated_at
      FROM entity_links
      ORDER BY entity_link_id ASC
    `;
    
    const rows = await queryAll<EntityLinkRow>(query);
    return rows.map(row => dbToDto('entitylinks', row));
  }

  async getById(id: number): Promise<EntityLink | undefined> {
    const query = `
      SELECT entity_link_id, entity_name, created_at, updated_at
      FROM entity_links
      WHERE entity_link_id = $1
      LIMIT 1
    `;

    const row = await queryOne<EntityLinkRow>(query, [id]);
    return row ? dbToDto('entitylinks', row) : undefined;
  }

  async getByEntityName(entityName: string): Promise<EntityLink[]> {
    const query = `
      SELECT entity_link_id, entity_name, created_at, updated_at
      FROM entity_links
      WHERE entity_name = $1
      ORDER BY entity_link_id ASC
    `;

    const rows = await queryAll<EntityLinkRow>(query, [entityName]);
    return rows.map(row => dbToDto('entitylinks', row));
  }

  async create(entityLink: CreateEntityLinkInput): Promise<EntityLink> {
    if (!entityLink.EntityName) {
      throw new Error('Missing required fields: EntityName');
    }

    const query = `
      INSERT INTO entity_links (entity_name, created_at, updated_at)
      VALUES ($1, NOW(), NOW())
      RETURNING entity_link_id, entity_name, created_at, updated_at
    `;

    const params = [
      entityLink.EntityName,
    ];

    const row = await queryOne<EntityLinkRow>(query, params);
    if (!row) throw new Error('Failed to create entity link');
    
    return dbToDto('entitylinks', row);
  }

  async update(id: number, entityLink: UpdateEntityLinkInput): Promise<EntityLink | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (entityLink.EntityName !== undefined) {
      updates.push(`entity_name = $${paramCount++}`);
      params.push(entityLink.EntityName);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE entity_links
      SET ${updates.join(', ')}
      WHERE entity_link_id = $${paramCount}
      RETURNING entity_link_id, entity_name, created_at, updated_at
    `;

    const row = await queryOne<EntityLinkRow>(query, params);
    return row ? dbToDto('entitylinks', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM entity_links WHERE entity_link_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM entity_links`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

