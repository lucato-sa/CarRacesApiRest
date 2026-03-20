/**
 * ðŸ—„ï¸ Discipline Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Discipline, CreateDisciplineInput, UpdateDisciplineInput, DisciplineRow } from '../models/discipline.model';
import { dbToDto } from '../../config/database.config';

export class DisciplineRepository {
  
  async getAll(): Promise<Discipline[]> {
    const query = `
      SELECT discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
      FROM disciplines
      ORDER BY discipline_id ASC
    `;
    
    const rows = await queryAll<DisciplineRow>(query);
    return rows.map(row => dbToDto('disciplines', row));
  }

  async getById(id: number): Promise<Discipline | undefined> {
    const query = `
      SELECT discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
      FROM disciplines
      WHERE discipline_id = $1
      LIMIT 1
    `;

    const row = await queryOne<DisciplineRow>(query, [id]);
    return row ? dbToDto('disciplines', row) : undefined;
  }

  async getByAlias(alias: string): Promise<Discipline | undefined> {
    const query = `
      SELECT discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
      FROM disciplines
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<DisciplineRow>(query, [alias]);
    return row ? dbToDto('disciplines', row) : undefined;
  }

  async create(discipline: CreateDisciplineInput): Promise<Discipline> {
    if (!discipline.Alias) {
      throw new Error('Missing required field: Alias');
    }

    const query = `
      INSERT INTO disciplines (speciality_id, format_id, surface_id, alias, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
    `;

    const params = [
      discipline.SpecialityId || null,
      discipline.FormatId || null,
      discipline.SurfaceId || null,
      discipline.Alias,
    ];

    const row = await queryOne<DisciplineRow>(query, params);
    if (!row) throw new Error('Failed to create discipline');
    
    return dbToDto('disciplines', row);
  }

  async update(id: number, discipline: UpdateDisciplineInput): Promise<Discipline | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (discipline.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(discipline.Alias);
    }
    if (discipline.SpecialityId !== undefined) {
      updates.push(`speciality_id = $${paramCount++}`);
      params.push(discipline.SpecialityId || null);
    }
    if (discipline.FormatId !== undefined) {
      updates.push(`format_id = $${paramCount++}`);
      params.push(discipline.FormatId || null);
    }
    if (discipline.SurfaceId !== undefined) {
      updates.push(`surface_id = $${paramCount++}`);
      params.push(discipline.SurfaceId || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE disciplines
      SET ${updates.join(', ')}
      WHERE discipline_id = $${paramCount}
      RETURNING discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at
    `;

    const row = await queryOne<DisciplineRow>(query, params);
    return row ? dbToDto('disciplines', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM disciplines WHERE discipline_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM disciplines`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

