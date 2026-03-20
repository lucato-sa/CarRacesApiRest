/**
 * 📋 Competition Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Competition {
  CompetitionId?: number;
  SeasonId?: number;
  EventId?: number;
  VenueId?: number;
  Alias: string;
  TotalRaces?: number;
  FechaInicioInscripPri?: string;
  FechaFinInscripPri?: string;
  FechaInicioInscrip?: string;
  FechaFinInscrip?: string;
  PilotosMinInscrip?: number;
  PilotosMaxInscrip?: number;
  Responsable?: string;
  SoloUsuariosReg?: boolean;
  Notas?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateCompetitionInput = Omit<Competition, 'CompetitionId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateCompetitionInput = Partial<Omit<Competition, 'CompetitionId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface CompetitionRow {
  competition_id: number;
  season_id?: number;
  event_id?: number;
  venue_id?: number;
  alias: string;
  total_races?: number;
  fecha_inicio_inscrip_pri?: string;
  fecha_fin_inscrip_pri?: string;
  fecha_inicio_inscrip?: string;
  fecha_fin_inscrip?: string;
  pilotos_min_inscrip?: number;
  pilotos_max_inscrip?: number;
  responsable?: string;
  solo_usuarios_reg?: boolean;
  notas?: string;
  created_at?: Date;
  updated_at?: Date;
}