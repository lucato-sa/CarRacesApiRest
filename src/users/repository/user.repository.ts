export type User = {
  UserId?: number;
  Nick: string;
  Nombre: string;
  Apellidos: string;
  Email: string;
  Direccion?: string;
  Localidad?: string;
  Provincia?: string;
  Pais?: string;
};

/**
 * Repository para gestionar la persistencia de Users en memoria.
 * Implementa operaciones CRUD sin lógica de negocio.
 */
export class UserRepository {
  private users: User[] = [
    {
      UserId: 1,
      Nick: 'piloto7',
      Nombre: 'Juan',
      Apellidos: 'Pérez',
      Email: 'juan.perez@example.com',
      Direccion: 'Calle Principal 123',
      Localidad: 'Madrid',
      Provincia: 'Madrid',
      Pais: 'España',
    },
    {
      UserId: 2,
      Nick: 'velocidad99',
      Nombre: 'María',
      Apellidos: 'García',
      Email: 'maria.garcia@example.com',
      Direccion: 'Avenida Central 456',
      Localidad: 'Barcelona',
      Provincia: 'Barcelona',
      Pais: 'España',
    },
  ];

  /**
   * Obtiene todos los usuarios.
   */
  getAll(): User[] {
    return this.users.slice();
  }

  /**
   * Obtiene un usuario por ID.
   */
  getById(id: number): User | undefined {
    return this.users.find(u => u.UserId === id);
  }

  /**
   * Obtiene un usuario por Nick.
   */
  getByNick(nick: string): User | undefined {
    return this.users.find(u => u.Nick === nick);
  }

  /**
   * Crea un nuevo usuario.
   */
  create(user: Omit<User, 'UserId'>): User {
    const newId = Math.max(0, ...this.users.map(u => u.UserId || 0)) + 1;
    const newUser: User = { ...user, UserId: newId };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Actualiza un usuario existente.
   */
  update(id: number, user: Partial<User>): User | undefined {
    const existing = this.users.find(u => u.UserId === id);
    if (!existing) return undefined;
    Object.assign(existing, user);
    return existing;
  }

  /**
   * Elimina un usuario.
   */
  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.UserId === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
