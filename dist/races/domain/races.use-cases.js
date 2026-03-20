"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRaceUseCase = exports.UpdateRaceUseCase = void 0;
class UpdateRaceUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, request) {
        if (request.CompetitionId === undefined ||
            request.NumRace === undefined ||
            request.Fecha === undefined ||
            request.Hora === undefined ||
            request.Estado === undefined) {
            throw new Error('Missing required fields: CompetitionId, NumRace, Fecha, Hora, Estado');
        }
        const race = await this.repository.getById(id);
        if (!race)
            throw new Error('Race not found');
        const updated = await this.repository.update(id, request);
        if (!updated) {
            throw new Error('Failed to update race');
        }
        return updated;
    }
}
exports.UpdateRaceUseCase = UpdateRaceUseCase;
class GetRaceUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const race = await this.repository.getById(id);
        if (!race)
            throw new Error('Race not found');
        return race;
    }
}
exports.GetRaceUseCase = GetRaceUseCase;
