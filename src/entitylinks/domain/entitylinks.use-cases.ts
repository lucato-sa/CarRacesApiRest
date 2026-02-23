import { EntityLink, EntityLinkRepository } from '../repository/entitylink.repository';

export class ListEntityLinksUseCase {
  constructor(private repository: EntityLinkRepository) {}

  async execute(): Promise<EntityLink[]> {
    return await this.repository.getAll();
  }
}