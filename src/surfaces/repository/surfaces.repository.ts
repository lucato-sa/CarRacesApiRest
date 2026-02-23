import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { SurfaceEntity } from '../entities/surface.entity';

export type Surface = {
  SurfaceId?: number;
  Alias: string;
  Descripcion: string;
};

/**
 * Repository con PostgreSQL para persistencia de Surfaces
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class SurfaceRepository {
  private repository?: Repository<SurfaceEntity>;

  private getRepository(): Repository<SurfaceEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(SurfaceEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los surfaces
   */
  async getAll(): Promise<Surface[]> {
    const entities = await this.getRepository().find({ order: { surface_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un surface por ID
   */
  async getById(id: number): Promise<Surface | undefined> {
    const entity = await this.getRepository().findOne({ where: { surface_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Crea un nuevo surface
   */
  async create(surface: Omit<Surface, 'SurfaceId'>): Promise<Surface> {
    const entity = this.getRepository().create({
      alias: surface.Alias,
      descripcion: surface.Descripcion,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: SurfaceEntity): Surface {
    return {
      SurfaceId: entity.surface_id,
      Alias: entity.alias,
      Descripcion: entity.descripcion,
    };
  }
}