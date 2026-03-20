"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoleUseCase = exports.ListRolesUseCase = void 0;
class ListRolesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute() {
        return this.repository.getAll();
    }
}
exports.ListRolesUseCase = ListRolesUseCase;
class GetRoleUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id) {
        const role = this.repository.getById(id);
        if (!role)
            throw new Error('Role not found');
        return role;
    }
}
exports.GetRoleUseCase = GetRoleUseCase;
