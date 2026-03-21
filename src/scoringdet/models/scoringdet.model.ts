/**
 * 📋 ScoringDet Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface ScoringDet {
  ScoringDetId?: number;
  ScoringId: number;
  Posicion: number;
  Puntos: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateScoringDetInput = Omit<ScoringDet, 'ScoringDetId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateScoringDetInput = Partial<Omit<ScoringDet, 'ScoringDetId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface ScoringDetRow {
  scoring_det_id: number;
  scoring_id: number;
  posicion: number;
  puntos: number;
  created_at?: Date;
  updated_at?: Date;
}
