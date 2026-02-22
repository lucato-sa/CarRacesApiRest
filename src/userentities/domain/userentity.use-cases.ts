import { UserEntity, UserEntityRepository } from '../repository/userentity.repository';

export interface ListUserEntitiesRequest { page?: number; pageSize?: number; }
export interface ListUserEntitiesResponse { total: number; page: number; pageSize: number; items: UserEntity[]; }
export interface CreateUserEntityRequest { UserId: number; EntityLinkId: number; RolId: number; }

export class ListUserEntitiesUseCase {
  constructor(private repository: UserEntityRepository) {}
  execute(request: ListUserEntitiesRequest): ListUserEntitiesResponse {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    const userEntities = this.repository.getAll();
    const start = (page - 1) * pageSize;
    const items = userEntities.slice(start, start + pageSize);
    return { total: userEntities.length, page, pageSize, items };
  }
}

export class CreateUserEntityUseCase {
  constructor(private repository: UserEntityRepository) {}
  execute(request: CreateUserEntityRequest): UserEntity {
    if (!request.UserId || !request.EntityLinkId || !request.RolId) {
      throw new Error('Missing required fields');
    }
    return this.repository.create(request);
  }
}
