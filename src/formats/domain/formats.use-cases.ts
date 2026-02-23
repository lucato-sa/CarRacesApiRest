import { Format, FormatRepository } from '../repository/format.repository';

export interface ListFormatsRequest {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface ListFormatsResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Format[];
}

export interface CreateFormatRequest {
  Alias: string;
  Descripcion: string;
}

export class ListFormatsUseCase {
  constructor(private repository: FormatRepository) {}

  async execute(request: ListFormatsRequest): Promise<ListFormatsResponse> {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    let formats = await this.repository.getAll();

    if (request.q) {
      formats = formats.filter(f => f.Descripcion.toLowerCase().includes(request.q!.toLowerCase()));
    }

    const start = (page - 1) * pageSize;
    const items = formats.slice(start, start + pageSize);
    return { total: formats.length, page, pageSize, items };
  }
}

export class CreateFormatUseCase {
  constructor(private repository: FormatRepository) {}

  async execute(request: CreateFormatRequest): Promise<Format> {
    if (!request.Alias || !request.Descripcion) {
      throw new Error('Missing required fields: Alias, Descripcion');
    }
    return await this.repository.create(request);
  }
}

export class GetFormatUseCase {
  constructor(private repository: FormatRepository) {}

  async execute(id: number): Promise<Format> {
    const format = await this.repository.getById(id);
    if (!format) throw new Error('Format not found');
    return format;
  }
}