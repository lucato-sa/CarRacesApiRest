export type EntityLink = {
  EntityLinkId?: number;
  EntityName: string;
  EntityId: number;
};

export class EntityLinkRepository {
  private links: EntityLink[] = [
    { EntityLinkId: 1, EntityName: 'Club', EntityId: 1 },
  ];

  getAll(): EntityLink[] {
    return this.links.slice();
  }

  getById(id: number): EntityLink | undefined {
    return this.links.find(l => l.EntityLinkId === id);
  }
}
