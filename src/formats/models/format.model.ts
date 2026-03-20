/**
 * 📋 Format Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Format {
  FormatId?: number;
  Alias: string;
  Descripcion?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateFormatInput = Omit<Format, 'FormatId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateFormatInput = Partial<Omit<Format, 'FormatId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface FormatRow {
  format_id: number;
  alias: string;
  descripcion?: string;
  created_at?: Date;
  updated_at?: Date;
}