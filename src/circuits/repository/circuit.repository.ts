/**
 * 🗄️ Circuit Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Circuit, CreateCircuitInput, UpdateCircuitInput, CircuitRow } from '../models/circuit.model';
import { dbToDto } from '../../config/database.config';

export class CircuitRepository {
  
  async getAll(): Promise<Circuit[]> {
    const query = `
      SELECT circuit_id, venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at
      FROM circuits
      ORDER BY circuit_id ASC
    `;
    
    const rows = await queryAll<CircuitRow>(query);
    return rows.map(row => dbToDto('circuits', row));
  }

  async getById(id: number): Promise<Circuit | undefined> {
    const query = `
      SELECT circuit_id, venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at
      FROM circuits
      WHERE circuit_id = $1
      LIMIT 1
    `;

    const row = await queryOne<CircuitRow>(query, [id]);
    return row ? dbToDto('circuits', row) : undefined;
  }

  async getByVenueId(venueId: number): Promise<Circuit[]> {
    const query = `
      SELECT circuit_id, venue_id, surface_id, driving_enviroment_id, alias, descripcion, longitud, permanente, tot_segments, slot_analogic, slot_digital, slot_tot_lanes, created_at, updated_at
      FROM circuits
      WHERE venue_id = $1
      ORDER BY circuit_id ASC
    `;

    const rows = await queryAll<CircuitRow>(query, [venueId]);
    return rows.map(row => dbToDto('circuits', row));
  }

  async create(circuit: CreateCircuitInput): Promise<Circuit> {
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

    const row = await queryOne<CircuitRow>(query, params);
    return row ? dbToDto('circuits', row) : ({} as Circuit);
  }

  async update(id: number, circuit: UpdateCircuitInput): Promise<Circuit | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
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

    const row = await queryOne<CircuitRow>(query, params);
    return row ? dbToDto('circuits', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM circuits WHERE circuit_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
