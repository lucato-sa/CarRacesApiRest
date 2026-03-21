/**
 * 📋 Level Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Level {
  LevelId?: number;
  Descripcion: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateLevelInput = Omit<Level, 'LevelId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateLevelInput = Partial<Omit<Level, 'LevelId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface LevelRow {
  level_id: number;
  descripcion: string;
  created_at?: Date;
  updated_at?: Date;
}
