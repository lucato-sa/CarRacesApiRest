"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEventUseCase = exports.GetEventUseCase = exports.UpdateEventUseCase = exports.CreateEventUseCase = exports.ListEventsUseCase = void 0;
class ListEventsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        const page = Math.max(1, request.page || 1);
        const pageSize = Math.max(1, request.pageSize || 20);
        let events = this.repository.getAll();
        // Aplicar filtros
        if (request.clubId) {
            events = events.filter(e => e.ClubId === request.clubId);
        }
        if (request.from) {
            events = events.filter(e => e.FechaInicio >= request.from);
        }
        if (request.to) {
            events = events.filter(e => e.FechaFin <= request.to);
        }
        // Paginación
        const start = (page - 1) * pageSize;
        const items = events.slice(start, start + pageSize);
        return { total: events.length, page, pageSize, items };
    }
}
exports.ListEventsUseCase = ListEventsUseCase;
class CreateEventUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) {
        if (!request.Descripcion || !request.FechaInicio || !request.FechaFin || !request.ClubId) {
            throw new Error('Missing required fields: Descripcion, FechaInicio, FechaFin, ClubId');
        }
        return this.repository.create(request);
    }
}
exports.CreateEventUseCase = CreateEventUseCase;
class UpdateEventUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id, request) {
        const event = this.repository.getById(id);
        if (!event) {
            throw new Error('Event not found');
        }
        return this.repository.update(id, request);
    }
}
exports.UpdateEventUseCase = UpdateEventUseCase;
class GetEventUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id) {
        const event = this.repository.getById(id);
        if (!event) {
            throw new Error('Event not found');
        }
        return event;
    }
}
exports.GetEventUseCase = GetEventUseCase;
class DeleteEventUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id) {
        const event = this.repository.getById(id);
        if (!event) {
            throw new Error('Event not found');
        }
        return this.repository.delete(id);
    }
}
exports.DeleteEventUseCase = DeleteEventUseCase;
