/**
 * 📋 Venue Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Venue {
  VenueId?: number;
  ClubId: number;
  Alias: string;
  SedeSocial?: boolean;
  SedeCarreras?: boolean;
  Direccion?: string;
  Localidad?: string;
  Provincia?: string;
  Pais?: string;
  MapLatitud?: number;
  MapLongitud?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateVenueInput = Omit<Venue, 'VenueId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateVenueInput = Partial<Omit<Venue, 'VenueId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface VenueRow {
  venue_id: number;
  club_id: number;
  alias: string;
  sede_social?: boolean;
  sede_carreras?: boolean;
  direccion?: string;
  localidad?: string;
  provincia?: string;
  pais?: string;
  map_latitud?: number;
  map_longitud?: number;
  created_at?: Date;
  updated_at?: Date;
}
