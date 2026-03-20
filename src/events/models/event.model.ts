/**
 * 📋 Event Model - Tipos TypeScript (sin decoradores de ORM)
 */

export interface Event {
  EventId?: number;
  Descripcion: string;
  FechaInicio?: string;
  FechaFin?: string;
  ClubId?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type CreateEventInput = Omit<Event, 'EventId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateEventInput = Partial<Omit<Event, 'EventId' | 'CreatedAt' | 'UpdatedAt'>>;

export interface EventRow {
  event_id: number;
  descripcion: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  club_id?: number;
  created_at?: Date;
  updated_at?: Date;
}