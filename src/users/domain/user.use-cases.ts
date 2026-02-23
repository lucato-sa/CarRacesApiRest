import { User, UserRepository } from '../repository/user.repository';

export interface ListUsersRequest {
  page?: number;
  pageSize?: number;
  q?: string;
  nick?: string;
}

export interface ListUsersResponse {
  total: number;
  page: number;
  pageSize: number;
  items: User[];
}

/**
 * UseCase: Listar usuarios con filtrado y paginación.
 * Contiene la lógica de negocio para búsqueda y paginación.
 */
export class ListUsersUseCase {
  constructor(private repository: UserRepository) {}

  async execute(request: ListUsersRequest): Promise<ListUsersResponse> {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);
    const q = request.q?.toLowerCase();
    const nick = request.nick;

    let users = await this.repository.getAll();

    // Aplicar filtros (lógica de dominio)
    if (q) {
      users = users.filter(
        u =>
          u.Nick.toLowerCase().includes(q) ||
          u.Nombre.toLowerCase().includes(q) ||
          u.Apellidos.toLowerCase().includes(q) ||
          u.Email.toLowerCase().includes(q),
      );
    }
    if (nick) {
      users = users.filter(u => u.Nick === nick);
    }

    // Aplicar paginación
    const start = (page - 1) * pageSize;
    const items = users.slice(start, start + pageSize);

    return {
      total: users.length,
      page,
      pageSize,
      items,
    };
  }
}

export interface CreateUserRequest {
  Nick: string;
  Nombre: string;
  Apellidos: string;
  Email: string;
  Direccion?: string;
  Localidad?: string;
  Provincia?: string;
  Pais?: string;
}

/**
 * UseCase: Crear un nuevo usuario.
 * Contiene validaciones de negocio.
 */
export class CreateUserUseCase {
  constructor(private repository: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<User> {
    // Validaciones de negocio
    if (!request.Nick || !request.Nombre || !request.Apellidos || !request.Email) {
      throw new Error('Missing required fields: Nick, Nombre, Apellidos, Email');
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.Email)) {
      throw new Error('Invalid email format');
    }

    // Validar Nick único
    if (await this.repository.getByNick(request.Nick)) {
      throw new Error('Nick already exists');
    }

    // Crear usuario a través del repositorio
    return this.repository.create({
      Nick: request.Nick,
      Nombre: request.Nombre,
      Apellidos: request.Apellidos,
      Email: request.Email,
      Direccion: request.Direccion,
      Localidad: request.Localidad,
      Provincia: request.Provincia,
      Pais: request.Pais,
    });
  }
}

export interface UpdateUserRequest {
  Nick?: string;
  Nombre?: string;
  Apellidos?: string;
  Email?: string;
  Direccion?: string;
  Localidad?: string;
  Provincia?: string;
  Pais?: string;
}

/**
 * UseCase: Actualizar un usuario existente.
 */
export class UpdateUserUseCase {
  constructor(private repository: UserRepository) {}

  async execute(id: number, request: UpdateUserRequest): Promise<User> {
    const user = await this.repository.getById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Validar email si se proporciona
    if (request.Email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.Email)) {
        throw new Error('Invalid email format');
      }
    }

    // Validar Nick único si se proporciona
    if (request.Nick && request.Nick !== user.Nick) {
      if (await this.repository.getByNick(request.Nick)) {
        throw new Error('Nick already exists');
      }
    }

    const updated = await this.repository.update(id, request);
    if (!updated) {
      throw new Error('Failed to update user');
    }
    return updated;
  }
}

/**
 * UseCase: Eliminar un usuario.
 */
export class DeleteUserUseCase {
  constructor(private repository: UserRepository) {}

  async execute(id: number): Promise<boolean> {
    const user = await this.repository.getById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.repository.delete(id);
  }
}

/**
 * UseCase: Obtener un usuario por ID.
 */
export class GetUserUseCase {
  constructor(private repository: UserRepository) {}

  async execute(id: number): Promise<User> {
    const user = await this.repository.getById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
