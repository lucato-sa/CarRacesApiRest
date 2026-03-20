/**
 * ðŸ—„ï¸ Club Repository - SQL Nativo con 'pg'
 * 
 * Acceso a datos usando SQL explÃ­cito
 * âœ… Control total de queries
 * âœ… FÃ¡cil debugging
 * âœ… Mejor performance
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Club, CreateClubInput, UpdateClubInput, ClubRow } from '../models/club.model';
import { dbToDto } from '../../config/database.config';

/**
 * Repository para operaciones CRUD de Clubs
 * Mapea automÃ¡ticamente entre DTO (PascalCase) y BD (snake_case)
 */
export class ClubRepository {
  
  /**
   * Obtener todos los clubs
   */
  async getAll(): Promise<Club[]> {
    const query = `
      SELECT club_id, alias, tax_nombre, tax_numero, descripcion, fecha_fundacion, "default", created_at, updated_at
      FROM clubs
      ORDER BY club_id ASC
    `;
    
    const rows = await queryAll<ClubRow>(query);
    return rows.map(row => dbToDto('clubs', row));
  }

  /**
   * Obtener un club por ID
   */
  async getById(id: number): Promise<Club | undefined> {
    const query = `
      SELECT club_id, alias, tax_nombre, tax_numero, descripcion, fecha_fundacion, "default", created_at, updated_at
      FROM clubs
      WHERE club_id = $1
      LIMIT 1
    `;

    const row = await queryOne<ClubRow>(query, [id]);
    return row ? dbToDto('clubs', row) : undefined;
  }

  /**
   * Obtener un club por Alias (Ãºnico)
   */
  async getByAlias(alias: string): Promise<Club | undefined> {
    const query = `
      SELECT club_id, alias, tax_nombre, tax_numero, descripcion, fecha_fundacion, "default", created_at, updated_at
      FROM clubs
      WHERE alias = $1
      LIMIT 1
    `;

    const row = await queryOne<ClubRow>(query, [alias]);
    return row ? dbToDto('clubs', row) : undefined;
  }

  /**
   * Crear nuevo club
   */
  async create(club: CreateClubInput): Promise<Club> {
    // Validar campos requeridos
    if (!club.Alias || !club.TaxNombre || !club.TaxNumero || !club.Descripcion || !club.FechaFundacion) {
      throw new Error('Missing required fields: Alias, TaxNombre, TaxNumero, Descripcion, FechaFundacion');
    }

    const query = `
      INSERT INTO clubs (alias, tax_nombre, tax_numero, descripcion, fecha_fundacion, "default", created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING club_id, alias, tax_nombre, tax_numero, descripcion, fecha_fundacion, "default", created_at, updated_at
    `;

    const params = [
      club.Alias,
      club.TaxNombre,
      club.TaxNumero,
      club.Descripcion,
      club.FechaFundacion,
      club.Default || false,
    ];

    const row = await queryOne<ClubRow>(query, params);
    if (!row) throw new Error('Failed to create club');
    
    return dbToDto('clubs', row);
  }

  /**
   * Actualizar club existente
   */
  async update(id: number, club: UpdateClubInput): Promise<Club | undefined> {
    // Verificar que existe
    const existing = await this.getById(id);
    if (!existing) return undefined;

    // Construir queries UPDATE dinÃ¡micamente
    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (club.Alias !== undefined) {
      updates.push(`alias = $${paramCount++}`);
      params.push(club.Alias);
    }
    if (club.TaxNombre !== undefined) {
      updates.push(`tax_nombre = $${paramCount++}`);
      params.push(club.TaxNombre);
    }
    if (club.TaxNumero !== undefined) {
      updates.push(`tax_numero = $${paramCount++}`);
      params.push(club.TaxNumero);
    }
    if (club.Descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      params.push(club.Descripcion);
    }
    if (club.FechaFundacion !== undefined) {
      updates.push(`fecha_fundacion = $${paramCount++}`);
      params.push(club.FechaFundacion);
    }
    if (club.Default !== undefined) {
      updates.push(`default = $${paramCount++}`);
      params.push(club.Default);
    }

    if (updates.length === 0) return existing; // Sin cambios

    // Agregar timestamp updated_at
    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE clubs
      SET ${updates.join(', ')}
      WHERE club_id = $${paramCount}
      RETURNING club_id, alias, tax_nombre, tax_numero, descripcion, fecha_fundacion, "default", created_at, updated_at
    `;

    const row = await queryOne<ClubRow>(query, params);
    return row ? dbToDto('clubs', row) : undefined;
  }

  /**
   * Eliminar club por ID
   */
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM clubs WHERE club_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Contar total de clubs
   */
  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM clubs`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }

  /**
   * BÃºsqueda con filtros y paginaciÃ³n
   */
  async search(filters?: {
    alias?: string;
    q?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: Club[]; total: number; page: number; pageSize: number }> {
    const page = Math.max(1, filters?.page || 1);
    const pageSize = Math.max(1, filters?.pageSize || 20);
    const offset = (page - 1) * pageSize;

    let whereConditions = [];
    let params: any[] = [];
    let paramCount = 1;

    if (filters?.alias) {
      whereConditions.push(`alias = $${paramCount++}`);
      params.push(filters.alias);
    }

    if (filters?.q) {
      whereConditions.push(`(alias ILIKE $${paramCount} OR tax_nombre ILIKE $${paramCount})`);
      params.push(`%${filters.q}%`);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Total count
    const countQuery = `SELECT COUNT(*) as total FROM clubs ${whereClause}`;
    const countResult = await queryOne<{ total: string }>(countQuery, params);
    const total = countResult ? parseInt(countResult.total) : 0;

    // Data con paginaciÃ³n
    params.push(pageSize, offset);
    const dataQuery = `
      SELECT club_id, alias, tax_nombre, tax_numero, descripcion, fecha_fundacion, "default", created_at, updated_at
      FROM clubs
      ${whereClause}
      ORDER BY club_id ASC
      LIMIT $${paramCount++} OFFSET $${paramCount}
    `;

    const items = await queryAll<ClubRow>(dataQuery, params);

    return {
      items: items.map(row => dbToDto('clubs', row)),
      total,
      page,
      pageSize,
    };
  }
}

