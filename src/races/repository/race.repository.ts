/**
 * ðŸ—„ï¸ Race Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Race, CreateRaceInput, UpdateRaceInput, RaceRow } from '../models/race.model';
import { dbToDto } from '../../config/database.config';

export class RaceRepository {
  
  async getAll(): Promise<Race[]> {
    const query = `
      SELECT race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
      FROM races
      ORDER BY race_id ASC
    `;
    
    const rows = await queryAll<RaceRow>(query);
    return rows.map(row => dbToDto('races', row));
  }

  async getById(id: number): Promise<Race | undefined> {
    const query = `
      SELECT race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
      FROM races
      WHERE race_id = $1
      LIMIT 1
    `;

    const row = await queryOne<RaceRow>(query, [id]);
    return row ? dbToDto('races', row) : undefined;
  }

  async getByCompetition(competitionId: number): Promise<Race[]> {
    const query = `
      SELECT race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
      FROM races
      WHERE competition_id = $1
      ORDER BY num_race ASC
    `;

    const rows = await queryAll<RaceRow>(query, [competitionId]);
    return rows.map(row => dbToDto('races', row));
  }

  async create(race: CreateRaceInput): Promise<Race> {
    if (!race.CompetitionId || !race.NumRace || !race.Fecha) {
      throw new Error('Missing required fields: CompetitionId, NumRace, Fecha');
    }

    const query = `
      INSERT INTO races (competition_id, num_race, fecha, hora, estado, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
    `;

    const params = [
      race.CompetitionId,
      race.NumRace,
      race.Fecha,
      race.Hora || null,
      race.Estado || 'PENDING',
    ];

    const row = await queryOne<RaceRow>(query, params);
    if (!row) throw new Error('Failed to create race');
    
    return dbToDto('races', row);
  }

  async update(id: number, race: UpdateRaceInput): Promise<Race | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (race.NumRace !== undefined) {
      updates.push(`num_race = $${paramCount++}`);
      params.push(race.NumRace);
    }
    if (race.Fecha !== undefined) {
      updates.push(`fecha = $${paramCount++}`);
      params.push(race.Fecha);
    }
    if (race.Hora !== undefined) {
      updates.push(`hora = $${paramCount++}`);
      params.push(race.Hora || null);
    }
    if (race.Estado !== undefined) {
      updates.push(`estado = $${paramCount++}`);
      params.push(race.Estado);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE races
      SET ${updates.join(', ')}
      WHERE race_id = $${paramCount}
      RETURNING race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
    `;

    const row = await queryOne<RaceRow>(query, params);
    return row ? dbToDto('races', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM races WHERE race_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM races`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

