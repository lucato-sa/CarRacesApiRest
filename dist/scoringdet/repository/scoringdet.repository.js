"use strict";
/**
 * 🗄️ ScoringDet Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringDetRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class ScoringDetRepository {
    async getAll() {
        const query = `
      SELECT scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
      FROM scoring_det
      ORDER BY scoring_det_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('scoringdet', row));
    }
    async getById(id) {
        const query = `
      SELECT scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
      FROM scoring_det
      WHERE scoring_det_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('scoringdet', row) : undefined;
    }
    async getByScoringId(scoringId) {
        const query = `
      SELECT scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
      FROM scoring_det
      WHERE scoring_id = $1
      ORDER BY posicion ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [scoringId]);
        return rows.map(row => (0, database_config_1.dbToDto)('scoringdet', row));
    }
    async create(scoringDet) {
        if (!scoringDet.ScoringId || scoringDet.Posicion === undefined || scoringDet.Puntos === undefined) {
            throw new Error('Missing required fields: ScoringId, Posicion, Puntos');
        }
        const query = `
      INSERT INTO scoring_det (scoring_id, posicion, puntos, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
    `;
        const params = [scoringDet.ScoringId, scoringDet.Posicion, scoringDet.Puntos];
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('scoringdet', row) : {};
    }
    async update(id, scoringDet) {
        const setClauses = [];
        const params = [];
        let paramCount = 1;
        if (scoringDet.ScoringId !== undefined) {
            setClauses.push(`scoring_id = $${paramCount++}`);
            params.push(scoringDet.ScoringId);
        }
        if (scoringDet.Posicion !== undefined) {
            setClauses.push(`posicion = $${paramCount++}`);
            params.push(scoringDet.Posicion);
        }
        if (scoringDet.Puntos !== undefined) {
            setClauses.push(`puntos = $${paramCount++}`);
            params.push(scoringDet.Puntos);
        }
        setClauses.push(`updated_at = $${paramCount++}`);
        params.push(new Date());
        params.push(id);
        const query = `
      UPDATE scoring_det
      SET ${setClauses.join(', ')}
      WHERE scoring_det_id = $${paramCount}
      RETURNING scoring_det_id, scoring_id, posicion, puntos, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('scoringdet', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM scoring_det WHERE scoring_det_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return result.rowCount > 0;
    }
}
exports.ScoringDetRepository = ScoringDetRepository;
