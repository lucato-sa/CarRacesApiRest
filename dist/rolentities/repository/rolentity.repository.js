"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolEntityRepository = void 0;
class RolEntityRepository {
    constructor() {
        this.rolEntities = [
            { RolEntityId: 1, EntityLinkId: 1, RolId: 1 },
        ];
    }
    getAll() {
        return this.rolEntities.slice();
    }
    create(rolEntity) {
        const newId = Math.max(0, ...this.rolEntities.map(r => r.RolEntityId || 0)) + 1;
        const newRolEntity = { ...rolEntity, RolEntityId: newId };
        this.rolEntities.push(newRolEntity);
        return newRolEntity;
    }
}
exports.RolEntityRepository = RolEntityRepository;
