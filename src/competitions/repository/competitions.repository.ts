import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { CompetitionEntity } from '../entities/competition.entity';

export type Competition = {
  CompetitionId?: number;
  SeasonId: number;
  EventId: number;
  VenueId: number;
  Alias: string;
  TotalRaces: number;
  FechaInicioInscripPri?: string;
  FechaFinInscripPri?: string;
  FechaInicioInscrip?: string;
  FechaFinInscrip?: string;
  PilotosMinInscrip?: number;
  PilotosMaxInscrip?: number;
  Responsable: number;
  SoloUsuariosReg: boolean;
  Notas?: string;
};

/**
 * Repository con PostgreSQL para persistencia de Competitions
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class CompetitionRepository {
  private repository?: Repository<CompetitionEntity>;

  private getRepository(): Repository<CompetitionEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(CompetitionEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los competitions
   */
  async getAll(): Promise<Competition[]> {
    const entities = await this.getRepository().find({ order: { competition_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un competition por ID
   */
  async getById(id: number): Promise<Competition | undefined> {
    const entity = await this.getRepository().findOne({ where: { competition_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Crea un nuevo competition
   */
  async create(competition: Omit<Competition, 'CompetitionId'>): Promise<Competition> {
    const entity = this.getRepository().create({
      season_id: competition.SeasonId,
      event_id: competition.EventId,
      venue_id: competition.VenueId,
      alias: competition.Alias,
      total_races: competition.TotalRaces,
      fecha_inicio_inscrip_pri: competition.FechaInicioInscripPri,
      fecha_fin_inscrip_pri: competition.FechaFinInscripPri,
      fecha_inicio_inscrip: competition.FechaInicioInscrip,
      fecha_fin_inscrip: competition.FechaFinInscrip,
      pilotos_min_inscrip: competition.PilotosMinInscrip,
      pilotos_max_inscrip: competition.PilotosMaxInscrip,
      responsable: competition.Responsable,
      solo_usuarios_reg: competition.SoloUsuariosReg,
      notas: competition.Notas,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Actualiza un competition existente
   */
  async update(id: number, competition: Partial<Competition>): Promise<Competition | undefined> {
    const existing = await this.getRepository().findOne({ where: { competition_id: id } });
    if (!existing) return undefined;

    const updates: Partial<CompetitionEntity> = {};
    if (competition.SeasonId !== undefined) updates.season_id = competition.SeasonId;
    if (competition.EventId !== undefined) updates.event_id = competition.EventId;
    if (competition.VenueId !== undefined) updates.venue_id = competition.VenueId;
    if (competition.Alias !== undefined) updates.alias = competition.Alias;
    if (competition.TotalRaces !== undefined) updates.total_races = competition.TotalRaces;
    if (competition.FechaInicioInscripPri !== undefined) updates.fecha_inicio_inscrip_pri = competition.FechaInicioInscripPri;
    if (competition.FechaFinInscripPri !== undefined) updates.fecha_fin_inscrip_pri = competition.FechaFinInscripPri;
    if (competition.FechaInicioInscrip !== undefined) updates.fecha_inicio_inscrip = competition.FechaInicioInscrip;
    if (competition.FechaFinInscrip !== undefined) updates.fecha_fin_inscrip = competition.FechaFinInscrip;
    if (competition.PilotosMinInscrip !== undefined) updates.pilotos_min_inscrip = competition.PilotosMinInscrip;
    if (competition.PilotosMaxInscrip !== undefined) updates.pilotos_max_inscrip = competition.PilotosMaxInscrip;
    if (competition.Responsable !== undefined) updates.responsable = competition.Responsable;
    if (competition.SoloUsuariosReg !== undefined) updates.solo_usuarios_reg = competition.SoloUsuariosReg;
    if (competition.Notas !== undefined) updates.notas = competition.Notas;

    await this.getRepository().update({ competition_id: id }, updates);
    const updated = await this.getRepository().findOne({ where: { competition_id: id } });
    return updated ? this.entityToDto(updated) : undefined;
  }

  /**
   * Elimina un competition
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.getRepository().delete({ competition_id: id });
    return (result.affected || 0) > 0;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: CompetitionEntity): Competition {
    return {
      CompetitionId: entity.competition_id,
      SeasonId: entity.season_id,
      EventId: entity.event_id,
      VenueId: entity.venue_id,
      Alias: entity.alias,
      TotalRaces: entity.total_races,
      FechaInicioInscripPri: entity.fecha_inicio_inscrip_pri,
      FechaFinInscripPri: entity.fecha_fin_inscrip_pri,
      FechaInicioInscrip: entity.fecha_inicio_inscrip,
      FechaFinInscrip: entity.fecha_fin_inscrip,
      PilotosMinInscrip: entity.pilotos_min_inscrip,
      PilotosMaxInscrip: entity.pilotos_max_inscrip,
      Responsable: entity.responsable,
      SoloUsuariosReg: entity.solo_usuarios_reg,
      Notas: entity.notas,
    };
  }
}