"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRaceResultUseCase = exports.UpdateRaceResultUseCase = void 0;
class UpdateRaceResultUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, request) {
        if (request.Posicion === undefined || request.UserId === undefined || request.RaceId === undefined) {
            throw new Error('Missing required fields: RaceId, UserId, Posicion');
        }
        const result = await this.repository.getById(id);
        if (!result)
            throw new Error('RaceResult not found');
        const updated = await this.repository.update(id, request);
        if (!updated) {
            throw new Error('Failed to update race result');
        }
        return updated;
    }
}
exports.UpdateRaceResultUseCase = UpdateRaceResultUseCase;
class GetRaceResultUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const result = await this.repository.getById(id);
        if (!result)
            throw new Error('RaceResult not found');
        return result;
    }
}
exports.GetRaceResultUseCase = GetRaceResultUseCase;
