/**
 * 📋 Championship Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Championship {
  ChampionshipId?: number;
  Alias: string;
  Descripcion?: string;
  ClubId?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateChampionshipInput = Omit<Championship, 'ChampionshipId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateChampionshipInput = Partial<Omit<Championship, 'ChampionshipId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface ChampionshipRow {
  championship_id: number;
  alias: string;
  descripcion?: string;
  club_id?: number;
  created_at?: Date;
  updated_at?: Date;
}