/**
 * 📋 Scoring Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Scoring {
  ScoringId?: number;
  Descripcion: string;
  ClubId?: number;
  UltPosPuntos?: number;
  PuntosDefecto?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateScoringInput = Omit<Scoring, 'ScoringId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateScoringInput = Partial<Omit<Scoring, 'ScoringId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface ScoringRow {
  scoring_id: number;
  descripcion: string;
  club_id?: number;
  ult_pos_puntos?: number;
  puntos_defecto?: number;
  created_at?: Date;
  updated_at?: Date;
}
