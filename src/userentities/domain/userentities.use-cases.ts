import { UserEntity, UserEntityRepository } from '../repository/userentity.repository';

export interface ListUserEntitiesRequest {
  page?: number;
  pageSize?: number;
}

export interface ListUserEntitiesResponse {
  total: number;
  page: number;
  pageSize: number;
  items: UserEntity[];
}

export interface CreateUserEntityRequest {
  UserId: number;
  EntityLinkId: number;
  RolId: number;
}

export class ListUserEntitiesUseCase {
  constructor(private repository: UserEntityRepository) {}

  async execute(request: ListUserEntitiesRequest): Promise<ListUserEntitiesResponse> {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    const userEntities = await this.repository.getAll();

    const start = (page - 1) * pageSize;
    const items = userEntities.slice(start, start + pageSize);
    return { total: userEntities.length, page, pageSize, items };
  }
}

export class CreateUserEntityUseCase {
  constructor(private repository: UserEntityRepository) {}

  async execute(request: CreateUserEntityRequest): Promise<UserEntity> {
    if (!request.UserId || !request.EntityLinkId || !request.RolId) {
      throw new Error('Missing required fields: UserId, EntityLinkId, RolId');
    }
    return await this.repository.create(request);
  }
}