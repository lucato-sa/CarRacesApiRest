"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDivisionUseCase = exports.ListDivisionsUseCase = void 0;
class ListDivisionsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        const divisions = this.repository.getAll();
        const start = (page - 1) * pageSize;
        const items = divisions.slice(start, start + pageSize);
        return { total: divisions.length, page, pageSize, items };
    }
}
exports.ListDivisionsUseCase = ListDivisionsUseCase;
class GetDivisionUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id) {
        const division = this.repository.getById(id);
        if (!division)
            throw new Error('Division not found');
        return division;
    }
}
exports.GetDivisionUseCase = GetDivisionUseCase;
