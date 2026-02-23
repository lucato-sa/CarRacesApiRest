import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { RolEntityMapping } from '../entities/rolentity.entity';

export type RolEntity = {
  RolEntityId?: number;
  EntityLinkId: number;
  RolId: number;
};

/**
 * Repository con PostgreSQL para persistencia de RolEntities
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class RolEntityRepository {
  private repository?: Repository<RolEntityMapping>;

  private getRepository(): Repository<RolEntityMapping> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(RolEntityMapping);
    }
    return this.repository;
  }

  /**
   * Obtiene todas las rol entities
   */
  async getAll(): Promise<RolEntity[]> {
    const entities = await this.getRepository().find({ order: { rol_entity_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Crea una nueva rol entity
   */
  async create(rolEntity: Omit<RolEntity, 'RolEntityId'>): Promise<RolEntity> {
    const entity = this.getRepository().create({
      entity_link_id: rolEntity.EntityLinkId,
      rol_id: rolEntity.RolId,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: RolEntityMapping): RolEntity {
    return {
      RolEntityId: entity.rol_entity_id,
      EntityLinkId: entity.entity_link_id,
      RolId: entity.rol_id,
    };
  }
}