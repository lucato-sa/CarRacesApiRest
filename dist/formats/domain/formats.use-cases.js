"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFormatUseCase = exports.CreateFormatUseCase = exports.ListFormatsUseCase = void 0;
class ListFormatsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let formats = await this.repository.getAll();
        if (request.q) {
            formats = formats.filter(f => f.Descripcion.toLowerCase().includes(request.q.toLowerCase()));
        }
        const start = (page - 1) * pageSize;
        const items = formats.slice(start, start + pageSize);
        return { total: formats.length, page, pageSize, items };
    }
}
exports.ListFormatsUseCase = ListFormatsUseCase;
class CreateFormatUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        if (!request.Alias || !request.Descripcion) {
            throw new Error('Missing required fields: Alias, Descripcion');
        }
        return await this.repository.create(request);
    }
}
exports.CreateFormatUseCase = CreateFormatUseCase;
class GetFormatUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const format = await this.repository.getById(id);
        if (!format)
            throw new Error('Format not found');
        return format;
    }
}
exports.GetFormatUseCase = GetFormatUseCase;
