import { Registration, RegistrationRepository } from '../repository/registration.repository';

export interface ListRegistrationsRequest {
  page?: number;
  pageSize?: number;
  competitionId?: number;
  userId?: number;
}

export interface ListRegistrationsResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Registration[];
}

export interface CreateRegistrationRequest {
  CompetitionId: number;
  UserId: number;
  FechaRegistro: string;
  Estado: string;
}

export class ListRegistrationsUseCase {
  constructor(private repository: RegistrationRepository) {}

  async execute(request: ListRegistrationsRequest): Promise<ListRegistrationsResponse> {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    let regs = await this.repository.getAll();

    if (request.competitionId) {
      regs = regs.filter(r => r.CompetitionId === request.competitionId);
    }
    if (request.userId) {
      regs = regs.filter(r => r.UserId === request.userId);
    }

    const start = (page - 1) * pageSize;
    const items = regs.slice(start, start + pageSize);
    return { total: regs.length, page, pageSize, items };
  }
}

export interface CreateRegistrationRequest {
  CompetitionId: number;
  UserId: number;
  FechaRegistro: string;
  Estado: string;
}

export class CreateRegistrationUseCase {
  constructor(private repository: RegistrationRepository) {}

  async execute(request: CreateRegistrationRequest): Promise<Registration> {
    if (!request.CompetitionId || !request.UserId || !request.FechaRegistro || !request.Estado) {
      throw new Error('Missing required fields: CompetitionId, UserId, FechaRegistro, Estado');
    }
    return await this.repository.create(request);
  }
}

export class GetRegistrationUseCase {
  constructor(private repository: RegistrationRepository) {}

  async execute(id: number): Promise<Registration> {
    const reg = await this.repository.getById(id);
    if (!reg) throw new Error('Registration not found');
    return reg;
  }
}

export class DeleteRegistrationUseCase {
  constructor(private repository: RegistrationRepository) {}

  async execute(id: number): Promise<boolean> {
    const reg = await this.repository.getById(id);
    if (!reg) throw new Error('Registration not found');
    return await this.repository.delete(id);
  }
}