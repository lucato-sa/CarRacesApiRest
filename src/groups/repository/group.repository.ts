/**
 * 🗄️ Group Repository - SQL Nativo con 'pg'
 * 
 * Acceso a datos usando SQL explícito
 * ✅ Control total de queries
 * ✅ Fácil debugging
 * ✅ Mejor performance
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Group, CreateGroupInput, UpdateGroupInput, GroupRow } from '../models/group.model';
import { dbToDto } from '../../config/database.config';

/**
 * Repository para operaciones CRUD de Groups
 * Mapea automáticamente entre DTO (PascalCase) y BD (snake_case)
 */
export class GroupRepository {
  
  /**
   * Obtener todos los grupos
   */
  async getAll(): Promise<Group[]> {
    const query = `
      SELECT group_id, descripcion, division_id, club_id, "default", created_at, updated_at
      FROM groups
      ORDER BY group_id ASC
    `;
    
    const rows = await queryAll<GroupRow>(query);
    return rows.map(row => dbToDto('groups', row));
  }

  /**
   * Obtener un grupo por ID
   */
  async getById(id: number): Promise<Group | undefined> {
    const query = `
      SELECT group_id, descripcion, division_id, club_id, "default", created_at, updated_at
      FROM groups
      WHERE group_id = $1
      LIMIT 1
    `;

    const row = await queryOne<GroupRow>(query, [id]);
    return row ? dbToDto('groups', row) : undefined;
  }

  /**
   * Obtener grupos por DivisionId
   */
  async getByDivisionId(divisionId: number): Promise<Group[]> {
    const query = `
      SELECT group_id, descripcion, division_id, club_id, "default", created_at, updated_at
      FROM groups
      WHERE division_id = $1
      ORDER BY group_id ASC
    `;

    const rows = await queryAll<GroupRow>(query, [divisionId]);
    return rows.map(row => dbToDto('groups', row));
  }

  /**
   * Obtener grupos por ClubId
   */
  async getByClubId(clubId: number): Promise<Group[]> {
    const query = `
      SELECT group_id, descripcion, division_id, club_id, "default", created_at, updated_at
      FROM groups
      WHERE club_id = $1
      ORDER BY group_id ASC
    `;

    const rows = await queryAll<GroupRow>(query, [clubId]);
    return rows.map(row => dbToDto('groups', row));
  }

  /**
   * Crear nuevo grupo
   */
  async create(group: CreateGroupInput): Promise<Group> {
    // Validar campos requeridos
    if (!group.Descripcion || group.DivisionId === undefined) {
      throw new Error('Missing required fields: Descripcion, DivisionId');
    }

    const query = `
      INSERT INTO groups (descripcion, division_id, club_id, "default", created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING group_id, descripcion, division_id, club_id, "default", created_at, updated_at
    `;

    const params = [
      group.Descripcion,
      group.DivisionId,
      group.ClubId || null,
      group.Default || false,
    ];

    const row = await queryOne<GroupRow>(query, params);
    return row ? dbToDto('groups', row) : ({} as Group);
  }

  /**
   * Actualizar un grupo
   */
  async update(id: number, group: UpdateGroupInput): Promise<Group | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (group.Descripcion !== undefined) {
      setClauses.push(`descripcion = $${paramCount++}`);
      params.push(group.Descripcion);
    }
    if (group.DivisionId !== undefined) {
      setClauses.push(`division_id = $${paramCount++}`);
      params.push(group.DivisionId);
    }
    if (group.ClubId !== undefined) {
      setClauses.push(`club_id = $${paramCount++}`);
      params.push(group.ClubId);
    }
    if (group.Default !== undefined) {
      setClauses.push(`"default" = $${paramCount++}`);
      params.push(group.Default);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());

    params.push(id);

    const query = `
      UPDATE groups
      SET ${setClauses.join(', ')}
      WHERE group_id = $${paramCount}
      RETURNING group_id, descripcion, division_id, club_id, "default", created_at, updated_at
    `;

    const row = await queryOne<GroupRow>(query, params);
    return row ? dbToDto('groups', row) : undefined;
  }

  /**
   * Eliminar un grupo
   */
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM groups WHERE group_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
