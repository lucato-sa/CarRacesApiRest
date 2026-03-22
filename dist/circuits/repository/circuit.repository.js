"use strict";
/**
 * 🗄️ Circuit Repository - SQL Nativo con 'pg'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitRepository = void 0;
const data_source_1 = require("../../database/data-source");
const database_config_1 = require("../../config/database.config");
class CircuitRepository {
    async getAll() {
        const query = `
      SELECT circuit_id, venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at
      FROM circuits
      ORDER BY circuit_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query);
        return rows.map(row => (0, database_config_1.dbToDto)('circuits', row));
    }
    async getById(id) {
        const query = `
      SELECT circuit_id, venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at
      FROM circuits
      WHERE circuit_id = $1
      LIMIT 1
    `;
        const row = await (0, data_source_1.queryOne)(query, [id]);
        return row ? (0, database_config_1.dbToDto)('circuits', row) : undefined;
    }
    async getByVenueId(venueId) {
        const query = `
      SELECT circuit_id, venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at
      FROM circuits
      WHERE venue_id = $1
      ORDER BY circuit_id ASC
    `;
        const rows = await (0, data_source_1.queryAll)(query, [venueId]);
        return rows.map(row => (0, database_config_1.dbToDto)('circuits', row));
    }
    async create(circuit) {
        if (!circuit.VenueId || !circuit.Alias) {
            throw new Error('Missing required fields: VenueId, Alias');
        }
        const query = `
      INSERT INTO circuits (venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING circuit_id, venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at
    `;
        const params = [
            circuit.VenueId,
            circuit.SurfaceId || null,
            circuit.DrivingEnviromentId || null,
            circuit.Alias,
            circuit.Descripcion || null,
            circuit.Longitud || null,
            circuit.Permanente || false,
            circuit.TotSegments || null,
            circuit.SlotAnalogic || false,
            circuit.SlotDigital || false,
            circuit.SlotTotLanes || 1,
        ];
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('circuits', row) : {};
    }
    async update(id, circuit) {
        const setClauses = [];
        const params = [];
        let paramCount = 1;
        if (circuit.VenueId !== undefined) {
            setClauses.push(`venue_id = $${paramCount++}`);
            params.push(circuit.VenueId);
        }
        if (circuit.SurfaceId !== undefined) {
            setClauses.push(`surface_id = $${paramCount++}`);
            params.push(circuit.SurfaceId);
        }
        if (circuit.DrivingEnviromentId !== undefined) {
            setClauses.push(`driving_enviroment_id = $${paramCount++}`);
            params.push(circuit.DrivingEnviromentId);
        }
        if (circuit.Alias !== undefined) {
            setClauses.push(`alias = $${paramCount++}`);
            params.push(circuit.Alias);
        }
        if (circuit.Descripcion !== undefined) {
            setClauses.push(`descripcion = $${paramCount++}`);
            params.push(circuit.Descripcion);
        }
        if (circuit.Longitud !== undefined) {
            setClauses.push(`longitud = $${paramCount++}`);
            params.push(circuit.Longitud);
        }
        if (circuit.Permanente !== undefined) {
            setClauses.push(`permanente = $${paramCount++}`);
            params.push(circuit.Permanente);
        }
        if (circuit.TotSegments !== undefined) {
            setClauses.push(`tot_segments = $${paramCount++}`);
            params.push(circuit.TotSegments);
        }
        if (circuit.SlotAnalogic !== undefined) {
            setClauses.push(`slot_analogic = $${paramCount++}`);
            params.push(circuit.SlotAnalogic);
        }
        if (circuit.SlotDigital !== undefined) {
            setClauses.push(`slot_digital = $${paramCount++}`);
            params.push(circuit.SlotDigital);
        }
        if (circuit.SlotTotLanes !== undefined) {
            setClauses.push(`slot_tot_lanes = $${paramCount++}`);
            params.push(circuit.SlotTotLanes);
        }
        setClauses.push(`updated_at = $${paramCount++}`);
        params.push(new Date());
        params.push(id);
        const query = `
      UPDATE circuits
      SET ${setClauses.join(', ')}
      WHERE circuit_id = $${paramCount}
      RETURNING circuit_id, venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at
    `;
        const row = await (0, data_source_1.queryOne)(query, params);
        return row ? (0, database_config_1.dbToDto)('circuits', row) : undefined;
    }
    async delete(id) {
        const query = `DELETE FROM circuits WHERE circuit_id = $1`;
        const result = await (0, data_source_1.executeQuery)(query, [id]);
        return result.rowCount > 0;
    }
}
exports.CircuitRepository = CircuitRepository;
