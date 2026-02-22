import { RolEntity, RolEntityRepository } from '../repository/rolentity.repository';

export interface ListRolEntitiesRequest { page?: number; pageSize?: number; }
export interface ListRolEntitiesResponse { total: number; page: number; pageSize: number; items: RolEntity[]; }
export interface CreateRolEntityRequest { EntityLinkId: number; RolId: number; }

export class ListRolEntitiesUseCase {
  constructor(private repository: RolEntityRepository) {}
  execute(request: ListRolEntitiesRequest): ListRolEntitiesResponse {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    const rolEntities = this.repository.getAll();
    const start = (page - 1) * pageSize;
    const items = rolEntities.slice(start, start + pageSize);
    return { total: rolEntities.length, page, pageSize, items };
  }
}

export class CreateRolEntityUseCase {
  constructor(private repository: RolEntityRepository) {}
  execute(request: CreateRolEntityRequest): RolEntity {
    if (!request.EntityLinkId || !request.RolId) {
      throw new Error('Missing required fields');
    }
    return this.repository.create(request);
  }
}
