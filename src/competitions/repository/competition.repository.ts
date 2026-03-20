/**
 * ðŸ—„ï¸ Competition Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Competition, CreateCompetitionInput, UpdateCompetitionInput, CompetitionRow } from '../models/competition.model';
import { dbToDto } from '../../config/database.config';

export class CompetitionRepository {
  
  async getAll(): Promise<Competition[]> {
    const query = `
      SELECT competition_id, season_id, event_id, venue_id, alias, total_races, 
             fecha_inicio_inscrip_pri, fecha_fin_inscrip_pri, fecha_inicio_inscrip, fecha_fin_inscrip,
             pilotos_min_inscrip, pilotos_max_inscrip, responsable, solo_usuarios_reg, notas, created_at, updated_at
      FROM competitions
      ORDER BY competition_id ASC
    `;
    
    const rows = await queryAll<CompetitionRow>(query);
    return rows.map(row => dbToDto('competitions', row));
  }

  async getById(id: number): Promise<Competition | undefined> {
    const query = `
      SELECT competition_id, season_id, event_id, venue_id, alias, total_races, 
             fecha_inicio_inscrip_pri, fecha_fin_inscrip_pri, fecha_inicio_inscrip, fecha_fin_inscrip,
             pilotos_min_inscrip, pilotos_max_inscrip, responsable, solo_usuarios_reg, notas, created_at, updated_at
      FROM competitions
      WHERE competition_id = $1
      LIMIT 1
    `;

    const row = await queryOne<CompetitionRow>(query, [id]);
    return row ? dbToDto('competitions', row) : undefined;
  }

  async getByAlias(alias: string): Promise<Competition | undefined> {
    const query = `
      SELECT competition_id, season_id, event_id, venue_id, alias, total_races, 
             fecha_inicio_inscrip_pri, fecha_fin_inscrip_pri, fecha_inicio_inscrip, fecha_fin_inscrip,
             pilotos_min_inscrip, pilotos_max_inscrip, responsable, solo_usuarios_reg, notas, created_at, updated_at
      FROM competitions
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<CompetitionRow>(query, [alias]);
    return row ? dbToDto('competitions', row) : undefined;
  }

  async create(competition: CreateCompetitionInput): Promise<Competition> {
    if (!competition.Alias) {
      throw new Error('Missing required field: Alias');
    }

    const query = `
      INSERT INTO competitions (season_id, event_id, venue_id, alias, total_races, 
                               fecha_inicio_inscrip_pri, fecha_fin_inscrip_pri, fecha_inicio_inscrip, fecha_fin_inscrip,
                               pilotos_min_inscrip, pilotos_max_inscrip, responsable, solo_usuarios_reg, notas, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
      RETURNING competition_id, season_id, event_id, venue_id, alias, total_races, 
                fecha_inicio_inscrip_pri, fecha_fin_inscrip_pri, fecha_inicio_inscrip, fecha_fin_inscrip,
                pilotos_min_inscrip, pilotos_max_inscrip, responsable, solo_usuarios_reg, notas, created_at, updated_at
    `;

    const params = [
      competition.SeasonId || null,
      competition.EventId || null,
      competition.VenueId || null,
      competition.Alias,
      competition.TotalRaces || null,
      competition.FechaInicioInscripPri || null,
      competition.FechaFinInscripPri || null,
      competition.FechaInicioInscrip || null,
      competition.FechaFinInscrip || null,
      competition.PilotosMinInscrip || null,
      competition.PilotosMaxInscrip || null,
      competition.Responsable || null,
      competition.SoloUsuariosReg || false,
      competition.Notas || null,
    ];

    const row = await queryOne<CompetitionRow>(query, params);
    if (!row) throw new Error('Failed to create competition');
    
    return dbToDto('competitions', row);
  }

  async update(id: number, competition: UpdateCompetitionInput): Promise<Competition | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (competition.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(competition.Alias);
    }
    if (competition.TotalRaces !== undefined) {
      updates.push(`total_races = $${paramCount++}`);
      params.push(competition.TotalRaces);
    }
    if (competition.FechaInicioInscripPri !== undefined) {
      updates.push(`fecha_inicio_inscrip_pri = $${paramCount++}`);
      params.push(competition.FechaInicioInscripPri || null);
    }
    if (competition.FechaFinInscripPri !== undefined) {
      updates.push(`fecha_fin_inscrip_pri = $${paramCount++}`);
      params.push(competition.FechaFinInscripPri || null);
    }
    if (competition.FechaInicioInscrip !== undefined) {
      updates.push(`fecha_inicio_inscrip = $${paramCount++}`);
      params.push(competition.FechaInicioInscrip || null);
    }
    if (competition.FechaFinInscrip !== undefined) {
      updates.push(`fecha_fin_inscrip = $${paramCount++}`);
      params.push(competition.FechaFinInscrip || null);
    }
    if (competition.PilotosMinInscrip !== undefined) {
      updates.push(`pilotos_min_inscrip = $${paramCount++}`);
      params.push(competition.PilotosMinInscrip);
    }
    if (competition.PilotosMaxInscrip !== undefined) {
      updates.push(`pilotos_max_inscrip = $${paramCount++}`);
      params.push(competition.PilotosMaxInscrip);
    }
    if (competition.Responsable !== undefined) {
      updates.push(`responsable = $${paramCount++}`);
      params.push(competition.Responsable || null);
    }
    if (competition.SoloUsuariosReg !== undefined) {
      updates.push(`solo_usuarios_reg = $${paramCount++}`);
      params.push(competition.SoloUsuariosReg);
    }
    if (competition.Notas !== undefined) {
      updates.push(`notas = $${paramCount++}`);
      params.push(competition.Notas || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE competitions
      SET ${updates.join(', ')}
      WHERE competition_id = $${paramCount}
      RETURNING competition_id, season_id, event_id, venue_id, alias, total_races, 
                fecha_inicio_inscrip_pri, fecha_fin_inscrip_pri, fecha_inicio_inscrip, fecha_fin_inscrip,
                pilotos_min_inscrip, pilotos_max_inscrip, responsable, solo_usuarios_reg, notas, created_at, updated_at
    `;

    const row = await queryOne<CompetitionRow>(query, params);
    return row ? dbToDto('competitions', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM competitions WHERE competition_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM competitions`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

