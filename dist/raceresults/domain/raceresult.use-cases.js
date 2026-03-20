"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRaceResultUseCase = void 0;
class UpdateRaceResultUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id, request) {
        if (request.Posicion === undefined || request.UserId === undefined || request.RaceId === undefined) {
            throw new Error('Missing required fields');
        }
        const result = this.repository.getById(id);
        if (!result)
            throw new Error('RaceResult not found');
        return this.repository.update(id, request);
    }
}
exports.UpdateRaceResultUseCase = UpdateRaceResultUseCase;
