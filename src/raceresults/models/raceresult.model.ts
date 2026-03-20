/**
 * 📋 RaceResult Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface RaceResult {
  ResultId?: number;
  RaceId: number;
  UserId: number;
  Posicion?: number;
  Vueltas?: number;
  PrimeraLinea?: boolean;
  VueltaRapida?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateRaceResultInput = Omit<RaceResult, 'ResultId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateRaceResultInput = Partial<Omit<RaceResult, 'ResultId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface RaceResultRow {
  result_id: number;
  race_id: number;
  user_id: number;
  posicion?: number;
  vueltas?: number;
  primera_linea?: boolean;
  vuelta_rapida?: boolean;
  created_at?: Date;
  updated_at?: Date;
}