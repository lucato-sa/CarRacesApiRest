/**
 * 🗄️ Level Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Level, CreateLevelInput, UpdateLevelInput, LevelRow } from '../models/level.model';
import { dbToDto } from '../../config/database.config';

export class LevelRepository {
  
  async getAll(): Promise<Level[]> {
    const query = `
      SELECT level_id, descripcion, created_at, updated_at
      FROM levels
      ORDER BY level_id ASC
    `;
    
    const rows = await queryAll<LevelRow>(query);
    return rows.map(row => dbToDto('levels', row));
  }

  async getById(id: number): Promise<Level | undefined> {
    const query = `
      SELECT level_id, descripcion, created_at, updated_at
      FROM levels
      WHERE level_id = $1
      LIMIT 1
    `;

    const row = await queryOne<LevelRow>(query, [id]);
    return row ? dbToDto('levels', row) : undefined;
  }

  async create(level: CreateLevelInput): Promise<Level> {
    if (!level.Descripcion) {
      throw new Error('Missing required field: Descripcion');
    }

    const query = `
      INSERT INTO levels (descripcion, created_at, updated_at)
      VALUES ($1, NOW(), NOW())
      RETURNING level_id, descripcion, created_at, updated_at
    `;

    const row = await queryOne<LevelRow>(query, [level.Descripcion]);
    return row ? dbToDto('levels', row) : ({} as Level);
  }

  async update(id: number, level: UpdateLevelInput): Promise<Level | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (level.Descripcion !== undefined) {
      setClauses.push(`descripcion = $${paramCount++}`);
      params.push(level.Descripcion);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());
    params.push(id);

    const query = `
      UPDATE levels
      SET ${setClauses.join(', ')}
      WHERE level_id = $${paramCount}
      RETURNING level_id, descripcion, created_at, updated_at
    `;

    const row = await queryOne<LevelRow>(query, params);
    return row ? dbToDto('levels', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM levels WHERE level_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
