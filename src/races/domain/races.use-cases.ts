import { Race, RaceRepository } from '../repository/race.repository';

export interface UpdateRaceRequest {
  CompetitionId?: number;
  NumRace?: number;
  Fecha?: string;
  Hora?: string;
  Estado?: number;
}

export class UpdateRaceUseCase {
  constructor(private repository: RaceRepository) {}

  async execute(id: number, request: UpdateRaceRequest): Promise<Race> {
    if (
      request.CompetitionId === undefined ||
      request.NumRace === undefined ||
      request.Fecha === undefined ||
      request.Hora === undefined ||
      request.Estado === undefined
    ) {
      throw new Error('Missing required fields: CompetitionId, NumRace, Fecha, Hora, Estado');
    }

    const race = await this.repository.getById(id);
    if (!race) throw new Error('Race not found');

    const updated = await this.repository.update(id, request);
    if (!updated) {
      throw new Error('Failed to update race');
    }
    return updated;
  }
}

export class GetRaceUseCase {
  constructor(private repository: RaceRepository) {}

  async execute(id: number): Promise<Race> {
    const race = await this.repository.getById(id);
    if (!race) throw new Error('Race not found');
    return race;
  }
}