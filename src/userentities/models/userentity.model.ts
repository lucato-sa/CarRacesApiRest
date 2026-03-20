/**
 * 📋 UserEntity Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface UserEntity {
  UserEntityId?: number;
  UserId: number;
  EntityLinkId: number;
  RolId: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateUserEntityInput = Omit<UserEntity, 'UserEntityId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateUserEntityInput = Partial<Omit<UserEntity, 'UserEntityId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface UserEntityRow {
  user_entity_id: number;
  user_id: number;
  entity_link_id: number;
  rol_id: number;
  created_at?: Date;
  updated_at?: Date;
}