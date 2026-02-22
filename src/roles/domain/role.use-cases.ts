import { Role, RoleRepository } from '../repository/role.repository';

export class ListRolesUseCase {
  constructor(private repository: RoleRepository) {}
  execute(): Role[] {
    return this.repository.getAll();
  }
}

export class GetRoleUseCase {
  constructor(private repository: RoleRepository) {}
  execute(id: number): Role {
    const role = this.repository.getById(id);
    if (!role) throw new Error('Role not found');
    return role;
  }
}
