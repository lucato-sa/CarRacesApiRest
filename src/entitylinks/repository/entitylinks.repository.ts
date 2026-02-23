import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { EntityLinkEntity } from '../entities/entitylink.entity';

export type EntityLink = {
  EntityLinkId?: number;
  EntityName: string;
  EntityId: number;
};

/**
 * Repository con PostgreSQL para persistencia de EntityLinks
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class EntityLinkRepository {
  private repository?: Repository<EntityLinkEntity>;

  private getRepository(): Repository<EntityLinkEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(EntityLinkEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los entity links
   */
  async getAll(): Promise<EntityLink[]> {
    const entities = await this.getRepository().find({ order: { entity_link_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un entity link por ID
   */
  async getById(id: number): Promise<EntityLink | undefined> {
    const entity = await this.getRepository().findOne({ where: { entity_link_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: EntityLinkEntity): EntityLink {
    return {
      EntityLinkId: entity.entity_link_id,
      EntityName: entity.entity_name,
      EntityId: entity.entity_id,
    };
  }
}