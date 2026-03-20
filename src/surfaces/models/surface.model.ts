/**
 * 📋 Surface Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Surface {
  SurfaceId?: number;
  Alias: string;
  Descripcion?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateSurfaceInput = Omit<Surface, 'SurfaceId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateSurfaceInput = Partial<Omit<Surface, 'SurfaceId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface SurfaceRow {
  surface_id: number;
  alias: string;
  descripcion?: string;
  created_at?: Date;
  updated_at?: Date;
}