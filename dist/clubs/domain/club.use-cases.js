"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClubUseCase = exports.ListClubsUseCase = void 0;
/**
 * UseCase: Listar clubs con filtrado y paginación.
 * Contiene la lógica de negocio para búsqueda y paginación.
 */
class ListClubsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        const q = request.q?.toLowerCase();
        const alias = request.alias;
        let clubs = await this.repository.getAll();
        // Aplicar filtros (lógica de dominio)
        if (q) {
            clubs = clubs.filter(c => c.Alias.toLowerCase().includes(q) || c.TaxNombre.toLowerCase().includes(q));
        }
        if (alias) {
            clubs = clubs.filter(c => c.Alias === alias);
        }
        // Aplicar paginación
        const start = (page - 1) * pageSize;
        const items = clubs.slice(start, start + pageSize);
        return {
            total: clubs.length,
            page,
            pageSize,
            items,
        };
    }
}
exports.ListClubsUseCase = ListClubsUseCase;
/**
 * UseCase: Crear un nuevo club.
 * Contiene validaciones de negocio.
 */
class CreateClubUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        // Validaciones de negocio
        if (!request.Alias || !request.TaxNombre || !request.TaxNumero || !request.Descripcion || !request.FechaFundacion) {
            throw new Error('Missing required fields');
        }
        // Crear club a través del repositorio
        return this.repository.create({
            Alias: request.Alias,
            TaxNombre: request.TaxNombre,
            TaxNumero: request.TaxNumero,
            Descripcion: request.Descripcion,
            FechaFundacion: request.FechaFundacion,
        });
    }
}
exports.CreateClubUseCase = CreateClubUseCase;
