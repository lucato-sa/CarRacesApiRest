/**
 * 🗄️ Venue Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Venue, CreateVenueInput, UpdateVenueInput, VenueRow } from '../models/venue.model';
import { dbToDto } from '../../config/database.config';

export class VenueRepository {
  
  async getAll(): Promise<Venue[]> {
    const query = `
      SELECT venue_id, club_id, alias, sede_social, sede_carreras, direccion, localidad, provincia, pais, map_latitud, map_longitud, created_at, updated_at
      FROM venues
      ORDER BY venue_id ASC
    `;
    
    const rows = await queryAll<VenueRow>(query);
    return rows.map(row => dbToDto('venues', row));
  }

  async getById(id: number): Promise<Venue | undefined> {
    const query = `
      SELECT venue_id, club_id, alias, sede_social, sede_carreras, direccion, localidad, provincia, pais, map_latitud, map_longitud, created_at, updated_at
      FROM venues
      WHERE venue_id = $1
      LIMIT 1
    `;

    const row = await queryOne<VenueRow>(query, [id]);
    return row ? dbToDto('venues', row) : undefined;
  }

  async getByClubId(clubId: number): Promise<Venue[]> {
    const query = `
      SELECT venue_id, club_id, alias, sede_social, sede_carreras, direccion, localidad, provincia, pais, map_latitud, map_longitud, created_at, updated_at
      FROM venues
      WHERE club_id = $1
      ORDER BY venue_id ASC
    `;

    const rows = await queryAll<VenueRow>(query, [clubId]);
    return rows.map(row => dbToDto('venues', row));
  }

  async create(venue: CreateVenueInput): Promise<Venue> {
    if (!venue.ClubId || !venue.Alias) {
      throw new Error('Missing required fields: ClubId, Alias');
    }

    const query = `
      INSERT INTO venues (club_id, alias, sede_social, sede_carreras, direccion, localidad, provincia, pais, map_latitud, map_longitud, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING venue_id, club_id, alias, sede_social, sede_carreras, direccion, localidad, provincia, pais, map_latitud, map_longitud, created_at, updated_at
    `;

    const params = [
      venue.ClubId,
      venue.Alias,
      venue.SedeSocial || false,
      venue.SedeCarreras || false,
      venue.Direccion || null,
      venue.Localidad || null,
      venue.Provincia || null,
      venue.Pais || null,
      venue.MapLatitud || null,
      venue.MapLongitud || null,
    ];

    const row = await queryOne<VenueRow>(query, params);
    return row ? dbToDto('venues', row) : ({} as Venue);
  }

  async update(id: number, venue: UpdateVenueInput): Promise<Venue | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (venue.ClubId !== undefined) {
      setClauses.push(`club_id = $${paramCount++}`);
      params.push(venue.ClubId);
    }
    if (venue.Alias !== undefined) {
      setClauses.push(`alias = $${paramCount++}`);
      params.push(venue.Alias);
    }
    if (venue.SedeSocial !== undefined) {
      setClauses.push(`sede_social = $${paramCount++}`);
      params.push(venue.SedeSocial);
    }
    if (venue.SedeCarreras !== undefined) {
      setClauses.push(`sede_carreras = $${paramCount++}`);
      params.push(venue.SedeCarreras);
    }
    if (venue.Direccion !== undefined) {
      setClauses.push(`direccion = $${paramCount++}`);
      params.push(venue.Direccion);
    }
    if (venue.Localidad !== undefined) {
      setClauses.push(`localidad = $${paramCount++}`);
      params.push(venue.Localidad);
    }
    if (venue.Provincia !== undefined) {
      setClauses.push(`provincia = $${paramCount++}`);
      params.push(venue.Provincia);
    }
    if (venue.Pais !== undefined) {
      setClauses.push(`pais = $${paramCount++}`);
      params.push(venue.Pais);
    }
    if (venue.MapLatitud !== undefined) {
      setClauses.push(`map_latitud = $${paramCount++}`);
      params.push(venue.MapLatitud);
    }
    if (venue.MapLongitud !== undefined) {
      setClauses.push(`map_longitud = $${paramCount++}`);
      params.push(venue.MapLongitud);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());
    params.push(id);

    const query = `
      UPDATE venues
      SET ${setClauses.join(', ')}
      WHERE venue_id = $${paramCount}
      RETURNING venue_id, club_id, alias, sede_social, sede_carreras, direccion, localidad, provincia, pais, map_latitud, map_longitud, created_at, updated_at
    `;

    const row = await queryOne<VenueRow>(query, params);
    return row ? dbToDto('venues', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM venues WHERE venue_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
