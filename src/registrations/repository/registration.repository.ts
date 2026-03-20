/**
 * ðŸ—„ï¸ Registration Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Registration, CreateRegistrationInput, UpdateRegistrationInput, RegistrationRow } from '../models/registration.model';
import { dbToDto } from '../../config/database.config';

export class RegistrationRepository {
  
  async getAll(): Promise<Registration[]> {
    const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      ORDER BY registration_id ASC
    `;
    
    const rows = await queryAll<RegistrationRow>(query);
    return rows.map(row => dbToDto('registrations', row));
  }

  async getById(id: number): Promise<Registration | undefined> {
    const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      WHERE registration_id = $1
      LIMIT 1
    `;

    const row = await queryOne<RegistrationRow>(query, [id]);
    return row ? dbToDto('registrations', row) : undefined;
  }

  async getByCompetition(competitionId: number): Promise<Registration[]> {
    const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      WHERE competition_id = $1
      ORDER BY registration_id ASC
    `;

    const rows = await queryAll<RegistrationRow>(query, [competitionId]);
    return rows.map(row => dbToDto('registrations', row));
  }

  async getByUser(userId: number): Promise<Registration[]> {
    const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      WHERE user_id = $1
      ORDER BY registration_id ASC
    `;

    const rows = await queryAll<RegistrationRow>(query, [userId]);
    return rows.map(row => dbToDto('registrations', row));
  }

  async getByCompetitionAndUser(competitionId: number, userId: number): Promise<Registration | undefined> {
    const query = `
      SELECT registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
      FROM registrations
      WHERE competition_id = $1 AND user_id = $2
      LIMIT 1
    `;

    const row = await queryOne<RegistrationRow>(query, [competitionId, userId]);
    return row ? dbToDto('registrations', row) : undefined;
  }

  async create(registration: CreateRegistrationInput): Promise<Registration> {
    if (!registration.CompetitionId || !registration.UserId) {
      throw new Error('Missing required fields: CompetitionId, UserId');
    }

    const query = `
      INSERT INTO registrations (competition_id, user_id, fecha_registro, estado, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
    `;

    const params = [
      registration.CompetitionId,
      registration.UserId,
      registration.FechaRegistro || new Date().toISOString().split('T')[0],
      registration.Estado || 'ACTIVE',
    ];

    const row = await queryOne<RegistrationRow>(query, params);
    if (!row) throw new Error('Failed to create registration');
    
    return dbToDto('registrations', row);
  }

  async update(id: number, registration: UpdateRegistrationInput): Promise<Registration | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (registration.Estado !== undefined) {
      updates.push(`estado = $${paramCount++}`);
      params.push(registration.Estado);
    }
    if (registration.FechaRegistro !== undefined) {
      updates.push(`fecha_registro = $${paramCount++}`);
      params.push(registration.FechaRegistro);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE registrations
      SET ${updates.join(', ')}
      WHERE registration_id = $${paramCount}
      RETURNING registration_id, competition_id, user_id, fecha_registro, estado, created_at, updated_at
    `;

    const row = await queryOne<RegistrationRow>(query, params);
    return row ? dbToDto('registrations', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM registrations WHERE registration_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM registrations`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

