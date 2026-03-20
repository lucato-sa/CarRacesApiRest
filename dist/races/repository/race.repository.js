"use strict";
/**
 * ðŸ—„ï¸ Race Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class RaceRepository {
    async getAll() {
        const query = `
      SELECT race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
      FROM races
      ORDER BY race_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('races', row));
    }
    async getById(id) {
        const query = `
      SELECT race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
      FROM races
      WHERE race_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('races', row) : undefined;
    }
    async getByCompetition(competitionId) {
        const query = `
      SELECT race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
      FROM races
      WHERE competition_id = $1
      ORDER BY num_race ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [competitionId]);
        return rows.map(row => (0, database_config_1.dbToDto)('races', row));
    }
    async create(race) {
        if (!race.CompetitionId || !race.NumRace || !race.Fecha) {
            throw new Error('Missing required fields: CompetitionId, NumRace, Fecha');
        }
        const query = `
      INSERT INTO races (competition_id, num_race, fecha, hora, estado, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
    `;
        const params = [
            race.CompetitionId,
            race.NumRace,
            race.Fecha,
            race.Hora || null,
            race.Estado || 'PENDING',
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        if (!row)
            throw new Error('Failed to create race');
        return (0, database_config_1.dbToDto)('races', row);
    }
    async update(id, race) {
        const existing = await this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        let paramCount = 1;
        if (race.NumRace !== undefined) {
            updates.push(`num_race = $${paramCount++}`);
            params.push(race.NumRace);
        }
        if (race.Fecha !== undefined) {
            updates.push(`fecha = $${paramCount++}`);
            params.push(race.Fecha);
        }
        if (race.Hora !== undefined) {
            updates.push(`hora = $${paramCount++}`);
            params.push(race.Hora || null);
        }
        if (race.Estado !== undefined) {
            updates.push(`estado = $${paramCount++}`);
            params.push(race.Estado);
        }
        if (updates.length === 0)
            return existing;
        updates.push(`updated_at = NOW()`);
        params.push(id);
        const query = `
      UPDATE races
      SET ${updates.join(', ')}
      WHERE race_id = $${paramCount}
      RETURNING race_id, competition_id, num_race, fecha, hora, estado, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('races', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM races WHERE race_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    async count() {
        const query = `SELECT COUNT(*) as total FROM races`;
        const row = await (0, data_source_1.queryOne)(query);
        return row ? parseInt(row.total) : 0;
    }
}
exports.RaceRepository = RaceRepository;
