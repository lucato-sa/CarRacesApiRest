"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDisciplineUseCase = exports.ListDisciplinesUseCase = void 0;
class ListDisciplinesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let disciplines = this.repository.getAll();
        if (request.specialityId)
            disciplines = disciplines.filter(d => d.SpecialityId === request.specialityId);
        if (request.formatId)
            disciplines = disciplines.filter(d => d.FormatId === request.formatId);
        if (request.surfaceId)
            disciplines = disciplines.filter(d => d.SurfaceId === request.surfaceId);
        const start = (page - 1) * pageSize;
        const items = disciplines.slice(start, start + pageSize);
        return { total: disciplines.length, page, pageSize, items };
    }
}
exports.ListDisciplinesUseCase = ListDisciplinesUseCase;
class GetDisciplineUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id) {
        const discipline = this.repository.getById(id);
        if (!discipline)
            throw new Error('Discipline not found');
        return discipline;
    }
}
exports.GetDisciplineUseCase = GetDisciplineUseCase;
