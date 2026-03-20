/**
 * 📋 Discipline Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Discipline {
  DisciplineId?: number;
  SpecialityId?: number;
  FormatId?: number;
  SurfaceId?: number;
  Alias: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateDisciplineInput = Omit<Discipline, 'DisciplineId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateDisciplineInput = Partial<Omit<Discipline, 'DisciplineId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface DisciplineRow {
  discipline_id: number;
  speciality_id?: number;
  format_id?: number;
  surface_id?: number;
  alias: string;
  created_at?: Date;
  updated_at?: Date;
}