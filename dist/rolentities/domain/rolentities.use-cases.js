"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRolEntityUseCase = exports.ListRolEntitiesUseCase = void 0;
class ListRolEntitiesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        const rolEntities = await this.repository.getAll();
        const start = (page - 1) * pageSize;
        const items = rolEntities.slice(start, start + pageSize);
        return { total: rolEntities.length, page, pageSize, items };
    }
}
exports.ListRolEntitiesUseCase = ListRolEntitiesUseCase;
class CreateRolEntityUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        if (!request.EntityLinkId || !request.RolId) {
            throw new Error('Missing required fields: EntityLinkId, RolId');
        }
        return await this.repository.create(request);
    }
}
exports.CreateRolEntityUseCase = CreateRolEntityUseCase;
