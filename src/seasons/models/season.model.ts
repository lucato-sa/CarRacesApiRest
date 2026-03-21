/**
 * 📋 Season Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Season {
  SeasonId?: number;
  ChampionshipId: number;
  Descripcion: string;
  FechaDesde: string;
  FechaHasta: string;
  PilotosMin?: number;
  PilotosMax?: number;
  SoloSocios?: boolean;
  RulebookId?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateSeasonInput = Omit<Season, 'SeasonId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateSeasonInput = Partial<Omit<Season, 'SeasonId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface SeasonRow {
  season_id: number;
  championship_id: number;
  descripcion: string;
  fecha_desde: string;
  fecha_hasta: string;
  pilotos_min?: number;
  pilotos_max?: number;
  solo_socios?: boolean;
  rulebook_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
