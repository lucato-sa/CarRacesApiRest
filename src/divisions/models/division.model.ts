/**
 * 📋 Division Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Division {
  DivisionId?: number;
  DisciplineId?: number;
  Alias: string;
  Descripcion?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateDivisionInput = Omit<Division, 'DivisionId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateDivisionInput = Partial<Omit<Division, 'DivisionId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface DivisionRow {
  division_id: number;
  discipline_id?: number;
  alias: string;
  descripcion?: string;
  created_at?: Date;
  updated_at?: Date;
}