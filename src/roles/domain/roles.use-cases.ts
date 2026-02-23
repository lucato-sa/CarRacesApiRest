import { Role, RoleRepository } from '../repository/role.repository';

export class ListRolesUseCase {
  constructor(private repository: RoleRepository) {}

  async execute(): Promise<Role[]> {
    return await this.repository.getAll();
  }
}

export class GetRoleUseCase {
  constructor(private repository: RoleRepository) {}

  async execute(id: number): Promise<Role> {
    const role = await this.repository.getById(id);
    if (!role) throw new Error('Role not found');
    return role;
  }
}