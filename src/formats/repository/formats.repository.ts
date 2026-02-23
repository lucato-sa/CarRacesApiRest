import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { FormatEntity } from '../entities/format.entity';

export type Format = {
  FormatId?: number;
  Alias: string;
  Descripcion: string;
};

/**
 * Repository con PostgreSQL para persistencia de Formats
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class FormatRepository {
  private repository?: Repository<FormatEntity>;

  private getRepository(): Repository<FormatEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(FormatEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los formats
   */
  async getAll(): Promise<Format[]> {
    const entities = await this.getRepository().find({ order: { format_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un format por ID
   */
  async getById(id: number): Promise<Format | undefined> {
    const entity = await this.getRepository().findOne({ where: { format_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Crea un nuevo format
   */
  async create(format: Omit<Format, 'FormatId'>): Promise<Format> {
    const entity = this.getRepository().create({
      alias: format.Alias,
      descripcion: format.Descripcion,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: FormatEntity): Format {
    return {
      FormatId: entity.format_id,
      Alias: entity.alias,
      Descripcion: entity.descripcion,
    };
  }
}