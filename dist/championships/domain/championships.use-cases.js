"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChampionshipUseCase = exports.ListChampionshipsUseCase = void 0;
class ListChampionshipsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let champs = await this.repository.getAll();
        if (request.clubId) {
            champs = champs.filter(c => c.ClubId === request.clubId);
        }
        const start = (page - 1) * pageSize;
        const items = champs.slice(start, start + pageSize);
        return { total: champs.length, page, pageSize, items };
    }
}
exports.ListChampionshipsUseCase = ListChampionshipsUseCase;
class GetChampionshipUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const champ = await this.repository.getById(id);
        if (!champ)
            throw new Error('Championship not found');
        return champ;
    }
}
exports.GetChampionshipUseCase = GetChampionshipUseCase;
