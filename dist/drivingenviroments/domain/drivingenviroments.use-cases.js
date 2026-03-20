"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDrivingEnvironmentUseCase = exports.CreateDrivingEnvironmentUseCase = exports.ListDrivingEnvironmentsUseCase = void 0;
class ListDrivingEnvironmentsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let envs = await this.repository.getAll();
        if (request.q) {
            envs = envs.filter(e => e.Alias.toLowerCase().includes(request.q.toLowerCase()));
        }
        if (request.alias) {
            envs = envs.filter(e => e.Alias === request.alias);
        }
        const start = (page - 1) * pageSize;
        const items = envs.slice(start, start + pageSize);
        return { total: envs.length, page, pageSize, items };
    }
}
exports.ListDrivingEnvironmentsUseCase = ListDrivingEnvironmentsUseCase;
class CreateDrivingEnvironmentUseCase {
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
exports.CreateDrivingEnvironmentUseCase = CreateDrivingEnvironmentUseCase;
class GetDrivingEnvironmentUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const env = await this.repository.getById(id);
        if (!env)
            throw new Error('DrivingEnvironment not found');
        return env;
    }
}
exports.GetDrivingEnvironmentUseCase = GetDrivingEnvironmentUseCase;
