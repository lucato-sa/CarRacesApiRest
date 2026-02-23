import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { DrivingEnvironmentEntity } from '../entities/drivingenvironment.entity';

export type DrivingEnvironment = {
  DrivingEnviromentId?: number;
  Alias: string;
  Descripcion: string;
  default?: boolean;
};

/**
 * Repository con PostgreSQL para persistencia de DrivingEnvironments
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class DrivingEnvironmentRepository {
  private repository?: Repository<DrivingEnvironmentEntity>;

  private getRepository(): Repository<DrivingEnvironmentEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(DrivingEnvironmentEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los driving environments
   */
  async getAll(): Promise<DrivingEnvironment[]> {
    const entities = await this.getRepository().find({ order: { driving_environment_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un driving environment por ID
   */
  async getById(id: number): Promise<DrivingEnvironment | undefined> {
    const entity = await this.getRepository().findOne({ where: { driving_environment_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Crea un nuevo driving environment
   */
  async create(env: Omit<DrivingEnvironment, 'DrivingEnviromentId'>): Promise<DrivingEnvironment> {
    const entity = this.getRepository().create({
      alias: env.Alias,
      descripcion: env.Descripcion,
      default: env.default || false,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: DrivingEnvironmentEntity): DrivingEnvironment {
    return {
      DrivingEnviromentId: entity.driving_environment_id,
      Alias: entity.alias,
      Descripcion: entity.descripcion,
      default: entity.default,
    };
  }
}