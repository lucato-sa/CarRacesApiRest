/**
 * 📋 Segment Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Segment {
  SegmentId?: number;
  CircuitId: number;
  Alias: string;
  NumSegment: number;
  NumLane?: number;
  TotSections?: number;
  Longitud?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateSegmentInput = Omit<Segment, 'SegmentId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateSegmentInput = Partial<Omit<Segment, 'SegmentId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface SegmentRow {
  segment_id: number;
  circuit_id: number;
  alias: string;
  num_segment: number;
  num_lane?: number;
  tot_sections?: number;
  longitud?: number;
  created_at?: Date;
  updated_at?: Date;
}
