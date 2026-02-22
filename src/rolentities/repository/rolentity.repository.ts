export type RolEntity = {
  RolEntityId?: number;
  EntityLinkId: number;
  RolId: number;
};

export class RolEntityRepository {
  private rolEntities: RolEntity[] = [
    { RolEntityId: 1, EntityLinkId: 1, RolId: 1 },
  ];

  getAll(): RolEntity[] {
    return this.rolEntities.slice();
  }

  create(rolEntity: Omit<RolEntity, 'RolEntityId'>): RolEntity {
    const newId = Math.max(0, ...this.rolEntities.map(r => r.RolEntityId || 0)) + 1;
    const newRolEntity: RolEntity = { ...rolEntity, RolEntityId: newId };
    this.rolEntities.push(newRolEntity);
    return newRolEntity;
  }
}
