"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserEntityUseCase = exports.ListUserEntitiesUseCase = void 0;
class ListUserEntitiesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        const userEntities = this.repository.getAll();
        const start = (page - 1) * pageSize;
        const items = userEntities.slice(start, start + pageSize);
        return { total: userEntities.length, page, pageSize, items };
    }
}
exports.ListUserEntitiesUseCase = ListUserEntitiesUseCase;
class CreateUserEntityUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        if (!request.UserId || !request.EntityLinkId || !request.RolId) {
            throw new Error('Missing required fields');
        }
        return this.repository.create(request);
    }
}
exports.CreateUserEntityUseCase = CreateUserEntityUseCase;
