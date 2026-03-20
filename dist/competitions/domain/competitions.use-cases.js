"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCompetitionUseCase = exports.GetCompetitionUseCase = exports.UpdateCompetitionUseCase = exports.CreateCompetitionUseCase = exports.ListCompetitionsUseCase = void 0;
class ListCompetitionsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let competitions = await this.repository.getAll();
        // Aplicar filtros
        if (request.seasonId) {
            competitions = competitions.filter(c => c.SeasonId === request.seasonId);
        }
        if (request.eventId) {
            competitions = competitions.filter(c => c.EventId === request.eventId);
        }
        if (request.venueId) {
            competitions = competitions.filter(c => c.VenueId === request.venueId);
        }
        // Paginación
        const start = (page - 1) * pageSize;
        const items = competitions.slice(start, start + pageSize);
        return { total: competitions.length, page, pageSize, items };
    }
}
exports.ListCompetitionsUseCase = ListCompetitionsUseCase;
class CreateCompetitionUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        if (!request.SeasonId ||
            !request.EventId ||
            !request.VenueId ||
            !request.Alias ||
            request.TotalRaces === undefined ||
            request.Responsable === undefined ||
            request.SoloUsuariosReg === undefined) {
            throw new Error('Missing required fields: SeasonId, EventId, VenueId, Alias, TotalRaces, Responsable, SoloUsuariosReg');
        }
        return await this.repository.create(request);
    }
}
exports.CreateCompetitionUseCase = CreateCompetitionUseCase;
class UpdateCompetitionUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, request) {
        const competition = await this.repository.getById(id);
        if (!competition) {
            throw new Error('Competition not found');
        }
        const updated = await this.repository.update(id, request);
        if (!updated) {
            throw new Error('Failed to update competition');
        }
        return updated;
    }
}
exports.UpdateCompetitionUseCase = UpdateCompetitionUseCase;
class GetCompetitionUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const competition = await this.repository.getById(id);
        if (!competition) {
            throw new Error('Competition not found');
        }
        return competition;
    }
}
exports.GetCompetitionUseCase = GetCompetitionUseCase;
class DeleteCompetitionUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const competition = await this.repository.getById(id);
        if (!competition) {
            throw new Error('Competition not found');
        }
        return await this.repository.delete(id);
    }
}
exports.DeleteCompetitionUseCase = DeleteCompetitionUseCase;
