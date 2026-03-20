/**
 * ðŸ—„ï¸ RaceResult Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { RaceResult, CreateRaceResultInput, UpdateRaceResultInput, RaceResultRow } from '../models/raceresult.model';
import { dbToDto } from '../../config/database.config';

export class RaceResultRepository {
  
  async getAll(): Promise<RaceResult[]> {
    const query = `
      SELECT result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
      FROM race_results
      ORDER BY result_id ASC
    `;
    
    const rows = await queryAll<RaceResultRow>(query);
    return rows.map(row => dbToDto('raceresults', row));
  }

  async getById(id: number): Promise<RaceResult | undefined> {
    const query = `
      SELECT result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
      FROM race_results
      WHERE result_id = $1
      LIMIT 1
    `;

    const row = await queryOne<RaceResultRow>(query, [id]);
    return row ? dbToDto('raceresults', row) : undefined;
  }

  async getByRace(raceId: number): Promise<RaceResult[]> {
    const query = `
      SELECT result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
      FROM race_results
      WHERE race_id = $1
      ORDER BY posicion ASC
    `;

    const rows = await queryAll<RaceResultRow>(query, [raceId]);
    return rows.map(row => dbToDto('raceresults', row));
  }

  async getByUser(userId: number): Promise<RaceResult[]> {
    const query = `
      SELECT result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
      FROM race_results
      WHERE user_id = $1
      ORDER BY result_id ASC
    `;

    const rows = await queryAll<RaceResultRow>(query, [userId]);
    return rows.map(row => dbToDto('raceresults', row));
  }

  async create(raceResult: CreateRaceResultInput): Promise<RaceResult> {
    if (!raceResult.RaceId || !raceResult.UserId) {
      throw new Error('Missing required fields: RaceId, UserId');
    }

    const query = `
      INSERT INTO race_results (race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
    `;

    const params = [
      raceResult.RaceId,
      raceResult.UserId,
      raceResult.Posicion || null,
      raceResult.Vueltas || null,
      raceResult.PrimeraLinea || false,
      raceResult.VueltaRapida || false,
    ];

    const row = await queryOne<RaceResultRow>(query, params);
    if (!row) throw new Error('Failed to create race result');
    
    return dbToDto('raceresults', row);
  }

  async update(id: number, raceResult: UpdateRaceResultInput): Promise<RaceResult | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (raceResult.Posicion !== undefined) {
      updates.push(`posicion = $${paramCount++}`);
      params.push(raceResult.Posicion);
    }
    if (raceResult.Vueltas !== undefined) {
      updates.push(`vueltas = $${paramCount++}`);
      params.push(raceResult.Vueltas);
    }
    if (raceResult.PrimeraLinea !== undefined) {
      updates.push(`primera_linea = $${paramCount++}`);
      params.push(raceResult.PrimeraLinea);
    }
    if (raceResult.VueltaRapida !== undefined) {
      updates.push(`vuelta_rapida = $${paramCount++}`);
      params.push(raceResult.VueltaRapida);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE race_results
      SET ${updates.join(', ')}
      WHERE result_id = $${paramCount}
      RETURNING result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
    `;

    const row = await queryOne<RaceResultRow>(query, params);
    return row ? dbToDto('raceresults', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM race_results WHERE result_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM race_results`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

