/**
 * 📋 Club Model - Tipos TypeScript (sin decoradores de ORM)
 * 
 * Define la estructura del club para:
 * ✅ Type safety en TypeScript
 * ✅ Validación de datos
 * ✅ Comunicación entre capas
 */

// DTOs - Lo que viaja en requests/responses (PascalCase)
export interface Club {
  ClubId?: number;
  Alias: string;
  TaxNombre: string;
  TaxNumero: string;
  Descripcion: string;
  FechaFundacion: string;
  Default?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

// Tipos de entrada (para crear/actualizar)
export type CreateClubInput = Omit<Club, 'ClubId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateClubInput = Partial<Omit<Club, 'ClubId' | 'CreatedAt' | 'UpdatedAt'>>;

// Tipo de fila en BD (snake_case)
export interface ClubRow {
  club_id: number;
  alias: string;
  tax_nombre: string;
  tax_numero: string;
  descripcion: string;
  fecha_fundacion: string;
  default?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
