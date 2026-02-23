import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { RaceEntity } from '../entities/race.entity';

export type Race = {
  RaceId?: number;
  CompetitionId: number;
  NumRace: number;
  Fecha: string;
  Hora: string;
  Estado: number;
};

/**
 * Repository con PostgreSQL para persistencia de Races
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class RaceRepository {
  private repository?: Repository<RaceEntity>;

  private getRepository(): Repository<RaceEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(RaceEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene una race por ID
   */
  async getById(id: number): Promise<Race | undefined> {
    const entity = await this.getRepository().findOne({ where: { race_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Actualiza una race existente
   */
  async update(id: number, race: Partial<Race>): Promise<Race | undefined> {
    const existing = await this.getRepository().findOne({ where: { race_id: id } });
    if (!existing) return undefined;

    const updates: Partial<RaceEntity> = {};
    if (race.CompetitionId !== undefined) updates.competition_id = race.CompetitionId;
    if (race.NumRace !== undefined) updates.num_race = race.NumRace;
    if (race.Fecha !== undefined) updates.fecha = race.Fecha;
    if (race.Hora !== undefined) updates.hora = race.Hora;
    if (race.Estado !== undefined) updates.estado = race.Estado;

    await this.getRepository().update({ race_id: id }, updates);
    const updated = await this.getRepository().findOne({ where: { race_id: id } });
    return updated ? this.entityToDto(updated) : undefined;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: RaceEntity): Race {
    return {
      RaceId: entity.race_id,
      CompetitionId: entity.competition_id,
      NumRace: entity.num_race,
      Fecha: entity.fecha,
      Hora: entity.hora,
      Estado: entity.estado,
    };
  }
}