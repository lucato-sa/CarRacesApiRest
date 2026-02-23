import { Surface, SurfaceRepository } from '../repository/surface.repository';

export interface ListSurfacesRequest {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface ListSurfacesResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Surface[];
}

export interface CreateSurfaceRequest {
  Alias: string;
  Descripcion: string;
}

export class ListSurfacesUseCase {
  constructor(private repository: SurfaceRepository) {}

  async execute(request: ListSurfacesRequest): Promise<ListSurfacesResponse> {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    let surfaces = await this.repository.getAll();

    if (request.q) {
      surfaces = surfaces.filter(s => s.Descripcion.toLowerCase().includes(request.q!.toLowerCase()));
    }

    const start = (page - 1) * pageSize;
    const items = surfaces.slice(start, start + pageSize);
    return { total: surfaces.length, page, pageSize, items };
  }
}

export class CreateSurfaceUseCase {
  constructor(private repository: SurfaceRepository) {}

  async execute(request: CreateSurfaceRequest): Promise<Surface> {
    if (!request.Alias || !request.Descripcion) {
      throw new Error('Missing required fields: Alias, Descripcion');
    }
    return await this.repository.create(request);
  }
}

export class GetSurfaceUseCase {
  constructor(private repository: SurfaceRepository) {}

  async execute(id: number): Promise<Surface> {
    const surface = await this.repository.getById(id);
    if (!surface) throw new Error('Surface not found');
    return surface;
  }
}