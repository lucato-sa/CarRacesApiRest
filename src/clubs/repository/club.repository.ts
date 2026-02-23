import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { ClubEntity } from '../entities/club.entity';

/**
 * Club DTO - Formato de transferencia de datos (sin metadatos internos)
 */
export type Club = {
  ClubId?: number;
  Alias: string;
  TaxNombre: string;
  TaxNumero: string;
  Descripcion: string;
  FechaFundacion: string;
  default?: boolean;
};

/**
 * Repository con PostgreSQL para persistencia de Clubs
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class ClubRepository {
  private repository?: Repository<ClubEntity>;

  private getRepository(): Repository<ClubEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(ClubEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los clubs
   */
  async getAll(): Promise<Club[]> {
    const entities = await this.getRepository().find({ order: { club_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un club por ID
   */
  async getById(id: number): Promise<Club | undefined> {
    const entity = await this.getRepository().findOne({ where: { club_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Obtiene un club por Alias (único)
   */
  async getByAlias(alias: string): Promise<Club | undefined> {
    const entity = await this.getRepository().findOne({ where: { alias } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Crea un nuevo club
   */
  async create(club: Omit<Club, 'ClubId'>): Promise<Club> {
    const entity = this.getRepository().create({
      alias: club.Alias,
      tax_nombre: club.TaxNombre,
      tax_numero: club.TaxNumero,
      descripcion: club.Descripcion,
      fecha_fundacion: club.FechaFundacion,
      default: club.default || false,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Actualiza un club existente
   */
  async update(id: number, club: Partial<Club>): Promise<Club | undefined> {
    const existing = await this.getRepository().findOne({ where: { club_id: id } });
    if (!existing) return undefined;

    const updates: Partial<ClubEntity> = {};
    if (club.Alias) updates.alias = club.Alias;
    if (club.TaxNombre) updates.tax_nombre = club.TaxNombre;
    if (club.TaxNumero) updates.tax_numero = club.TaxNumero;
    if (club.Descripcion) updates.descripcion = club.Descripcion;
    if (club.FechaFundacion) updates.fecha_fundacion = club.FechaFundacion;
    if (club.default !== undefined) updates.default = club.default;

    await this.getRepository().update({ club_id: id }, updates);
    const updated = await this.getRepository().findOne({ where: { club_id: id } });
    return updated ? this.entityToDto(updated) : undefined;
  }

  /**
   * Elimina un club
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.getRepository().delete({ club_id: id });
    return (result.affected || 0) > 0;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: ClubEntity): Club {
    return {
      ClubId: entity.club_id,
      Alias: entity.alias,
      TaxNombre: entity.tax_nombre,
      TaxNumero: entity.tax_numero,
      Descripcion: entity.descripcion,
      FechaFundacion: entity.fecha_fundacion,
      default: entity.default,
    };
  }
}
