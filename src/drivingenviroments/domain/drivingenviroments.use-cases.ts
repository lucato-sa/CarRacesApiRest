import { DrivingEnvironment, DrivingEnvironmentRepository } from '../repository/drivingenvironment.repository';

export interface ListDrivingEnvironmentsRequest {
  page?: number;
  pageSize?: number;
  q?: string;
  alias?: string;
}

export interface ListDrivingEnvironmentsResponse {
  total: number;
  page: number;
  pageSize: number;
  items: DrivingEnvironment[];
}

export interface CreateDrivingEnvironmentRequest {
  Alias: string;
  Descripcion: string;
  default?: boolean;
}

export class ListDrivingEnvironmentsUseCase {
  constructor(private repository: DrivingEnvironmentRepository) {}

  async execute(request: ListDrivingEnvironmentsRequest): Promise<ListDrivingEnvironmentsResponse> {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    let envs = await this.repository.getAll();

    if (request.q) {
      envs = envs.filter(e => e.Alias.toLowerCase().includes(request.q!.toLowerCase()));
    }
    if (request.alias) {
      envs = envs.filter(e => e.Alias === request.alias);
    }

    const start = (page - 1) * pageSize;
    const items = envs.slice(start, start + pageSize);
    return { total: envs.length, page, pageSize, items };
  }
}

export class CreateDrivingEnvironmentUseCase {
  constructor(private repository: DrivingEnvironmentRepository) {}

  async execute(request: CreateDrivingEnvironmentRequest): Promise<DrivingEnvironment> {
    if (!request.Alias || !request.Descripcion) {
      throw new Error('Missing required fields: Alias, Descripcion');
    }
    return await this.repository.create(request);
  }
}

export class GetDrivingEnvironmentUseCase {
  constructor(private repository: DrivingEnvironmentRepository) {}

  async execute(id: number): Promise<DrivingEnvironment> {
    const env = await this.repository.getById(id);
    if (!env) throw new Error('DrivingEnvironment not found');
    return env;
  }
}