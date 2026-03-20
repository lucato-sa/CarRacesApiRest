"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserUseCase = exports.DeleteUserUseCase = exports.UpdateUserUseCase = exports.CreateUserUseCase = exports.ListUsersUseCase = void 0;
/**
 * UseCase: Listar usuarios con filtrado y paginación.
 * Contiene la lógica de negocio para búsqueda y paginación.
 */
class ListUsersUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        const q = request.q?.toLowerCase();
        const nick = request.nick;
        let users = await this.repository.getAll();
        // Aplicar filtros (lógica de dominio)
        if (q) {
            users = users.filter(u => u.Nick.toLowerCase().includes(q) ||
                u.Nombre.toLowerCase().includes(q) ||
                u.Apellidos.toLowerCase().includes(q) ||
                u.Email.toLowerCase().includes(q));
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
exports.ListUsersUseCase = ListUsersUseCase;
/**
 * UseCase: Crear un nuevo usuario.
 * Contiene validaciones de negocio.
 */
class CreateUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
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
exports.CreateUserUseCase = CreateUserUseCase;
/**
 * UseCase: Actualizar un usuario existente.
 */
class UpdateUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, request) {
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
exports.UpdateUserUseCase = UpdateUserUseCase;
/**
 * UseCase: Eliminar un usuario.
 */
class DeleteUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const user = await this.repository.getById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return this.repository.delete(id);
    }
}
exports.DeleteUserUseCase = DeleteUserUseCase;
/**
 * UseCase: Obtener un usuario por ID.
 */
class GetUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const user = await this.repository.getById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.GetUserUseCase = GetUserUseCase;
