import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { RoleEntity } from '../entities/role.entity';

export type Role = {
  RolId?: number;
  Nombre: string;
  Pseudonimo: string;
};

/**
 * Repository con PostgreSQL para persistencia de Roles
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class RoleRepository {
  private repository?: Repository<RoleEntity>;

  private getRepository(): Repository<RoleEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(RoleEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los roles
   */
  async getAll(): Promise<Role[]> {
    const entities = await this.getRepository().find({ order: { rol_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un role por ID
   */
  async getById(id: number): Promise<Role | undefined> {
    const entity = await this.getRepository().findOne({ where: { rol_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: RoleEntity): Role {
    return {
      RolId: entity.rol_id,
      Nombre: entity.nombre,
      Pseudonimo: entity.pseudonimo,
    };
  }
}