/**
 * ðŸ—„ï¸ Championship Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Championship, CreateChampionshipInput, UpdateChampionshipInput, ChampionshipRow } from '../models/championship.model';
import { dbToDto } from '../../config/database.config';

export class ChampionshipRepository {
  
  async getAll(): Promise<Championship[]> {
    const query = `
      SELECT championship_id, alias, descripcion, club_id, created_at, updated_at
      FROM championships
      ORDER BY championship_id ASC
    `;
    
    const rows = await queryAll<ChampionshipRow>(query);
    return rows.map(row => dbToDto('championships', row));
  }

  async getById(id: number): Promise<Championship | undefined> {
    const query = `
      SELECT championship_id, alias, descripcion, club_id, created_at, updated_at
      FROM championships
      WHERE championship_id = $1
      LIMIT 1
    `;

    const row = await queryOne<ChampionshipRow>(query, [id]);
    return row ? dbToDto('championships', row) : undefined;
  }

  async getByAlias(alias: string): Promise<Championship | undefined> {
    const query = `
      SELECT championship_id, alias, descripcion, club_id, created_at, updated_at
      FROM championships
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<ChampionshipRow>(query, [alias]);
    return row ? dbToDto('championships', row) : undefined;
  }

  async getByClub(clubId: number): Promise<Championship[]> {
    const query = `
      SELECT championship_id, alias, descripcion, club_id, created_at, updated_at
      FROM championships
      WHERE club_id = $1
      ORDER BY championship_id ASC
    `;

    const rows = await queryAll<ChampionshipRow>(query, [clubId]);
    return rows.map(row => dbToDto('championships', row));
  }

  async create(championship: CreateChampionshipInput): Promise<Championship> {
    if (!championship.Alias) {
      throw new Error('Missing required field: Alias');
    }

    const query = `
      INSERT INTO championships (alias, descripcion, club_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING championship_id, alias, descripcion, club_id, created_at, updated_at
    `;

    const params = [
      championship.Alias,
      championship.Descripcion || null,
      championship.ClubId || null,
    ];

    const row = await queryOne<ChampionshipRow>(query, params);
    if (!row) throw new Error('Failed to create championship');
    
    return dbToDto('championships', row);
  }

  async update(id: number, championship: UpdateChampionshipInput): Promise<Championship | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (championship.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(championship.Alias);
    }
    if (championship.Descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      params.push(championship.Descripcion || null);
    }
    if (championship.ClubId !== undefined) {
      updates.push(`club_id = $${paramCount++}`);
      params.push(championship.ClubId || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE championships
      SET ${updates.join(', ')}
      WHERE championship_id = $${paramCount}
      RETURNING championship_id, alias, descripcion, club_id, created_at, updated_at
    `;

    const row = await queryOne<ChampionshipRow>(query, params);
    return row ? dbToDto('championships', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM championships WHERE championship_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM championships`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

