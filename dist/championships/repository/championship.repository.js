"use strict";
/**
 * ðŸ—„ï¸ Championship Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChampionshipRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class ChampionshipRepository {
    async getAll() {
        const query = `
      SELECT championship_id, alias, descripcion, club_id, created_at, updated_at
      FROM championships
      ORDER BY championship_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('championships', row));
    }
    async getById(id) {
        const query = `
      SELECT championship_id, alias, descripcion, club_id, created_at, updated_at
      FROM championships
      WHERE championship_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('championships', row) : undefined;
    }
    async getByAlias(alias) {
        const query = `
      SELECT championship_id, alias, descripcion, club_id, created_at, updated_at
      FROM championships
      WHERE alias = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [alias]);
        return row ? (0, database_config_1.dbToDto)('championships', row) : undefined;
    }
    async getByClub(clubId) {
        const query = `
      SELECT championship_id, alias, descripcion, club_id, created_at, updated_at
      FROM championships
      WHERE club_id = $1
      ORDER BY championship_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [clubId]);
        return rows.map(row => (0, database_config_1.dbToDto)('championships', row));
    }
    async create(championship) {
        if (!championship.Alias) {
            throw new Error('Missing required field: Alias');
        }
        const query = `
      INSERT INTO championships (alias, descripcion, club_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING championship_id, alias, descripcion, club_id, created_at, updated_at
    `;
        const params = [
            championship.Alias,
            championship.Descripcion || null,
            championship.ClubId || null,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create championship');
        return (0, database_config_1.dbToDto)('championships', row);
    }
    async update(id, championship) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (championship.Alias !== undefined) {
            updates.push(`alias = $${paramCount++}`);
            params.push(championship.Alias);
        }
        if (championship.Descripcion !== undefined) {
            updates.push(`descripcion = $${paramCount++}`);
            params.push(championship.Descripcion || null);
        }
        if (championship.ClubId !== undefined) {
            updates.push(`club_id = $${paramCount++}`);
            params.push(championship.ClubId || null);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE championships
      SET ${updates.join(', ')}
      WHERE championship_id = $${paramCount}
      RETURNING championship_id, alias, descripcion, club_id, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('championships', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM championships WHERE championship_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM championships`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.ChampionshipRepository = ChampionshipRepository;
