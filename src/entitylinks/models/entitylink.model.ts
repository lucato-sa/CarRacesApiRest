/**
 * 📋 EntityLink Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface EntityLink {
  EntityLinkId?: number;
  EntityName: string;
  EntityId: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateEntityLinkInput = Omit<EntityLink, 'EntityLinkId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateEntityLinkInput = Partial<Omit<EntityLink, 'EntityLinkId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface EntityLinkRow {
  entity_link_id: number;
  entity_name: string;
  entity_id: number;
  created_at?: Date;
  updated_at?: Date;
}