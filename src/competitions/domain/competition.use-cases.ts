import { Competition, CompetitionRepository } from '../repository/competition.repository';

export interface ListCompetitionsRequest {
  page?: number;
  pageSize?: number;
  seasonId?: number;
  eventId?: number;
  venueId?: number;
}

export interface ListCompetitionsResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Competition[];
}

export class ListCompetitionsUseCase {
  constructor(private repository: CompetitionRepository) {}

  execute(request: ListCompetitionsRequest): ListCompetitionsResponse {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 20);

    let competitions = this.repository.getAll();

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

export interface CreateCompetitionRequest {
  SeasonId: number;
  EventId: number;
  VenueId: number;
  Alias: string;
  TotalRaces: number;
  FechaInicioInscripPri?: string;
  FechaFinInscripPri?: string;
  FechaInicioInscrip?: string;
  FechaFinInscrip?: string;
  PilotosMinInscrip?: number;
  PilotosMaxInscrip?: number;
  Responsable: number;
  SoloUsuariosReg: boolean;
  Notas?: string;
}

export class CreateCompetitionUseCase {
  constructor(private repository: CompetitionRepository) {}

  execute(request: CreateCompetitionRequest): Competition {
    if (
      !request.SeasonId ||
      !request.EventId ||
      !request.VenueId ||
      !request.Alias ||
      request.TotalRaces === undefined ||
      request.Responsable === undefined ||
      request.SoloUsuariosReg === undefined
    ) {
      throw new Error(
        'Missing required fields: SeasonId, EventId, VenueId, Alias, TotalRaces, Responsable, SoloUsuariosReg',
      );
    }

    return this.repository.create(request);
  }
}

export interface UpdateCompetitionRequest {
  SeasonId?: number;
  EventId?: number;
  VenueId?: number;
  Alias?: string;
  TotalRaces?: number;
  FechaInicioInscripPri?: string;
  FechaFinInscripPri?: string;
  FechaInicioInscrip?: string;
  FechaFinInscrip?: string;
  PilotosMinInscrip?: number;
  PilotosMaxInscrip?: number;
  Responsable?: number;
  SoloUsuariosReg?: boolean;
  Notas?: string;
}

export class UpdateCompetitionUseCase {
  constructor(private repository: CompetitionRepository) {}

  execute(id: number, request: UpdateCompetitionRequest): Competition {
    const competition = this.repository.getById(id);
    if (!competition) {
      throw new Error('Competition not found');
    }

    return this.repository.update(id, request) as Competition;
  }
}

export class GetCompetitionUseCase {
  constructor(private repository: CompetitionRepository) {}

  execute(id: number): Competition {
    const competition = this.repository.getById(id);
    if (!competition) {
      throw new Error('Competition not found');
    }
    return competition;
  }
}

export class DeleteCompetitionUseCase {
  constructor(private repository: CompetitionRepository) {}

  execute(id: number): boolean {
    const competition = this.repository.getById(id);
    if (!competition) {
      throw new Error('Competition not found');
    }
    return this.repository.delete(id);
  }
}
