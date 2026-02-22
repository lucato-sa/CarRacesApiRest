import { Division, DivisionRepository } from '../repository/division.repository';

export interface ListDivisionsRequest { page?: number; pageSize?: number; }
export interface ListDivisionsResponse { total: number; page: number; pageSize: number; items: Division[]; }

export class ListDivisionsUseCase {
  constructor(private repository: DivisionRepository) {}
  execute(request: ListDivisionsRequest): ListDivisionsResponse {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    const divisions = this.repository.getAll();
    const start = (page - 1) * pageSize;
    const items = divisions.slice(start, start + pageSize);
    return { total: divisions.length, page, pageSize, items };
  }
}

export class GetDivisionUseCase {
  constructor(private repository: DivisionRepository) {}
  execute(id: number): Division {
    const division = this.repository.getById(id);
    if (!division) throw new Error('Division not found');
    return division;
  }
}
