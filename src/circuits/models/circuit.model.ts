/**
 * 📋 Circuit Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Circuit {
  CircuitId?: number;
  VenueId: number;
  SurfaceId?: number;
  DrivingEnviromentId?: number;
  Alias: string;
  Descripcion?: string;
  Longitud?: number;
  Permanente?: boolean;
  TotSegments?: number;
  SlotAnalogic?: boolean;
  SlotDigital?: boolean;
  SlotTotLanes?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateCircuitInput = Omit<Circuit, 'CircuitId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateCircuitInput = Partial<Omit<Circuit, 'CircuitId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface CircuitRow {
  circuit_id: number;
  venue_id: number;
  surface_id?: number;
  driving_enviroment_id?: number;
  alias: string;
  descripcion?: string;
  longitud?: number;
  permanente?: boolean;
  tot_segments?: number;
  slot_analogic?: boolean;
  slot_digital?: boolean;
  slot_tot_lanes?: number;
  created_at?: Date;
  updated_at?: Date;
}
