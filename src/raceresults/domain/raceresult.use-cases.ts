import { RaceResult, RaceResultRepository } from '../repository/raceresult.repository';

export interface UpdateRaceResultRequest {
  RaceId?: number;
  UserId?: number;
  Posicion?: number;
  Vueltas?: number;
  PrimeraLinea?: boolean;
  VueltaRapida?: boolean;
}

export class UpdateRaceResultUseCase {
  constructor(private repository: RaceResultRepository) {}

  execute(id: number, request: UpdateRaceResultRequest): RaceResult {
    if (request.Posicion === undefined || request.UserId === undefined || request.RaceId === undefined) {
      throw new Error('Missing required fields');
    }
    const result = this.repository.getById(id);
    if (!result) throw new Error('RaceResult not found');
    return this.repository.update(id, request) as RaceResult;
  }
}
