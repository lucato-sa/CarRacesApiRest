"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSurfaceUseCase = exports.CreateSurfaceUseCase = exports.ListSurfacesUseCase = void 0;
class ListSurfacesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let surfaces = this.repository.getAll();
        if (request.q)
            surfaces = surfaces.filter(s => s.Descripcion.toLowerCase().includes(request.q.toLowerCase()));
        const start = (page - 1) * pageSize;
        const items = surfaces.slice(start, start + pageSize);
        return { total: surfaces.length, page, pageSize, items };
    }
}
exports.ListSurfacesUseCase = ListSurfacesUseCase;
class CreateSurfaceUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        if (!request.Descripcion)
            throw new Error('Missing required field: Descripcion');
        return this.repository.create(request);
    }
}
exports.CreateSurfaceUseCase = CreateSurfaceUseCase;
class GetSurfaceUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id) {
        const surface = this.repository.getById(id);
        if (!surface)
            throw new Error('Surface not found');
        return surface;
    }
}
exports.GetSurfaceUseCase = GetSurfaceUseCase;
