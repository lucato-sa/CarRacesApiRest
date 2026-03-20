"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRaceUseCase = void 0;
class UpdateRaceUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id, request) {
        if (request.CompetitionId === undefined || request.NumRace === undefined || request.Fecha === undefined || request.Hora === undefined || request.Estado === undefined) {
            throw new Error('Missing required fields');
        }
        const race = this.repository.getById(id);
        if (!race)
            throw new Error('Race not found');
        return this.repository.update(id, request);
    }
}
exports.UpdateRaceUseCase = UpdateRaceUseCase;
