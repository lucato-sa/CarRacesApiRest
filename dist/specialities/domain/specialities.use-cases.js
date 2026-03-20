"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSpecialityUseCase = exports.ListSpecialitiesUseCase = void 0;
class ListSpecialitiesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let specialities = await this.repository.getAll();
        if (request.q) {
            specialities = specialities.filter(s => s.Alias.toLowerCase().includes(request.q.toLowerCase()));
        }
        const start = (page - 1) * pageSize;
        const items = specialities.slice(start, start + pageSize);
        return { total: specialities.length, page, pageSize, items };
    }
}
exports.ListSpecialitiesUseCase = ListSpecialitiesUseCase;
class GetSpecialityUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const spec = await this.repository.getById(id);
        if (!spec)
            throw new Error('Speciality not found');
        return spec;
    }
}
exports.GetSpecialityUseCase = GetSpecialityUseCase;
