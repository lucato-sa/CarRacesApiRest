/**
 * ðŸ—„ï¸ DrivingEnvironment Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { DrivingEnvironment, CreateDrivingEnvironmentInput, UpdateDrivingEnvironmentInput, DrivingEnvironmentRow } from '../models/drivingenvironment.model';
import { dbToDto } from '../../config/database.config';

export class DrivingEnvironmentRepository {
  
  async getAll(): Promise<DrivingEnvironment[]> {
    const query = `
      SELECT driving_environment_id, alias, descripcion, "default", created_at, updated_at
      FROM driving_environments
      ORDER BY driving_environment_id ASC
    `;
    
    const rows = await queryAll<DrivingEnvironmentRow>(query);
    return rows.map(row => dbToDto('drivingenvironments', row));
  }

  async getById(id: number): Promise<DrivingEnvironment | undefined> {
    const query = `
      SELECT driving_environment_id, alias, descripcion, "default", created_at, updated_at
      FROM driving_environments
      WHERE driving_environment_id = $1
      LIMIT 1
    `;

    const row = await queryOne<DrivingEnvironmentRow>(query, [id]);
    return row ? dbToDto('drivingenvironments', row) : undefined;
  }

  async getByAlias(alias: string): Promise<DrivingEnvironment | undefined> {
    const query = `
      SELECT driving_environment_id, alias, descripcion, "default", created_at, updated_at
      FROM driving_environments
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<DrivingEnvironmentRow>(query, [alias]);
    return row ? dbToDto('drivingenvironments', row) : undefined;
  }

  async getDefault(): Promise<DrivingEnvironment | undefined> {
    const query = `
      SELECT driving_environment_id, alias, descripcion, "default", created_at, updated_at
      FROM driving_environments
      WHERE "default" = true
      LIMIT 1
    `;

    const row = await queryOne<DrivingEnvironmentRow>(query);
    return row ? dbToDto('drivingenvironments', row) : undefined;
  }

  async create(drivingEnvironment: CreateDrivingEnvironmentInput): Promise<DrivingEnvironment> {
    if (!drivingEnvironment.Alias) {
      throw new Error('Missing required field: Alias');
    }

    const query = `
      INSERT INTO driving_environments (alias, descripcion, "default", created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING driving_environment_id, alias, descripcion, "default", created_at, updated_at
    `;

    const params = [
      drivingEnvironment.Alias,
      drivingEnvironment.Descripcion || null,
      drivingEnvironment.Default || false,
    ];

    const row = await queryOne<DrivingEnvironmentRow>(query, params);
    if (!row) throw new Error('Failed to create driving environment');
    
    return dbToDto('drivingenvironments', row);
  }

  async update(id: number, drivingEnvironment: UpdateDrivingEnvironmentInput): Promise<DrivingEnvironment | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (drivingEnvironment.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(drivingEnvironment.Alias);
    }
    if (drivingEnvironment.Descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      params.push(drivingEnvironment.Descripcion || null);
    }
    if (drivingEnvironment.Default !== undefined) {
      updates.push(`"default" = $${paramCount++}`);
      params.push(drivingEnvironment.Default);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE driving_environments
      SET ${updates.join(', ')}
      WHERE driving_environment_id = $${paramCount}
      RETURNING driving_environment_id, alias, descripcion, "default", created_at, updated_at
    `;

    const row = await queryOne<DrivingEnvironmentRow>(query, params);
    return row ? dbToDto('drivingenvironments', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM driving_environments WHERE driving_environment_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM driving_environments`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

