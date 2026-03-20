/**
 * 📋 RoleEntity Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface RoleEntity {
  RolEntityId?: number;
  EntityLinkId: number;
  RolId: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateRoleEntityInput = Omit<RoleEntity, 'RolEntityId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateRoleEntityInput = Partial<Omit<RoleEntity, 'RolEntityId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface RoleEntityRow {
  rol_entity_id: number;
  entity_link_id: number;
  rol_id: number;
  created_at?: Date;
  updated_at?: Date;
}