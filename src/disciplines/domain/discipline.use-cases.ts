import { Discipline, DisciplineRepository } from '../repository/discipline.repository';

export interface ListDisciplinesRequest { page?: number; pageSize?: number; specialityId?: number; formatId?: number; surfaceId?: number; }
export interface ListDisciplinesResponse { total: number; page: number; pageSize: number; items: Discipline[]; }

export class ListDisciplinesUseCase {
  constructor(private repository: DisciplineRepository) {}
  execute(request: ListDisciplinesRequest): ListDisciplinesResponse {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    let disciplines = this.repository.getAll();
    if (request.specialityId) disciplines = disciplines.filter(d => d.SpecialityId === request.specialityId);
    if (request.formatId) disciplines = disciplines.filter(d => d.FormatId === request.formatId);
    if (request.surfaceId) disciplines = disciplines.filter(d => d.SurfaceId === request.surfaceId);
    const start = (page - 1) * pageSize;
    const items = disciplines.slice(start, start + pageSize);
    return { total: disciplines.length, page, pageSize, items };
  }
}

export class GetDisciplineUseCase {
  constructor(private repository: DisciplineRepository) {}
  execute(id: number): Discipline {
    const discipline = this.repository.getById(id);
    if (!discipline) throw new Error('Discipline not found');
    return discipline;
  }
}
