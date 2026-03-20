/**
 * ðŸ—„ï¸ Role Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Role, CreateRoleInput, UpdateRoleInput, RoleRow } from '../models/role.model';
import { dbToDto } from '../../config/database.config';

export class RoleRepository {
  
  async getAll(): Promise<Role[]> {
    const query = `
      SELECT rol_id, nombre, pseudonimo, created_at, updated_at
      FROM roles
      ORDER BY rol_id ASC
    `;
    
    const rows = await queryAll<RoleRow>(query);
    return rows.map(row => dbToDto('roles', row));
  }

  async getById(id: number): Promise<Role | undefined> {
    const query = `
      SELECT rol_id, nombre, pseudonimo, created_at, updated_at
      FROM roles
      WHERE rol_id = $1
      LIMIT 1
    `;

    const row = await queryOne<RoleRow>(query, [id]);
    return row ? dbToDto('roles', row) : undefined;
  }

  async getByNombre(nombre: string): Promise<Role | undefined> {
    const query = `
      SELECT rol_id, nombre, pseudonimo, created_at, updated_at
      FROM roles
      WHERE nombre = $1
      LIMIT 1
    `;

    const row = await queryOne<RoleRow>(query, [nombre]);
    return row ? dbToDto('roles', row) : undefined;
  }

  async create(role: CreateRoleInput): Promise<Role> {
    if (!role.Nombre) {
      throw new Error('Missing required field: Nombre');
    }

    const query = `
      INSERT INTO roles (nombre, pseudonimo, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING rol_id, nombre, pseudonimo, created_at, updated_at
    `;

    const params = [
      role.Nombre,
      role.Pseudonimo || null,
    ];

    const row = await queryOne<RoleRow>(query, params);
    if (!row) throw new Error('Failed to create role');
    
    return dbToDto('roles', row);
  }

  async update(id: number, role: UpdateRoleInput): Promise<Role | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (role.Nombre !== undefined) {
      updates.push(`nombre = $${paramCount++}`);
      params.push(role.Nombre);
    }
    if (role.Pseudonimo !== undefined) {
      updates.push(`pseudonimo = $${paramCount++}`);
      params.push(role.Pseudonimo || null);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const query = `
      UPDATE roles
      SET ${updates.join(', ')}
      WHERE rol_id = $${paramCount}
      RETURNING rol_id, nombre, pseudonimo, created_at, updated_at
    `;

    const row = await queryOne<RoleRow>(query, params);
    return row ? dbToDto('roles', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM roles WHERE rol_id = $1`;
    const result = await executeQuery(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM roles`;
    const row = await queryOne<{ total: string }>(query);
    return row ? parseInt(row.total) : 0;
  }
}

