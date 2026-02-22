import { EntityLink, EntityLinkRepository } from '../repository/entitylink.repository';

export class ListEntityLinksUseCase {
  constructor(private repository: EntityLinkRepository) {}
  execute(): EntityLink[] {
    return this.repository.getAll();
  }
}
