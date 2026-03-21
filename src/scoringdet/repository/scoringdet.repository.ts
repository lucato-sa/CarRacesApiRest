/**
 * 🗄️ ScoringDet Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { ScoringDet, CreateScoringDetInput, UpdateScoringDetInput, ScoringDetRow } from '../models/scoringdet.model';
import { dbToDto } from '../../config/database.config';

export class ScoringDetRepository {
  
  async getAll(): Promise<ScoringDet[]> {
    const query = `
      SELECT scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
      FROM scoring_det
      ORDER BY scoring_det_id ASC
    `;
    
    const rows = await queryAll<ScoringDetRow>(query);
    return rows.map(row => dbToDto('scoringdet', row));
  }

  async getById(id: number): Promise<ScoringDet | undefined> {
    const query = `
      SELECT scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
      FROM scoring_det
      WHERE scoring_det_id = $1
      LIMIT 1
    `;

    const row = await queryOne<ScoringDetRow>(query, [id]);
    return row ? dbToDto('scoringdet', row) : undefined;
  }

  async getByScoringId(scoringId: number): Promise<ScoringDet[]> {
    const query = `
      SELECT scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
      FROM scoring_det
      WHERE scoring_id = $1
      ORDER BY posicion ASC
    `;

    const rows = await queryAll<ScoringDetRow>(query, [scoringId]);
    return rows.map(row => dbToDto('scoringdet', row));
  }

  async create(scoringDet: CreateScoringDetInput): Promise<ScoringDet> {
    if (!scoringDet.ScoringId || scoringDet.Posicion === undefined || scoringDet.Puntos === undefined) {
      throw new Error('Missing required fields: ScoringId, Posicion, Puntos');
    }

    const query = `
      INSERT INTO scoring_det (scoring_id, posicion, puntos, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
    `;

    const params = [scoringDet.ScoringId, scoringDet.Posicion, scoringDet.Puntos];

    const row = await queryOne<ScoringDetRow>(query, params);
    return row ? dbToDto('scoringdet', row) : ({} as ScoringDet);
  }

  async update(id: number, scoringDet: UpdateScoringDetInput): Promise<ScoringDet | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (scoringDet.ScoringId !== undefined) {
      setClauses.push(`scoring_id = $${paramCount++}`);
      params.push(scoringDet.ScoringId);
    }
    if (scoringDet.Posicion !== undefined) {
      setClauses.push(`posicion = $${paramCount++}`);
      params.push(scoringDet.Posicion);
    }
    if (scoringDet.Puntos !== undefined) {
      setClauses.push(`puntos = $${paramCount++}`);
      params.push(scoringDet.Puntos);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());
    params.push(id);

    const query = `
      UPDATE scoring_det
      SET ${setClauses.join(', ')}
      WHERE scoring_det_id = $${paramCount}
      RETURNING scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
    `;

    const row = await queryOne<ScoringDetRow>(query, params);
    return row ? dbToDto('scoringdet', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM scoring_det WHERE scoring_det_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
