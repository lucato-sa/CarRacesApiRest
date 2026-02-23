import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { SpecialityEntity } from '../entities/speciality.entity';

export type Speciality = {
  SpecialityId?: number;
  Alias: string;
  Descripcion: string;
  default?: boolean;
};

/**
 * Repository con PostgreSQL para persistencia de Specialities
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class SpecialityRepository {
  private repository?: Repository<SpecialityEntity>;

  private getRepository(): Repository<SpecialityEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(SpecialityEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los specialities
   */
  async getAll(): Promise<Speciality[]> {
    const entities = await this.getRepository().find({ order: { speciality_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un speciality por ID
   */
  async getById(id: number): Promise<Speciality | undefined> {
    const entity = await this.getRepository().findOne({ where: { speciality_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: SpecialityEntity): Speciality {
    return {
      SpecialityId: entity.speciality_id,
      Alias: entity.alias,
      Descripcion: entity.descripcion,
      default: entity.default,
    };
  }
}