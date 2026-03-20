/**
 * ðŸ—„ï¸ Format Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Format, CreateFormatInput, UpdateFormatInput, FormatRow } from '../models/format.model';
import { dbToDto } from '../../config/database.config';

export class FormatRepository {
  
  async getAll(): Promise<Format[]> {
    const query = `
      SELECT format_id, alias, descripcion, created_at, updated_at
      FROM formats
      ORDER BY format_id ASC
    `;
    
    const rows = await queryAll<FormatRow>(query);
    return rows.map(row => dbToDto('formats', row));
  }

  async getById(id: number): Promise<Format | undefined> {
    const query = `
      SELECT format_id, alias, descripcion, created_at, updated_at
      FROM formats
      WHERE format_id = $1
      LIMIT 1
    `;

    const row = await queryOne<FormatRow>(query, [id]);
    return row ? dbToDto('formats', row) : undefined;
  }

  async getByAlias(alias: string): Promise<Format | undefined> {
    const query = `
      SELECT format_id, alias, descripcion, created_at, updated_at
      FROM formats
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<FormatRow>(query, [alias]);
    return row ? dbToDto('formats', row) : undefined;
  }

  async create(format: CreateFormatInput): Promise<Format> {
    if (!format.Alias) {
      throw new Error('Missing required field: Alias');
    }

    const query = `
      INSERT INTO formats (alias, descripcion, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING format_id, alias, descripcion, created_at, updated_at
    `;

    const params = [
      format.Alias,
      format.Descripcion || null,
    ];

    const row = await queryOne<FormatRow>(query, params);
    if (!row) throw new Error('Failed to create format');
    
    return dbToDto('formats', row);
  }

  async update(id: number, format: UpdateFormatInput): Promise<Format | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (format.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(format.Alias);
    }
    if (format.Descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      params.push(format.Descripcion || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE formats
      SET ${updates.join(', ')}
      WHERE format_id = $${paramCount}
      RETURNING format_id, alias, descripcion, created_at, updated_at
    `;

    const row = await queryOne<FormatRow>(query, params);
    return row ? dbToDto('formats', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM formats WHERE format_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM formats`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

