import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { UserEntity } from '../entities/user.entity';

export type User = {
  UserId?: number;
  Nick: string;
  Nombre: string;
  Apellidos: string;
  Email: string;
  Direccion?: string;
  Localidad?: string;
  Provincia?: string;
  Pais?: string;
};

/**
 * Repository con PostgreSQL para persistencia de Users
 * Utiliza TypeORM para gestionar la conexión y operaciones SQL
 */
export class UserRepository {
  private repository?: Repository<UserEntity>;

  private getRepository(): Repository<UserEntity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository(UserEntity);
    }
    return this.repository;
  }

  /**
   * Obtiene todos los usuarios
   */
  async getAll(): Promise<User[]> {
    const entities = await this.getRepository().find({ order: { user_id: 'ASC' } });
    return entities.map(e => this.entityToDto(e));
  }

  /**
   * Obtiene un usuario por ID
   */
  async getById(id: number): Promise<User | undefined> {
    const entity = await this.getRepository().findOne({ where: { user_id: id } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Obtiene un usuario por Nick (único)
   */
  async getByNick(nick: string): Promise<User | undefined> {
    const entity = await this.getRepository().findOne({ where: { nick } });
    return entity ? this.entityToDto(entity) : undefined;
  }

  /**
   * Crea un nuevo usuario
   */
  async create(user: Omit<User, 'UserId'>): Promise<User> {
    const entity = this.getRepository().create({
      nick: user.Nick,
      nombre: user.Nombre,
      apellidos: user.Apellidos,
      email: user.Email,
      direccion: user.Direccion,
      localidad: user.Localidad,
      provincia: user.Provincia,
      pais: user.Pais,
    });

    const saved = await this.getRepository().save(entity);
    return this.entityToDto(saved);
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: number, user: Partial<User>): Promise<User | undefined> {
    const existing = await this.getRepository().findOne({ where: { user_id: id } });
    if (!existing) return undefined;

    const updates: Partial<UserEntity> = {};
    if (user.Nick) updates.nick = user.Nick;
    if (user.Nombre) updates.nombre = user.Nombre;
    if (user.Apellidos) updates.apellidos = user.Apellidos;
    if (user.Email) updates.email = user.Email;
    if (user.Direccion !== undefined) updates.direccion = user.Direccion;
    if (user.Localidad !== undefined) updates.localidad = user.Localidad;
    if (user.Provincia !== undefined) updates.provincia = user.Provincia;
    if (user.Pais !== undefined) updates.pais = user.Pais;

    await this.getRepository().update({ user_id: id }, updates);
    const updated = await this.getRepository().findOne({ where: { user_id: id } });
    return updated ? this.entityToDto(updated) : undefined;
  }

  /**
   * Elimina un usuario
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.getRepository().delete({ user_id: id });
    return (result.affected || 0) > 0;
  }

  /**
   * Convierte una entidad TypeORM a DTO
   */
  private entityToDto(entity: UserEntity): User {
    return {
      UserId: entity.user_id,
      Nick: entity.nick,
      Nombre: entity.nombre,
      Apellidos: entity.apellidos,
      Email: entity.email,
      Direccion: entity.direccion,
      Localidad: entity.localidad,
      Provincia: entity.provincia,
      Pais: entity.pais,
    };
  }
}

