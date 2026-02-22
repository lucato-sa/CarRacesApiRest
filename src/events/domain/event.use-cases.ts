import { Event, EventRepository } from '../repository/event.repository';

export interface ListEventsRequest {
  page?: number;
  pageSize?: number;
  clubId?: number;
  from?: string;
  to?: string;
}

export interface ListEventsResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Event[];
}

export class ListEventsUseCase {
  constructor(private repository: EventRepository) {}

  execute(request: ListEventsRequest): ListEventsResponse {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);

    let events = this.repository.getAll();

    // Aplicar filtros
    if (request.clubId) {
      events = events.filter(e => e.ClubId === request.clubId);
    }
    if (request.from) {
      events = events.filter(e => e.FechaInicio >= request.from!);
    }
    if (request.to) {
      events = events.filter(e => e.FechaFin <= request.to!);
    }

    // Paginación
    const start = (page - 1) * pageSize;
    const items = events.slice(start, start + pageSize);

    return { total: events.length, page, pageSize, items };
  }
}

export interface CreateEventRequest {
  Descripcion: string;
  FechaInicio: string;
  FechaFin: string;
  ClubId: number;
}

export class CreateEventUseCase {
  constructor(private repository: EventRepository) {}

  execute(request: CreateEventRequest): Event {
    if (!request.Descripcion || !request.FechaInicio || !request.FechaFin || !request.ClubId) {
      throw new Error('Missing required fields: Descripcion, FechaInicio, FechaFin, ClubId');
    }

    return this.repository.create(request);
  }
}

export interface UpdateEventRequest {
  Descripcion?: string;
  FechaInicio?: string;
  FechaFin?: string;
  ClubId?: number;
}

export class UpdateEventUseCase {
  constructor(private repository: EventRepository) {}

  execute(id: number, request: UpdateEventRequest): Event {
    const event = this.repository.getById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    return this.repository.update(id, request) as Event;
  }
}

export class GetEventUseCase {
  constructor(private repository: EventRepository) {}

  execute(id: number): Event {
    const event = this.repository.getById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }
}

export class DeleteEventUseCase {
  constructor(private repository: EventRepository) {}

  execute(id: number): boolean {
    const event = this.repository.getById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    return this.repository.delete(id);
  }
}
