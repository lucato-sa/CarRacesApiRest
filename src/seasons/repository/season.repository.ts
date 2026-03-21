/**
 * 🗄️ Season Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Season, CreateSeasonInput, UpdateSeasonInput, SeasonRow } from '../models/season.model';
import { dbToDto } from '../../config/database.config';

export class SeasonRepository {
  
  async getAll(): Promise<Season[]> {
    const query = `
      SELECT season_id, championship_id, descripcion, fecha_desde, fecha_hasta, pilotos_min, pilotos_max, solo_socios, rulebook_id, created_at, updated_at
      FROM seasons
      ORDER BY season_id ASC
    `;
    
    const rows = await queryAll<SeasonRow>(query);
    return rows.map(row => dbToDto('seasons', row));
  }

  async getById(id: number): Promise<Season | undefined> {
    const query = `
      SELECT season_id, championship_id, descripcion, fecha_desde, fecha_hasta, pilotos_min, pilotos_max, solo_socios, rulebook_id, created_at, updated_at
      FROM seasons
      WHERE season_id = $1
      LIMIT 1
    `;

    const row = await queryOne<SeasonRow>(query, [id]);
    return row ? dbToDto('seasons', row) : undefined;
  }

  async getByChampionshipId(championshipId: number): Promise<Season[]> {
    const query = `
      SELECT season_id, championship_id, descripcion, fecha_desde, fecha_hasta, pilotos_min, pilotos_max, solo_socios, rulebook_id, created_at, updated_at
      FROM seasons
      WHERE championship_id = $1
      ORDER BY fecha_desde DESC
    `;

    const rows = await queryAll<SeasonRow>(query, [championshipId]);
    return rows.map(row => dbToDto('seasons', row));
  }

  async create(season: CreateSeasonInput): Promise<Season> {
    if (!season.ChampionshipId || !season.Descripcion || !season.FechaDesde || !season.FechaHasta) {
      throw new Error('Missing required fields: ChampionshipId, Descripcion, FechaDesde, FechaHasta');
    }

    const query = `
      INSERT INTO seasons (championship_id, descripcion, fecha_desde, fecha_hasta, pilotos_min, pilotos_max, solo_socios, rulebook_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING season_id, championship_id, descripcion, fecha_desde, fecha_hasta, pilotos_min, pilotos_max, solo_socios, rulebook_id, created_at, updated_at
    `;

    const params = [
      season.ChampionshipId,
      season.Descripcion,
      season.FechaDesde,
      season.FechaHasta,
      season.PilotosMin || null,
      season.PilotosMax || null,
      season.SoloSocios || false,
      season.RulebookId || null,
    ];

    const row = await queryOne<SeasonRow>(query, params);
    return row ? dbToDto('seasons', row) : ({} as Season);
  }

  async update(id: number, season: UpdateSeasonInput): Promise<Season | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (season.ChampionshipId !== undefined) {
      setClauses.push(`championship_id = $${paramCount++}`);
      params.push(season.ChampionshipId);
    }
    if (season.Descripcion !== undefined) {
      setClauses.push(`descripcion = $${paramCount++}`);
      params.push(season.Descripcion);
    }
    if (season.FechaDesde !== undefined) {
      setClauses.push(`fecha_desde = $${paramCount++}`);
      params.push(season.FechaDesde);
    }
    if (season.FechaHasta !== undefined) {
      setClauses.push(`fecha_hasta = $${paramCount++}`);
      params.push(season.FechaHasta);
    }
    if (season.PilotosMin !== undefined) {
      setClauses.push(`pilotos_min = $${paramCount++}`);
      params.push(season.PilotosMin);
    }
    if (season.PilotosMax !== undefined) {
      setClauses.push(`pilotos_max = $${paramCount++}`);
      params.push(season.PilotosMax);
    }
    if (season.SoloSocios !== undefined) {
      setClauses.push(`solo_socios = $${paramCount++}`);
      params.push(season.SoloSocios);
    }
    if (season.RulebookId !== undefined) {
      setClauses.push(`rulebook_id = $${paramCount++}`);
      params.push(season.RulebookId);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());
    params.push(id);

    const query = `
      UPDATE seasons
      SET ${setClauses.join(', ')}
      WHERE season_id = $${paramCount}
      RETURNING season_id, championship_id, descripcion, fecha_desde, fecha_hasta, pilotos_min, pilotos_max, solo_socios, rulebook_id, created_at, updated_at
    `;

    const row = await queryOne<SeasonRow>(query, params);
    return row ? dbToDto('seasons', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM seasons WHERE season_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
