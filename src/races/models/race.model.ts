/**
 * 📋 Race Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Race {
  RaceId?: number;
  CompetitionId: number;
  NumRace: number;
  Fecha: string;
  Hora?: string;
  Estado?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateRaceInput = Omit<Race, 'RaceId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateRaceInput = Partial<Omit<Race, 'RaceId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface RaceRow {
  race_id: number;
  competition_id: number;
  num_race: number;
  fecha: string;
  hora?: string;
  estado?: string;
  created_at?: Date;
  updated_at?: Date;
}