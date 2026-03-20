/**
 * 📋 Speciality Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Speciality {
  SpecialityId?: number;
  Alias: string;
  Descripcion?: string;
  Default?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateSpecialityInput = Omit<Speciality, 'SpecialityId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateSpecialityInput = Partial<Omit<Speciality, 'SpecialityId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface SpecialityRow {
  speciality_id: number;
  alias: string;
  descripcion?: string;
  default?: boolean;
  created_at?: Date;
  updated_at?: Date;
}