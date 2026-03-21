/**
 * 📋 Group Model - Tipos TypeScript (sin decoradores de ORM)
 * 
 * Define la estructura del grupo para:
 * ✅ Type safety en TypeScript
 * ✅ Validación de datos
 * ✅ Comunicación entre capas
 */

// DTOs - Lo que viaja en requests/responses (PascalCase)
export interface Group {
  GroupId?: number;
  Descripcion: string;
  DivisionId: number;
  ClubId?: number;
  Default?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

// Tipos de entrada (para crear/actualizar)
export type CreateGroupInput = Omit<Group, 'GroupId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateGroupInput = Partial<Omit<Group, 'GroupId' | 'CreatedAt' | 'UpdatedAt'>>;

// Tipo de fila en BD (snake_case)
export interface GroupRow {
  group_id: number;
  descripcion: string;
  division_id: number;
  club_id?: number;
  default?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
