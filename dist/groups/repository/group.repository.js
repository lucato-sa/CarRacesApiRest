"use strict";
/**
 * 🗄️ Group Repository - SQL Nativo con 'pg'
 *
 * Acceso a datos usando SQL explícito
 * ✅ Control total de queries
 * ✅ Fácil debugging
 * ✅ Mejor performance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
/**
 * Repository para operaciones CRUD de Groups
 * Mapea automáticamente entre DTO (PascalCase) y BD (snake_case)
 */
class GroupRepository {
    /**
     * Obtener todos los grupos
     */
    async getAll() {
        const query = `
      SELECT group_id, descripcion, division_id, club_id, "default", created_at, updated_at
      FROM groups
      ORDER BY group_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('groups', row));
    }
    /**
     * Obtener un grupo por ID
     */
    async getById(id) {
        const query = `
      SELECT group_id, descripcion, division_id, club_id, "default", created_at, updated_at
      FROM groups
      WHERE group_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('groups', row) : undefined;
    }
    /**
     * Obtener grupos por DivisionId
     */
    async getByDivisionId(divisionId) {
        const query = `
      SELECT group_id, descripcion, division_id, club_id, "default", created_at, updated_at
      FROM groups
      WHERE division_id = $1
      ORDER BY group_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [divisionId]);
        return rows.map(row => (0, database_config_1.dbToDto)('groups', row));
    }
    /**
     * Obtener grupos por ClubId
     */
    async getByClubId(clubId) {
        const query = `
      SELECT group_id, descripcion, division_id, club_id, "default", created_at, updated_at
      FROM groups
      WHERE club_id = $1
      ORDER BY group_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [clubId]);
        return rows.map(row => (0, database_config_1.dbToDto)('groups', row));
    }
    /**
     * Crear nuevo grupo
     */
    async create(group) {
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
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('groups', row) : {};
    }
    /**
     * Actualizar un grupo
     */
    async update(id, group) {
        const setClauses = [];
        const params = [];
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
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('groups', row) : undefined;
    }
    /**
     * Eliminar un grupo
     */
    async delete(id) {
        const query = `DELETE FROM groups WHERE group_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return result.rowCount > 0;
    }
}
exports.GroupRepository = GroupRepository;
