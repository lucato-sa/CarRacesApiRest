import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Registration para persistencia en PostgreSQL
 */
@Entity('registrations')
export class RegistrationEntity {
  @PrimaryGeneratedColumn('increment')
  registration_id!: number;

  @Column({ type: 'int' })
  competition_id!: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({ type: 'date' })
  fecha_registro!: string;

  @Column({ type: 'varchar', length: 50 })
  estado!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
