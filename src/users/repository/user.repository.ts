/**
 * ðŸ—„ï¸ User Repository - SQL Nativo con 'pg'
 * 
 * Acceso a datos usando SQL explÃ­cito
 * âœ… Control total de queries
 * âœ… FÃ¡cil debugging
 * âœ… Mejor performance
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { User, CreateUserInput, UpdateUserInput, UserRow } from '../models/user.model';
import { dbToDto } from '../../config/database.config';

/**
 * Repository para operaciones CRUD de Users
 * Mapea automÃ¡ticamente entre DTO (PascalCase) y BD (snake_case)
 */
export class UserRepository {
  
  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<User[]> {
    const query = `
      SELECT user_id, nick, nombre, apellidos, email, direccion, localidad, provincia, pais, created_at, updated_at
      FROM users
      ORDER BY user_id ASC
    `;
    
    const rows = await queryAll<UserRow>(query);
    return rows.map(row => dbToDto('users', row));
  }

  /**
   * Obtener un usuario por ID
   */
  async getById(id: number): Promise<User | undefined> {
    const query = `
      SELECT user_id, nick, nombre, apellidos, email, direccion, localidad, provincia, pais, created_at, updated_at
      FROM users
      WHERE user_id = $1
      LIMIT 1
    `;

    const row = await queryOne<UserRow>(query, [id]);
    return row ? dbToDto('users', row) : undefined;
  }

  /**
   * Obtener usuario por Nick (Ãºnico)
   */
  async getByNick(nick: string): Promise<User | undefined> {
    const query = `
      SELECT user_id, nick, nombre, apellidos, email, direccion, localidad, provincia, pais, created_at, updated_at
      FROM users
      WHERE nick = $1
      LIMIT 1
    `;

    const row = await queryOne<UserRow>(query, [nick]);
    return row ? dbToDto('users', row) : undefined;
  }

  /**
   * Obtener usuario por Email (Ãºnico)
   */
  async getByEmail(email: string): Promise<User | undefined> {
    const query = `
      SELECT user_id, nick, nombre, apellidos, email, direccion, localidad, provincia, pais, created_at, updated_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `;

    const row = await queryOne<UserRow>(query, [email]);
    return row ? dbToDto('users', row) : undefined;
  }

  /**
   * Crear nuevo usuario
   */
  async create(user: CreateUserInput): Promise<User> {
    if (!user.Nick || !user.Nombre || !user.Apellidos || !user.Email) {
      throw new Error('Missing required fields: Nick, Nombre, Apellidos, Email');
    }

    const query = `
      INSERT INTO users (nick, nombre, apellidos, email, direccion, localidad, provincia, pais, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING user_id, nick, nombre, apellidos, email, direccion, localidad, provincia, pais, created_at, updated_at
    `;

    const params = [
      user.Nick,
      user.Nombre,
      user.Apellidos,
      user.Email,
      user.Direccion || null,
      user.Localidad || null,
      user.Provincia || null,
      user.Pais || null,
    ];

    const row = await queryOne<UserRow>(query, params);
    if (!row) throw new Error('Failed to create user');
    
    return dbToDto('users', row);
  }

  /**
   * Actualizar usuario existente
   */
  async update(id: number, user: UpdateUserInput): Promise<User | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (user.Nick !== undefined) {
      updates.push(`nick = $${paramCount++}`);
      params.push(user.Nick);
    }
    if (user.Nombre !== undefined) {
      updates.push(`nombre = $${paramCount++}`);
      params.push(user.Nombre);
    }
    if (user.Apellidos !== undefined) {
      updates.push(`apellidos = $${paramCount++}`);
      params.push(user.Apellidos);
    }
    if (user.Email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      params.push(user.Email);
    }
    if (user.Direccion !== undefined) {
      updates.push(`direccion = $${paramCount++}`);
      params.push(user.Direccion || null);
    }
    if (user.Localidad !== undefined) {
      updates.push(`localidad = $${paramCount++}`);
      params.push(user.Localidad || null);
    }
    if (user.Provincia !== undefined) {
      updates.push(`provincia = $${paramCount++}`);
      params.push(user.Provincia || null);
    }
    if (user.Pais !== undefined) {
      updates.push(`pais = $${paramCount++}`);
      params.push(user.Pais || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING user_id, nick, nombre, apellidos, email, direccion, localidad, provincia, pais, created_at, updated_at
    `;

    const row = await queryOne<UserRow>(query, params);
    return row ? dbToDto('users', row) : undefined;
  }

  /**
   * Eliminar usuario por ID
   */
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM users WHERE user_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Contar total de usuarios
   */
  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM users`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }

  /**
   * BÃºsqueda con filtros y paginaciÃ³n
   */
  async search(filters?: {
    nick?: string;
    email?: string;
    q?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: User[]; total: number; page: number; pageSize: number }> {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.max(1, filters?.pageSize || 20);
    const offset = (page - 1) * pageSize;

    let whereConditions = [];
    let params: any[] = [];
    let paramCount = 1;

    if (filters?.nick) {
      whereConditions.push(`nick = $${paramCount++}`);
      params.push(filters.nick);
    }

    if (filters?.email) {
      whereConditions.push(`email = $${paramCount++}`);
      params.push(filters.email);
    }

    if (filters?.q) {
      whereConditions.push(`(nick ILIKE $${paramCount} OR nombre ILIKE $${paramCount} OR apellidos ILIKE $${paramCount})`);
      params.push(`%${filters.q}%`);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await queryOne<{ total: string }>(countQuery, params);
    const total = countResult ? parseInt(countResult.total) : 0;

    params.push(pageSize, offset);
    const dataQuery = `
      SELECT user_id, nick, nombre, apellidos, email, direccion, localidad, provincia, pais, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY user_id ASC
      LIMIT $${paramCount++} OFFSET $${paramCount}
    `;

    const items = await queryAll<UserRow>(dataQuery, params);

    return {
      items: items.map(row => dbToDto('users', row)),
      total,
      page,
      pageSize,
    };
  }
}



