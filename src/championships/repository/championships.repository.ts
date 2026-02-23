import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { ChampionshipEntity } from '../entities/championship.entity';

export type Championship = {
  ChampionshipId?: number;
  Alias: string;
  Descripcion?: string;
  ClubId: number;
};

/**
 * Repository con PostgreSQL para persistencia de Championships
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class ChampionshipRepository {
  private repository?: Repository<ChampionshipEntity>;

  private getRepository(): Repository<ChampionshipEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(ChampionshipEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los championships
   */
  async getAll(): Promise<Championship[]> {
    const entities = await this.getRepository().find({ order: { championship_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un championship por ID
   */
  async getById(id: number): Promise<Championship | undefined> {
    const entity = await this.getRepository().findOne({ where: { championship_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: ChampionshipEntity): Championship {
    return {
      ChampionshipId: entity.championship_id,
      Alias: entity.alias,
      Descripcion: entity.descripcion,
      ClubId: entity.club_id,
    };
  }
}