import { Speciality, SpecialityRepository } from '../repository/speciality.repository';

export interface ListSpecialitiesRequest { page?: number; pageSize?: number; q?: string; }
export interface ListSpecialitiesResponse { total: number; page: number; pageSize: number; items: Speciality[]; }

export class ListSpecialitiesUseCase {
  constructor(private repository: SpecialityRepository) {}
  execute(request: ListSpecialitiesRequest): ListSpecialitiesResponse {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    let specialities = this.repository.getAll();
    if (request.q) {
      specialities = specialities.filter(s => s.Alias.toLowerCase().includes(request.q!.toLowerCase()));
    }
    const start = (page - 1) * pageSize;
    const items = specialities.slice(start, start + pageSize);
    return { total: specialities.length, page, pageSize, items };
  }
}

export class GetSpecialityUseCase {
  constructor(private repository: SpecialityRepository) {}
  execute(id: number): Speciality {
    const spec = this.repository.getById(id);
    if (!spec) throw new Error('Speciality not found');
    return spec;
  }
}
