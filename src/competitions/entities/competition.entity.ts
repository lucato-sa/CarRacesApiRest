import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Competition para persistencia en PostgreSQL
 */
@Entity('competitions')
export class CompetitionEntity {
  @PrimaryGeneratedColumn('increment')
  competition_id!: number;

  @Column({ type: 'int' })
  season_id!: number;

  @Column({ type: 'int' })
  event_id!: number;

  @Column({ type: 'int' })
  venue_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  alias!: string;

  @Column({ type: 'int' })
  total_races!: number;

  @Column({ type: 'date', nullable: true })
  fecha_inicio_inscrip_pri?: string;

  @Column({ type: 'date', nullable: true })
  fecha_fin_inscrip_pri?: string;

  @Column({ type: 'date', nullable: true })
  fecha_inicio_inscrip?: string;

  @Column({ type: 'date', nullable: true })
  fecha_fin_inscrip?: string;

  @Column({ type: 'int', nullable: true })
  pilotos_min_inscrip?: number;

  @Column({ type: 'int', nullable: true })
  pilotos_max_inscrip?: number;

  @Column({ type: 'int' })
  responsable!: number;

  @Column({ type: 'boolean', default: false })
  solo_usuarios_reg!: boolean;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
