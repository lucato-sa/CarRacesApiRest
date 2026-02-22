export type Role = {
  RolId?: number;
  Nombre: string;
  Pseudonimo: string;
};

export class RoleRepository {
  private roles: Role[] = [
    { RolId: 1, Nombre: 'Administrator', Pseudonimo: 'admin' },
    { RolId: 2, Nombre: 'Responsable', Pseudonimo: 'resp' },
    { RolId: 7, Nombre: 'Organizador de Competición', Pseudonimo: 'org_comp' },
  ];

  getAll(): Role[] {
    return this.roles.slice();
  }

  getById(id: number): Role | undefined {
    return this.roles.find(r => r.RolId === id);
  }
}
