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

  execute(id: number, request: UpdateRaceRequest): Race {
    if (request.CompetitionId === undefined || request.NumRace === undefined || request.Fecha === undefined || request.Hora === undefined || request.Estado === undefined) {
      throw new Error('Missing required fields');
    }
    const race = this.repository.getById(id);
    if (!race) throw new Error('Race not found');
    return this.repository.update(id, request) as Race;
  }
}
