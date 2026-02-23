import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad RaceResult para persistencia en PostgreSQL
 */
@Entity('race_results')
export class RaceResultEntity {
  @PrimaryGeneratedColumn('increment')
  result_id!: number;

  @Column({ type: 'int' })
  race_id!: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({ type: 'int' })
  posicion!: number;

  @Column({ type: 'int', nullable: true })
  vueltas?: number;

  @Column({ type: 'boolean', nullable: true })
  primera_linea?: boolean;

  @Column({ type: 'boolean', nullable: true })
  vuelta_rapida?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
