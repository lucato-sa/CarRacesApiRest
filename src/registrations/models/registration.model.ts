/**
 * 📋 Registration Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Registration {
  RegistrationId?: number;
  CompetitionId: number;
  UserId: number;
  FechaRegistro?: string;
  Estado?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateRegistrationInput = Omit<Registration, 'RegistrationId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateRegistrationInput = Partial<Omit<Registration, 'RegistrationId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface RegistrationRow {
  registration_id: number;
  competition_id: number;
  user_id: number;
  fecha_registro?: string;
  estado?: string;
  created_at?: Date;
  updated_at?: Date;
}