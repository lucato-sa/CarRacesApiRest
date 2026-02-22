export type Division = {
  DivisionId?: number;
  DisciplineId: number;
  Alias: string;
  Descripcion: string;
};

export class DivisionRepository {
  private divisions: Division[] = [
    { DivisionId: 1, DisciplineId: 1, Alias: 'Division 1', Descripcion: 'Primera categoría' },
  ];

  getAll(): Division[] {
    return this.divisions.slice();
  }

  getById(id: number): Division | undefined {
    return this.divisions.find(d => d.DivisionId === id);
  }
}
