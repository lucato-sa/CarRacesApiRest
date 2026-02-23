import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { UserEntityMapping } from '../entities/userentity.entity';

export type UserEntity = {
  UserEntityId?: number;
  UserId: number;
  EntityLinkId: number;
  RolId: number;
};

/**
 * Repository con PostgreSQL para persistencia de UserEntities
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class UserEntityRepository {
  private repository?: Repository<UserEntityMapping>;

  private getRepository(): Repository<UserEntityMapping> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(UserEntityMapping);
    }
    return this.repository;
  }

  /**
   * Obtiene todas las user entities
   */
  async getAll(): Promise<UserEntity[]> {
    const entities = await this.getRepository().find({ order: { user_entity_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Crea una nueva user entity
   */
  async create(userEntity: Omit<UserEntity, 'UserEntityId'>): Promise<UserEntity> {
    const entity = this.getRepository().create({
      user_id: userEntity.UserId,
      entity_link_id: userEntity.EntityLinkId,
      rol_id: userEntity.RolId,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: UserEntityMapping): UserEntity {
    return {
      UserEntityId: entity.user_entity_id,
      UserId: entity.user_id,
      EntityLinkId: entity.entity_link_id,
      RolId: entity.rol_id,
    };
  }
}