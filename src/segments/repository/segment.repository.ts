/**
 * 🗄️ Segment Repository - SQL Nativo con 'pg'
 */

import { queryAll, queryOne, executeQuery } from '../../database/data-source';
import { Segment, CreateSegmentInput, UpdateSegmentInput, SegmentRow } from '../models/segment.model';
import { dbToDto } from '../../config/database.config';

export class SegmentRepository {
  
  async getAll(): Promise<Segment[]> {
    const query = `
      SELECT segment_id, circuit_id, alias, num_segment, num_lane, tot_sections, longitud, created_at, updated_at
      FROM segments
      ORDER BY segment_id ASC
    `;
    
    const rows = await queryAll<SegmentRow>(query);
    return rows.map(row => dbToDto('segments', row));
  }

  async getById(id: number): Promise<Segment | undefined> {
    const query = `
      SELECT segment_id, circuit_id, alias, num_segment, num_lane, tot_sections, longitud, created_at, updated_at
      FROM segments
      WHERE segment_id = $1
      LIMIT 1
    `;

    const row = await queryOne<SegmentRow>(query, [id]);
    return row ? dbToDto('segments', row) : undefined;
  }

  async getByCircuitId(circuitId: number): Promise<Segment[]> {
    const query = `
      SELECT segment_id, circuit_id, alias, num_segment, num_lane, tot_sections, longitud, created_at, updated_at
      FROM segments
      WHERE circuit_id = $1
      ORDER BY num_segment ASC
    `;

    const rows = await queryAll<SegmentRow>(query, [circuitId]);
    return rows.map(row => dbToDto('segments', row));
  }

  async create(segment: CreateSegmentInput): Promise<Segment> {
    if (!segment.CircuitId || !segment.Alias || segment.NumSegment === undefined) {
      throw new Error('Missing required fields: CircuitId, Alias, NumSegment');
    }

    const query = `
      INSERT INTO segments (circuit_id, alias, num_segment, num_lane, tot_sections, longitud, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING segment_id, circuit_id, alias, num_segment, num_lane, tot_sections, longitud, created_at, updated_at
    `;

    const params = [
      segment.CircuitId,
      segment.Alias,
      segment.NumSegment,
      segment.NumLane || null,
      segment.TotSections || null,
      segment.Longitud || null,
    ];

    const row = await queryOne<SegmentRow>(query, params);
    return row ? dbToDto('segments', row) : ({} as Segment);
  }

  async update(id: number, segment: UpdateSegmentInput): Promise<Segment | undefined> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (segment.CircuitId !== undefined) {
      setClauses.push(`circuit_id = $${paramCount++}`);
      params.push(segment.CircuitId);
    }
    if (segment.Alias !== undefined) {
      setClauses.push(`alias = $${paramCount++}`);
      params.push(segment.Alias);
    }
    if (segment.NumSegment !== undefined) {
      setClauses.push(`num_segment = $${paramCount++}`);
      params.push(segment.NumSegment);
    }
    if (segment.NumLane !== undefined) {
      setClauses.push(`num_lane = $${paramCount++}`);
      params.push(segment.NumLane);
    }
    if (segment.TotSections !== undefined) {
      setClauses.push(`tot_sections = $${paramCount++}`);
      params.push(segment.TotSections);
    }
    if (segment.Longitud !== undefined) {
      setClauses.push(`longitud = $${paramCount++}`);
      params.push(segment.Longitud);
    }

    setClauses.push(`updated_at = $${paramCount++}`);
    params.push(new Date());
    params.push(id);

    const query = `
      UPDATE segments
      SET ${setClauses.join(', ')}
      WHERE segment_id = $${paramCount}
      RETURNING segment_id, circuit_id, alias, num_segment, num_lane, tot_sections, longitud, created_at, updated_at
    `;

    const row = await queryOne<SegmentRow>(query, params);
    return row ? dbToDto('segments', row) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM segments WHERE segment_id = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount > 0;
  }
}
