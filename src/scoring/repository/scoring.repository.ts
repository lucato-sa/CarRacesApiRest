/**
 * 🗄️ Scoring Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Scoring, CreateScoringInput, UpdateScoringInput, ScoringRow } from '../models/scoring.model';
import { dbToDto } from '../../config/database.config';

export class ScoringRepository {
  
  async getAll(): Promise<Scoring[]> {
    const query = `
      SELECT scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
      FROM scoring
      ORDER BY scoring_id ASC
    `;
    
    const rows = await queryAll<ScoringRow>(query);
    return rows.map(row => dbToDto('scoring', row));
  }

  async getById(id: number): Promise<Scoring | undefined> {
    const query = `
      SELECT scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
      FROM scoring
      WHERE scoring_id = $1
      LIMIT 1
    `;

    const row = await queryOne<ScoringRow>(query, [id]);
    return row ? dbToDto('scoring', row) : undefined;
  }

  async getByClubId(clubId: number): Promise<Scoring[]> {
    const query = `
      SELECT scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
      FROM scoring
      WHERE club_id = $1
      ORDER BY scoring_id ASC
    `;

    const rows = await queryAll<ScoringRow>(query, [clubId]);
    return rows.map(row => dbToDto('scoring', row));
  }

  async create(scoring: CreateScoringInput): Promise<Scoring> {
    if (!scoring.Descripcion) {
      throw new Error('Missing required field: Descripcion');
    }

    const query = `
      INSERT INTO scoring (descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
    `;

    const params = [
      scoring.Descripcion,
      scoring.ClubId || null,
      scoring.UltPosPuntos || null,
      scoring.PuntosDefecto || null,
    ];

    const row = await queryOne<ScoringRow>(query, params);
    return row ? dbToDto('scoring', row) : ({} as Scoring);
  }

  async update(id: number, scoring: UpdateScoringInput): Promise<Scoring | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (scoring.Descripcion !== undefined) {
      setClauses.push(`descripcion = $${paramCount++}`);
      params.push(scoring.Descripcion);
    }
    if (scoring.ClubId !== undefined) {
      setClauses.push(`club_id = $${paramCount++}`);
      params.push(scoring.ClubId);
    }
    if (scoring.UltPosPuntos !== undefined) {
      setClauses.push(`ult_pos_puntos = $${paramCount++}`);
      params.push(scoring.UltPosPuntos);
    }
    if (scoring.PuntosDefecto !== undefined) {
      setClauses.push(`puntos_defecto = $${paramCount++}`);
      params.push(scoring.PuntosDefecto);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());
    params.push(id);

    const query = `
      UPDATE scoring
      SET ${setClauses.join(', ')}
      WHERE scoring_id = $${paramCount}
      RETURNING scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
    `;

    const row = await queryOne<ScoringRow>(query, params);
    return row ? dbToDto('scoring', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM scoring WHERE scoring_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
