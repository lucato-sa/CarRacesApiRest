/**
 * ðŸ—„ï¸ Speciality Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Speciality, CreateSpecialityInput, UpdateSpecialityInput, SpecialityRow } from '../models/speciality.model';
import { dbToDto } from '../../config/database.config';

export class SpecialityRepository {
  
  async getAll(): Promise<Speciality[]> {
    const query = `
      SELECT speciality_id, alias, descripcion, "default", created_at, updated_at
      FROM specialities
      ORDER BY speciality_id ASC
    `;
    
    const rows = await queryAll<SpecialityRow>(query);
    return rows.map(row => dbToDto('specialities', row));
  }

  async getById(id: number): Promise<Speciality | undefined> {
    const query = `
      SELECT speciality_id, alias, descripcion, "default", created_at, updated_at
      FROM specialities
      WHERE speciality_id = $1
      LIMIT 1
    `;

    const row = await queryOne<SpecialityRow>(query, [id]);
    return row ? dbToDto('specialities', row) : undefined;
  }

  async getByAlias(alias: string): Promise<Speciality | undefined> {
    const query = `
      SELECT speciality_id, alias, descripcion, "default", created_at, updated_at
      FROM specialities
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<SpecialityRow>(query, [alias]);
    return row ? dbToDto('specialities', row) : undefined;
  }

  async getDefault(): Promise<Speciality | undefined> {
    const query = `
      SELECT speciality_id, alias, descripcion, "default", created_at, updated_at
      FROM specialities
      WHERE "default" = true
      LIMIT 1
    `;

    const row = await queryOne<SpecialityRow>(query);
    return row ? dbToDto('specialities', row) : undefined;
  }

  async create(speciality: CreateSpecialityInput): Promise<Speciality> {
    if (!speciality.Alias) {
      throw new Error('Missing required field: Alias');
    }

    const query = `
      INSERT INTO specialities (alias, descripcion, "default", created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING speciality_id, alias, descripcion, "default", created_at, updated_at
    `;

    const params = [
      speciality.Alias,
      speciality.Descripcion || null,
      speciality.Default || false,
    ];

    const row = await queryOne<SpecialityRow>(query, params);
    if (!row) throw new Error('Failed to create speciality');
    
    return dbToDto('specialities', row);
  }

  async update(id: number, speciality: UpdateSpecialityInput): Promise<Speciality | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (speciality.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(speciality.Alias);
    }
    if (speciality.Descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      params.push(speciality.Descripcion || null);
    }
    if (speciality.Default !== undefined) {
      updates.push(`"default" = $${paramCount++}`);
      params.push(speciality.Default);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE specialities
      SET ${updates.join(', ')}
      WHERE speciality_id = $${paramCount}
      RETURNING speciality_id, alias, descripcion, "default", created_at, updated_at
    `;

    const row = await queryOne<SpecialityRow>(query, params);
    return row ? dbToDto('specialities', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM specialities WHERE speciality_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM specialities`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

