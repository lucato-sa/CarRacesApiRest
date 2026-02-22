export type Competition = {
  CompetitionId?: number;
  SeasonId: number;
  EventId: number;
  VenueId: number;
  Alias: string;
  TotalRaces: number;
  FechaInicioInscripPri?: string;
  FechaFinInscripPri?: string;
  FechaInicioInscrip?: string;
  FechaFinInscrip?: string;
  PilotosMinInscrip?: number;
  PilotosMaxInscrip?: number;
  Responsable: number;
  SoloUsuariosReg: boolean;
  Notas?: string;
};

/**
 * Repository para gestionar la persistencia de Competitions en memoria.
 */
export class CompetitionRepository {
  private competitions: Competition[] = [
    {
      CompetitionId: 100,
      SeasonId: 10,
      EventId: 5,
      VenueId: 2,
      Alias: 'Copa Primavera',
      TotalRaces: 3,
      FechaInicioInscripPri: '2026-03-01',
      FechaFinInscripPri: '2026-03-15',
      FechaInicioInscrip: '2026-04-01',
      FechaFinInscrip: '2026-05-01',
      PilotosMinInscrip: 10,
      PilotosMaxInscrip: 50,
      Responsable: 7,
      SoloUsuariosReg: false,
      Notas: 'Competición importante',
    },
  ];

  getAll(): Competition[] {
    return this.competitions.slice();
  }

  getById(id: number): Competition | undefined {
    return this.competitions.find(c => c.CompetitionId === id);
  }

  create(competition: Omit<Competition, 'CompetitionId'>): Competition {
    const newId = Math.max(0, ...this.competitions.map(c => c.CompetitionId || 0)) + 1;
    const newCompetition: Competition = { ...competition, CompetitionId: newId };
    this.competitions.push(newCompetition);
    return newCompetition;
  }

  update(id: number, competition: Partial<Competition>): Competition | undefined {
    const existing = this.competitions.find(c => c.CompetitionId === id);
    if (!existing) return undefined;
    Object.assign(existing, competition);
    return existing;
  }

  delete(id: number): boolean {
    const index = this.competitions.findIndex(c => c.CompetitionId === id);
    if (index === -1) return false;
    this.competitions.splice(index, 1);
    return true;
  }
}
