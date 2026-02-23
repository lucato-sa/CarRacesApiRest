import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad User para persistencia en PostgreSQL
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  user_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nick!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 150 })
  apellidos!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  localidad?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provincia?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pais?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
