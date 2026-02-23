import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Discipline para persistencia en PostgreSQL
 */
@Entity('disciplines')
export class DisciplineEntity {
  @PrimaryGeneratedColumn('increment')
  discipline_id!: number;

  @Column({ type: 'int' })
  speciality_id!: number;

  @Column({ type: 'int' })
  format_id!: number;

  @Column({ type: 'int' })
  surface_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  alias!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
