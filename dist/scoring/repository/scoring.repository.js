"use strict";
/**
 * 🗄️ Scoring Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class ScoringRepository {
    async getAll() {
        const query = `
      SELECT scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
      FROM scoring
      ORDER BY scoring_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('scoring', row));
    }
    async getById(id) {
        const query = `
      SELECT scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
      FROM scoring
      WHERE scoring_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('scoring', row) : undefined;
    }
    async getByClubId(clubId) {
        const query = `
      SELECT scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
      FROM scoring
      WHERE club_id = $1
      ORDER BY scoring_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [clubId]);
        return rows.map(row => (0, database_config_1.dbToDto)('scoring', row));
    }
    async create(scoring) {
        if (!scoring.Descripcion) {
            throw new Error('Missing required field: Descripcion');
        }
        const query = `
      INSERT INTO scoring (descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
    `;
        const params = [
            scoring.Descripcion,
            scoring.ClubId || null,
            scoring.UltPosPuntos || null,
            scoring.PuntosDefecto || null,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('scoring', row) : {};
    }
    async update(id, scoring) {
        const setClauses = [];
        const params = [];
        let paramCount = 1;
        if (scoring.Descripcion !== undefined) {
            setClauses.push(`descripcion = $${paramCount++}`);
            params.push(scoring.Descripcion);
        }
        if (scoring.ClubId !== undefined) {
            setClauses.push(`club_id = $${paramCount++}`);
            params.push(scoring.ClubId);
        }
        if (scoring.UltPosPuntos !== undefined) {
            setClauses.push(`ult_pos_puntos = $${paramCount++}`);
            params.push(scoring.UltPosPuntos);
        }
        if (scoring.PuntosDefecto !== undefined) {
            setClauses.push(`puntos_defecto = $${paramCount++}`);
            params.push(scoring.PuntosDefecto);
        }
        setClauses.push(`updated_at = $${paramCount++}`);
        params.push(new Date());
        params.push(id);
        const query = `
      UPDATE scoring
      SET ${setClauses.join(', ')}
      WHERE scoring_id = $${paramCount}
      RETURNING scoring_id, descripcion, club_id, ult_pos_puntos, puntos_defecto, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('scoring', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM scoring WHERE scoring_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return result.rowCount > 0;
    }
}
exports.ScoringRepository = ScoringRepository;
