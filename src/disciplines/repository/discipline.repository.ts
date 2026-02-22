export type Discipline = {
  DisciplineId?: number;
  SpecialityId: number;
  FormatId: number;
  SurfaceId: number;
  Alias: string;
};

export class DisciplineRepository {
  private disciplines: Discipline[] = [
    { DisciplineId: 1, SpecialityId: 1, FormatId: 1, SurfaceId: 1, Alias: 'Fórmula 1' },
  ];

  getAll(): Discipline[] {
    return this.disciplines.slice();
  }

  getById(id: number): Discipline | undefined {
    return this.disciplines.find(d => d.DisciplineId === id);
  }
}
