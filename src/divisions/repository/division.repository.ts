/**
 * ðŸ—„ï¸ Division Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Division, CreateDivisionInput, UpdateDivisionInput, DivisionRow } from '../models/division.model';
import { dbToDto } from '../../config/database.config';

export class DivisionRepository {
  
  async getAll(): Promise<Division[]> {
    const query = `
      SELECT division_id, discipline_id, alias, descripcion, created_at, updated_at
      FROM divisions
      ORDER BY division_id ASC
    `;
    
    const rows = await queryAll<DivisionRow>(query);
    return rows.map(row => dbToDto('divisions', row));
  }

  async getById(id: number): Promise<Division | undefined> {
    const query = `
      SELECT division_id, discipline_id, alias, descripcion, created_at, updated_at
      FROM divisions
      WHERE division_id = $1
      LIMIT 1
    `;

    const row = await queryOne<DivisionRow>(query, [id]);
    return row ? dbToDto('divisions', row) : undefined;
  }

  async getByAlias(alias: string): Promise<Division | undefined> {
    const query = `
      SELECT division_id, discipline_id, alias, descripcion, created_at, updated_at
      FROM divisions
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<DivisionRow>(query, [alias]);
    return row ? dbToDto('divisions', row) : undefined;
  }

  async getByDiscipline(disciplineId: number): Promise<Division[]> {
    const query = `
      SELECT division_id, discipline_id, alias, descripcion, created_at, updated_at
      FROM divisions
      WHERE discipline_id = $1
      ORDER BY division_id ASC
    `;

    const rows = await queryAll<DivisionRow>(query, [disciplineId]);
    return rows.map(row => dbToDto('divisions', row));
  }

  async create(division: CreateDivisionInput): Promise<Division> {
    if (!division.Alias) {
      throw new Error('Missing required field: Alias');
    }

    const query = `
      INSERT INTO divisions (discipline_id, alias, descripcion, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING division_id, discipline_id, alias, descripcion, created_at, updated_at
    `;

    const params = [
      division.DisciplineId || null,
      division.Alias,
      division.Descripcion || null,
    ];

    const row = await queryOne<DivisionRow>(query, params);
    if (!row) throw new Error('Failed to create division');
    
    return dbToDto('divisions', row);
  }

  async update(id: number, division: UpdateDivisionInput): Promise<Division | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (division.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(division.Alias);
    }
    if (division.Descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      params.push(division.Descripcion || null);
    }
    if (division.DisciplineId !== undefined) {
      updates.push(`discipline_id = $${paramCount++}`);
      params.push(division.DisciplineId || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE divisions
      SET ${updates.join(', ')}
      WHERE division_id = $${paramCount}
      RETURNING division_id, discipline_id, alias, descripcion, created_at, updated_at
    `;

    const row = await queryOne<DivisionRow>(query, params);
    return row ? dbToDto('divisions', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM divisions WHERE division_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM divisions`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

