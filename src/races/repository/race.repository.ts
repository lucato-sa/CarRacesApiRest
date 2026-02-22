export type Race = {
  RaceId?: number;
  CompetitionId: number;
  NumRace: number;
  Fecha: string;
  Hora: string;
  Estado: number;
};

export class RaceRepository {
  private races: Race[] = [
    { RaceId: 200, CompetitionId: 100, NumRace: 1, Fecha: '2026-05-10', Hora: '2026-05-10T10:30:00Z', Estado: 1 },
  ];

  getById(id: number): Race | undefined {
    return this.races.find(r => r.RaceId === id);
  }

  update(id: number, race: Partial<Race>): Race | undefined {
    const existing = this.races.find(r => r.RaceId === id);
    if (!existing) return undefined;
    Object.assign(existing, race);
    return existing;
  }
}
