import { Championship, ChampionshipRepository } from '../repository/championship.repository';

export interface ListChampionshipsRequest {
  page?: number;
  pageSize?: number;
  clubId?: number;
}

export interface ListChampionshipsResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Championship[];
}

export class ListChampionshipsUseCase {
  constructor(private repository: ChampionshipRepository) {}

  async execute(request: ListChampionshipsRequest): Promise<ListChampionshipsResponse> {
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

export class GetChampionshipUseCase {
  constructor(private repository: ChampionshipRepository) {}

  async execute(id: number): Promise<Championship> {
    const champ = await this.repository.getById(id);
    if (!champ) throw new Error('Championship not found');
    return champ;
  }
}