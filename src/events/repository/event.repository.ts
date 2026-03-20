/**
 * ðŸ—„ï¸ Event Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Event, CreateEventInput, UpdateEventInput, EventRow } from '../models/event.model';
import { dbToDto } from '../../config/database.config';

export class EventRepository {
  
  async getAll(): Promise<Event[]> {
    const query = `
      SELECT event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
      FROM events
      ORDER BY event_id ASC
    `;
    
    const rows = await queryAll<EventRow>(query);
    return rows.map(row => dbToDto('events', row));
  }

  async getById(id: number): Promise<Event | undefined> {
    const query = `
      SELECT event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
      FROM events
      WHERE event_id = $1
      LIMIT 1
    `;

    const row = await queryOne<EventRow>(query, [id]);
    return row ? dbToDto('events', row) : undefined;
  }

  async getByClub(clubId: number): Promise<Event[]> {
    const query = `
      SELECT event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
      FROM events
      WHERE club_id = $1
      ORDER BY event_id ASC
    `;

    const rows = await queryAll<EventRow>(query, [clubId]);
    return rows.map(row => dbToDto('events', row));
  }

  async create(event: CreateEventInput): Promise<Event> {
    if (!event.Descripcion) {
      throw new Error('Missing required field: Descripcion');
    }

    const query = `
      INSERT INTO events (descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
    `;

    const params = [
      event.Descripcion,
      event.FechaInicio || null,
      event.FechaFin || null,
      event.ClubId || null,
    ];

    const row = await queryOne<EventRow>(query, params);
    if (!row) throw new Error('Failed to create event');
    
    return dbToDto('events', row);
  }

  async update(id: number, event: UpdateEventInput): Promise<Event | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (event.Descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      params.push(event.Descripcion);
    }
    if (event.FechaInicio !== undefined) {
      updates.push(`fecha_inicio = $${paramCount++}`);
      params.push(event.FechaInicio || null);
    }
    if (event.FechaFin !== undefined) {
      updates.push(`fecha_fin = $${paramCount++}`);
      params.push(event.FechaFin || null);
    }
    if (event.ClubId !== undefined) {
      updates.push(`club_id = $${paramCount++}`);
      params.push(event.ClubId || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE events
      SET ${updates.join(', ')}
      WHERE event_id = $${paramCount}
      RETURNING event_id, descripcion, fecha_inicio, fecha_fin, club_id, created_at, updated_at
    `;

    const row = await queryOne<EventRow>(query, params);
    return row ? dbToDto('events', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM events WHERE event_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM events`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

