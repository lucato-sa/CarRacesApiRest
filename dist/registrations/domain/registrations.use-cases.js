"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRegistrationUseCase = exports.GetRegistrationUseCase = exports.CreateRegistrationUseCase = exports.ListRegistrationsUseCase = void 0;
class ListRegistrationsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let regs = await this.repository.getAll();
        if (request.competitionId) {
            regs = regs.filter(r => r.CompetitionId === request.competitionId);
        }
        if (request.userId) {
            regs = regs.filter(r => r.UserId === request.userId);
        }
        const start = (page - 1) * pageSize;
        const items = regs.slice(start, start + pageSize);
        return { total: regs.length, page, pageSize, items };
    }
}
exports.ListRegistrationsUseCase = ListRegistrationsUseCase;
class CreateRegistrationUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        if (!request.CompetitionId || !request.UserId || !request.FechaRegistro || !request.Estado) {
            throw new Error('Missing required fields: CompetitionId, UserId, FechaRegistro, Estado');
        }
        return await this.repository.create(request);
    }
}
exports.CreateRegistrationUseCase = CreateRegistrationUseCase;
class GetRegistrationUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const reg = await this.repository.getById(id);
        if (!reg)
            throw new Error('Registration not found');
        return reg;
    }
}
exports.GetRegistrationUseCase = GetRegistrationUseCase;
class DeleteRegistrationUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const reg = await this.repository.getById(id);
        if (!reg)
            throw new Error('Registration not found');
        return await this.repository.delete(id);
    }
}
exports.DeleteRegistrationUseCase = DeleteRegistrationUseCase;
