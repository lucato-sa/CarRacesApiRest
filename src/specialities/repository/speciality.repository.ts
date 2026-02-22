export type Speciality = {
  SpecialityId?: number;
  Alias: string;
  Descripcion: string;
  default?: boolean;
};

export class SpecialityRepository {
  private specialities: Speciality[] = [
    { SpecialityId: 1, Alias: 'Circuito', Descripcion: 'Circuito cerrado', default: true },
    { SpecialityId: 2, Alias: 'Rallyes', Descripcion: 'Carreras en circuito abierto', default: false },
  ];

  getAll(): Speciality[] {
    return this.specialities.slice();
  }

  getById(id: number): Speciality | undefined {
    return this.specialities.find(s => s.SpecialityId === id);
  }
}
