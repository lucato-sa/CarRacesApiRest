/**
 * 🗄️ Rulebook Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Rulebook, CreateRulebookInput, UpdateRulebookInput, RulebookRow } from '../models/rulebook.model';
import { dbToDto } from '../../config/database.config';

export class RulebookRepository {
  
  async getAll(): Promise<Rulebook[]> {
    const query = `
      SELECT rulebook_id, descripcion, fecha_inicio_valido, fecha_fin_valido, division_id, group_id, club_id, created_at, updated_at
      FROM rulebooks
      ORDER BY rulebook_id ASC
    `;
    
    const rows = await queryAll<RulebookRow>(query);
    return rows.map(row => dbToDto('rulebooks', row));
  }

  async getById(id: number): Promise<Rulebook | undefined> {
    const query = `
      SELECT rulebook_id, descripcion, fecha_inicio_valido, fecha_fin_valido, division_id, group_id, club_id, created_at, updated_at
      FROM rulebooks
      WHERE rulebook_id = $1
      LIMIT 1
    `;

    const row = await queryOne<RulebookRow>(query, [id]);
    return row ? dbToDto('rulebooks', row) : undefined;
  }

  async getByClubId(clubId: number): Promise<Rulebook[]> {
    const query = `
      SELECT rulebook_id, descripcion, fecha_inicio_valido, fecha_fin_valido, division_id, group_id, club_id, created_at, updated_at
      FROM rulebooks
      WHERE club_id = $1
      ORDER BY rulebook_id ASC
    `;

    const rows = await queryAll<RulebookRow>(query, [clubId]);
    return rows.map(row => dbToDto('rulebooks', row));
  }

  async create(rulebook: CreateRulebookInput): Promise<Rulebook> {
    if (!rulebook.Descripcion || !rulebook.FechaInicioValido) {
      throw new Error('Missing required fields: Descripcion, FechaInicioValido');
    }

    const query = `
      INSERT INTO rulebooks (descripcion, fecha_inicio_valido, fecha_fin_valido, division_id, group_id, club_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING rulebook_id, descripcion, fecha_inicio_valido, fecha_fin_valido, division_id, group_id, club_id, created_at, updated_at
    `;

    const params = [
      rulebook.Descripcion,
      rulebook.FechaInicioValido,
      rulebook.FechaFinValido || null,
      rulebook.DivisionId || null,
      rulebook.GroupId || null,
      rulebook.ClubId || null,
    ];

    const row = await queryOne<RulebookRow>(query, params);
    return row ? dbToDto('rulebooks', row) : ({} as Rulebook);
  }

  async update(id: number, rulebook: UpdateRulebookInput): Promise<Rulebook | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (rulebook.Descripcion !== undefined) {
      setClauses.push(`descripcion = $${paramCount++}`);
      params.push(rulebook.Descripcion);
    }
    if (rulebook.FechaInicioValido !== undefined) {
      setClauses.push(`fecha_inicio_valido = $${paramCount++}`);
      params.push(rulebook.FechaInicioValido);
    }
    if (rulebook.FechaFinValido !== undefined) {
      setClauses.push(`fecha_fin_valido = $${paramCount++}`);
      params.push(rulebook.FechaFinValido);
    }
    if (rulebook.DivisionId !== undefined) {
      setClauses.push(`division_id = $${paramCount++}`);
      params.push(rulebook.DivisionId);
    }
    if (rulebook.GroupId !== undefined) {
      setClauses.push(`group_id = $${paramCount++}`);
      params.push(rulebook.GroupId);
    }
    if (rulebook.ClubId !== undefined) {
      setClauses.push(`club_id = $${paramCount++}`);
      params.push(rulebook.ClubId);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());
    params.push(id);

    const query = `
      UPDATE rulebooks
      SET ${setClauses.join(', ')}
      WHERE rulebook_id = $${paramCount}
      RETURNING rulebook_id, descripcion, fecha_inicio_valido, fecha_fin_valido, division_id, group_id, club_id, created_at, updated_at
    `;

    const row = await queryOne<RulebookRow>(query, params);
    return row ? dbToDto('rulebooks', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM rulebooks WHERE rulebook_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
