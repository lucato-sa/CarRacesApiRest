export type UserEntity = {
  UserEntityId?: number;
  UserId: number;
  EntityLinkId: number;
  RolId: number;
};

export class UserEntityRepository {
  private userEntities: UserEntity[] = [
    { UserEntityId: 1, UserId: 1, EntityLinkId: 1, RolId: 1 },
  ];

  getAll(): UserEntity[] {
    return this.userEntities.slice();
  }

  create(userEntity: Omit<UserEntity, 'UserEntityId'>): UserEntity {
    const newId = Math.max(0, ...this.userEntities.map(u => u.UserEntityId || 0)) + 1;
    const newUserEntity: UserEntity = { ...userEntity, UserEntityId: newId };
    this.userEntities.push(newUserEntity);
    return newUserEntity;
  }
}
