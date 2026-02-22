import { Registration, RegistrationRepository } from '../repository/registration.repository';

export interface ListRegistrationsRequest { page?: number; pageSize?: number; competitionId?: number; userId?: number; }
export interface ListRegistrationsResponse { total: number; page: number; pageSize: number; items: Registration[]; }
export interface CreateRegistrationRequest { CompetitionId: number; UserId: number; FechaRegistro: string; Estado: string; }

export class ListRegistrationsUseCase {
  constructor(private repository: RegistrationRepository) {}
  execute(request: ListRegistrationsRequest): ListRegistrationsResponse {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    let regs = this.repository.getAll();
    if (request.competitionId) regs = regs.filter(r => r.CompetitionId === request.competitionId);
    if (request.userId) regs = regs.filter(r => r.UserId === request.userId);
    const start = (page - 1) * pageSize;
    const items = regs.slice(start, start + pageSize);
    return { total: regs.length, page, pageSize, items };
  }
}

export class CreateRegistrationUseCase {
  constructor(private repository: RegistrationRepository) {}
  execute(request: CreateRegistrationRequest): Registration {
    if (!request.CompetitionId || !request.UserId || !request.FechaRegistro || !request.Estado) {
      throw new Error('Missing required fields');
    }
    return this.repository.create(request);
  }
}

export class GetRegistrationUseCase {
  constructor(private repository: RegistrationRepository) {}
  execute(id: number): Registration {
    const reg = this.repository.getById(id);
    if (!reg) throw new Error('Registration not found');
    return reg;
  }
}

export class DeleteRegistrationUseCase {
  constructor(private repository: RegistrationRepository) {}
  execute(id: number): boolean {
    const reg = this.repository.getById(id);
    if (!reg) throw new Error('Registration not found');
    return this.repository.delete(id);
  }
}
