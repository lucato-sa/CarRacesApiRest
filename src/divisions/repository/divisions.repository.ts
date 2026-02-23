import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { DivisionEntity } from '../entities/division.entity';

export type Division = {
  DivisionId?: number;
  DisciplineId: number;
  Alias: string;
  Descripcion: string;
};

/**
 * Repository con PostgreSQL para persistencia de Divisions
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class DivisionRepository {
  private repository?: Repository<DivisionEntity>;

  private getRepository(): Repository<DivisionEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(DivisionEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los divisions
   */
  async getAll(): Promise<Division[]> {
    const entities = await this.getRepository().find({ order: { division_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un division por ID
   */
  async getById(id: number): Promise<Division | undefined> {
    const entity = await this.getRepository().findOne({ where: { division_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: DivisionEntity): Division {
    return {
      DivisionId: entity.division_id,
      DisciplineId: entity.discipline_id,
      Alias: entity.alias,
      Descripcion: entity.descripcion,
    };
  }
}