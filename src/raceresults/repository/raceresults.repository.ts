import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { RaceResultEntity } from '../entities/raceresult.entity';

export type RaceResult = {
  ResultId?: number;
  RaceId: number;
  UserId: number;
  Posicion: number;
  Vueltas?: number;
  PrimeraLinea?: boolean;
  VueltaRapida?: boolean;
};

/**
 * Repository con PostgreSQL para persistencia de RaceResults
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class RaceResultRepository {
  private repository?: Repository<RaceResultEntity>;

  private getRepository(): Repository<RaceResultEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(RaceResultEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene un race result por ID
   */
  async getById(id: number): Promise<RaceResult | undefined> {
    const entity = await this.getRepository().findOne({ where: { result_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Actualiza un race result existente
   */
  async update(id: number, result: Partial<RaceResult>): Promise<RaceResult | undefined> {
    const existing = await this.getRepository().findOne({ where: { result_id: id } });
    if (!existing) return undefined;

    const updates: Partial<RaceResultEntity> = {};
    if (result.RaceId !== undefined) updates.race_id = result.RaceId;
    if (result.UserId !== undefined) updates.user_id = result.UserId;
    if (result.Posicion !== undefined) updates.posicion = result.Posicion;
    if (result.Vueltas !== undefined) updates.vueltas = result.Vueltas;
    if (result.PrimeraLinea !== undefined) updates.primera_linea = result.PrimeraLinea;
    if (result.VueltaRapida !== undefined) updates.vuelta_rapida = result.VueltaRapida;

    await this.getRepository().update({ result_id: id }, updates);
    const updated = await this.getRepository().findOne({ where: { result_id: id } });
    return updated ? this.entityToDto(updated) : undefined;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: RaceResultEntity): RaceResult {
    return {
      ResultId: entity.result_id,
      RaceId: entity.race_id,
      UserId: entity.user_id,
      Posicion: entity.posicion,
      Vueltas: entity.vueltas,
      PrimeraLinea: entity.primera_linea,
      VueltaRapida: entity.vuelta_rapida,
    };
  }
}