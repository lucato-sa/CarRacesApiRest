import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { DisciplineEntity } from '../entities/discipline.entity';

export type Discipline = {
  DisciplineId?: number;
  SpecialityId: number;
  FormatId: number;
  SurfaceId: number;
  Alias: string;
};

/**
 * Repository con PostgreSQL para persistencia de Disciplines
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class DisciplineRepository {
  private repository?: Repository<DisciplineEntity>;

  private getRepository(): Repository<DisciplineEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(DisciplineEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los disciplines
   */
  async getAll(): Promise<Discipline[]> {
    const entities = await this.getRepository().find({ order: { discipline_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un discipline por ID
   */
  async getById(id: number): Promise<Discipline | undefined> {
    const entity = await this.getRepository().findOne({ where: { discipline_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: DisciplineEntity): Discipline {
    return {
      DisciplineId: entity.discipline_id,
      SpecialityId: entity.speciality_id,
      FormatId: entity.format_id,
      SurfaceId: entity.surface_id,
      Alias: entity.alias,
    };
  }
}