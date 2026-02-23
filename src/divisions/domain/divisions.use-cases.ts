import { Division, DivisionRepository } from '../repository/division.repository';

export interface ListDivisionsRequest {
  page?: number;
  pageSize?: number;
}

export interface ListDivisionsResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Division[];
}

export class ListDivisionsUseCase {
  constructor(private repository: DivisionRepository) {}

  async execute(request: ListDivisionsRequest): Promise<ListDivisionsResponse> {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    const divisions = await this.repository.getAll();

    const start = (page - 1) * pageSize;
    const items = divisions.slice(start, start + pageSize);
    return { total: divisions.length, page, pageSize, items };
  }
}

export class GetDivisionUseCase {
  constructor(private repository: DivisionRepository) {}

  async execute(id: number): Promise<Division> {
    const division = await this.repository.getById(id);
    if (!division) throw new Error('Division not found');
    return division;
  }
}