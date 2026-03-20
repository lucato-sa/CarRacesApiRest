"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEntityLinksUseCase = void 0;
class ListEntityLinksUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute() {
        return this.repository.getAll();
    }
}
exports.ListEntityLinksUseCase = ListEntityLinksUseCase;
