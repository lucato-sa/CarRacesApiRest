export type RaceResult = {
  ResultId?: number;
  RaceId: number;
  UserId: number;
  Posicion: number;
  Vueltas?: number;
  PrimeraLinea?: boolean;
  VueltaRapida?: boolean;
};

export class RaceResultRepository {
  private results: RaceResult[] = [
    { ResultId: 500, RaceId: 200, UserId: 1, Posicion: 1, Vueltas: 50, PrimeraLinea: true, VueltaRapida: true },
  ];

  getById(id: number): RaceResult | undefined {
    return this.results.find(r => r.ResultId === id);
  }

  update(id: number, result: Partial<RaceResult>): RaceResult | undefined {
    const existing = this.results.find(r => r.ResultId === id);
    if (!existing) return undefined;
    Object.assign(existing, result);
    return existing;
  }
}
