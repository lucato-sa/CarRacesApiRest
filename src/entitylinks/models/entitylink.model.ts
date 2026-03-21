/**
 * 📋 EntityLink Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface EntityLink {
  EntityLinkId?: number;
  EntityName: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateEntityLinkInput = Omit<EntityLink, 'EntityLinkId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateEntityLinkInput = Partial<Omit<EntityLink, 'EntityLinkId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface EntityLinkRow {
  entity_link_id: number;
  entity_name: string;
  created_at?: Date;
  updated_at?: Date;
}