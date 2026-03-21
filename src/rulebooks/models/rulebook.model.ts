/**
 * 📋 Rulebook Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Rulebook {
  RulebookId?: number;
  Descripcion: string;
  FechaInicioValido: string;
  FechaFinValido?: string;
  DivisionId?: number;
  GroupId?: number;
  ClubId?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateRulebookInput = Omit<Rulebook, 'RulebookId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateRulebookInput = Partial<Omit<Rulebook, 'RulebookId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface RulebookRow {
  rulebook_id: number;
  descripcion: string;
  fecha_inicio_valido: string;
  fecha_fin_valido?: string;
  division_id?: number;
  group_id?: number;
  club_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
