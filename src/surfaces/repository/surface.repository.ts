/**
 * ðŸ—„ï¸ Surface Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Surface, CreateSurfaceInput, UpdateSurfaceInput, SurfaceRow } from '../models/surface.model';
import { dbToDto } from '../../config/database.config';

export class SurfaceRepository {
  
  async getAll(): Promise<Surface[]> {
    const query = `
      SELECT surface_id, alias, descripcion, created_at, updated_at
      FROM surfaces
      ORDER BY surface_id ASC
    `;
    
    const rows = await queryAll<SurfaceRow>(query);
    return rows.map(row => dbToDto('surfaces', row));
  }

  async getById(id: number): Promise<Surface | undefined> {
    const query = `
      SELECT surface_id, alias, descripcion, created_at, updated_at
      FROM surfaces
      WHERE surface_id = $1
      LIMIT 1
    `;

    const row = await queryOne<SurfaceRow>(query, [id]);
    return row ? dbToDto('surfaces', row) : undefined;
  }

  async getByAlias(alias: string): Promise<Surface | undefined> {
    const query = `
      SELECT surface_id, alias, descripcion, created_at, updated_at
      FROM surfaces
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<SurfaceRow>(query, [alias]);
    return row ? dbToDto('surfaces', row) : undefined;
  }

  async create(surface: CreateSurfaceInput): Promise<Surface> {
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

    const row = await queryOne<SurfaceRow>(query, params);
    if (!row) throw new Error('Failed to create surface');
    
    return dbToDto('surfaces', row);
  }

  async update(id: number, surface: UpdateSurfaceInput): Promise<Surface | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (surface.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(surface.Alias);
    }
    if (surface.Descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      params.push(surface.Descripcion || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE surfaces
      SET ${updates.join(', ')}
      WHERE surface_id = $${paramCount}
      RETURNING surface_id, alias, descripcion, created_at, updated_at
    `;

    const row = await queryOne<SurfaceRow>(query, params);
    return row ? dbToDto('surfaces', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM surfaces WHERE surface_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM surfaces`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

