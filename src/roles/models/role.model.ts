/**
 * 📋 Role Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Role {
  RolId?: number;
  Nombre: string;
  Pseudonimo?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateRoleInput = Omit<Role, 'RolId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateRoleInput = Partial<Omit<Role, 'RolId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface RoleRow {
  rol_id: number;
  nombre: string;
  pseudonimo?: string;
  created_at?: Date;
  updated_at?: Date;
}