"use strict";
/**
 * ðŸ—„ï¸ RaceResult Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceResultRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class RaceResultRepository {
    async getAll() {
        const query = `
      SELECT result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
      FROM race_results
      ORDER BY result_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('raceresults', row));
    }
    async getById(id) {
        const query = `
      SELECT result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
      FROM race_results
      WHERE result_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('raceresults', row) : undefined;
    }
    async getByRace(raceId) {
        const query = `
      SELECT result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
      FROM race_results
      WHERE race_id = $1
      ORDER BY posicion ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [raceId]);
        return rows.map(row => (0, database_config_1.dbToDto)('raceresults', row));
    }
    async getByUser(userId) {
        const query = `
      SELECT result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
      FROM race_results
      WHERE user_id = $1
      ORDER BY result_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [userId]);
        return rows.map(row => (0, database_config_1.dbToDto)('raceresults', row));
    }
    async create(raceResult) {
        if (!raceResult.RaceId || !raceResult.UserId) {
            throw new Error('Missing required fields: RaceId, UserId');
        }
        const query = `
      INSERT INTO race_results (race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
    `;
        const params = [
            raceResult.RaceId,
            raceResult.UserId,
            raceResult.Posicion || null,
            raceResult.Vueltas || null,
            raceResult.PrimeraLinea || false,
            raceResult.VueltaRapida || false,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create race result');
        return (0, database_config_1.dbToDto)('raceresults', row);
    }
    async update(id, raceResult) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (raceResult.Posicion !== undefined) {
            updates.push(`posicion = $${paramCount++}`);
            params.push(raceResult.Posicion);
        }
        if (raceResult.Vueltas !== undefined) {
            updates.push(`vueltas = $${paramCount++}`);
            params.push(raceResult.Vueltas);
        }
        if (raceResult.PrimeraLinea !== undefined) {
            updates.push(`primera_linea = $${paramCount++}`);
            params.push(raceResult.PrimeraLinea);
        }
        if (raceResult.VueltaRapida !== undefined) {
            updates.push(`vuelta_rapida = $${paramCount++}`);
            params.push(raceResult.VueltaRapida);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE race_results
      SET ${updates.join(', ')}
      WHERE result_id = $${paramCount}
      RETURNING result_id, race_id, user_id, posicion, vueltas, primera_linea, vuelta_rapida, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('raceresults', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM race_results WHERE result_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM race_results`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.RaceResultRepository = RaceResultRepository;
