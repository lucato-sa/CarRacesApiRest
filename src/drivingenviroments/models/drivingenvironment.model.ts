/**
 * 📋 DrivingEnvironment Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface DrivingEnvironment {
  DrivingEnvironmentId?: number;
  Alias: string;
  Descripcion?: string;
  Default?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateDrivingEnvironmentInput = Omit<DrivingEnvironment, 'DrivingEnvironmentId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateDrivingEnvironmentInput = Partial<Omit<DrivingEnvironment, 'DrivingEnvironmentId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface DrivingEnvironmentRow {
  driving_environment_id: number;
  alias: string;
  descripcion?: string;
  default?: boolean;
  created_at?: Date;
  updated_at?: Date;
}