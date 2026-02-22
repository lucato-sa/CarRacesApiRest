export type Event = {
  EventId?: number;
  Descripcion: string;
  FechaInicio: string;
  FechaFin: string;
  ClubId: number;
};

/**
 * Repository para gestionar la persistencia de Events en memoria.
 */
export class EventRepository {
  private events: Event[] = [
    {
      EventId: 5,
      Descripcion: 'Campeonato de Primavera 2026',
      FechaInicio: '2026-03-15',
      FechaFin: '2026-05-30',
      ClubId: 1,
    },
  ];

  getAll(): Event[] {
    return this.events.slice();
  }

  getById(id: number): Event | undefined {
    return this.events.find(e => e.EventId === id);
  }

  create(event: Omit<Event, 'EventId'>): Event {
    const newId = Math.max(0, ...this.events.map(e => e.EventId || 0)) + 1;
    const newEvent: Event = { ...event, EventId: newId };
    this.events.push(newEvent);
    return newEvent;
  }

  update(id: number, event: Partial<Event>): Event | undefined {
    const existing = this.events.find(e => e.EventId === id);
    if (!existing) return undefined;
    Object.assign(existing, event);
    return existing;
  }

  delete(id: number): boolean {
    const index = this.events.findIndex(e => e.EventId === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    return true;
  }
}
