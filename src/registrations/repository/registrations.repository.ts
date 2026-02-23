import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { RegistrationEntity } from '../entities/registration.entity';

export type Registration = {
  RegistrationId?: number;
  CompetitionId: number;
  UserId: number;
  FechaRegistro: string;
  Estado: string;
};

/**
 * Repository con PostgreSQL para persistencia de Registrations
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class RegistrationRepository {
  private repository?: Repository<RegistrationEntity>;

  private getRepository(): Repository<RegistrationEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(RegistrationEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los registrations
   */
  async getAll(): Promise<Registration[]> {
    const entities = await this.getRepository().find({ order: { registration_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un registration por ID
   */
  async getById(id: number): Promise<Registration | undefined> {
    const entity = await this.getRepository().findOne({ where: { registration_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Crea un nuevo registration
   */
  async create(registration: Omit<Registration, 'RegistrationId'>): Promise<Registration> {
    const entity = this.getRepository().create({
      competition_id: registration.CompetitionId,
      user_id: registration.UserId,
      fecha_registro: registration.FechaRegistro,
      estado: registration.Estado,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Elimina un registration
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.getRepository().delete({ registration_id: id });
    return (result.affected || 0) > 0;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: RegistrationEntity): Registration {
    return {
      RegistrationId: entity.registration_id,
      CompetitionId: entity.competition_id,
      UserId: entity.user_id,
      FechaRegistro: entity.fecha_registro,
      Estado: entity.estado,
    };
  }
}