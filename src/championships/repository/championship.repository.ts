export type Championship = {
  ChampionshipId?: number;
  Alias: string;
  Descripcion?: string;
  ClubId: number;
};

export class ChampionshipRepository {
  private championships: Championship[] = [
    { ChampionshipId: 1, Alias: 'Campeonato 2026', Descripcion: 'Campeonato principal', ClubId: 1 },
  ];

  getAll(): Championship[] {
    return this.championships.slice();
  }

  getById(id: number): Championship | undefined {
    return this.championships.find(c => c.ChampionshipId === id);
  }
}
