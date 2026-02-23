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

  async execute(id: number, request: UpdateRaceResultRequest): Promise<RaceResult> {
    if (request.Posicion === undefined || request.UserId === undefined || request.RaceId === undefined) {
      throw new Error('Missing required fields: RaceId, UserId, Posicion');
    }

    const result = await this.repository.getById(id);
    if (!result) throw new Error('RaceResult not found');

    const updated = await this.repository.update(id, request);
    if (!updated) {
      throw new Error('Failed to update race result');
    }
    return updated;
  }
}

export class GetRaceResultUseCase {
  constructor(private repository: RaceResultRepository) {}

  async execute(id: number): Promise<RaceResult> {
    const result = await this.repository.getById(id);
    if (!result) throw new Error('RaceResult not found');
    return result;
  }
}