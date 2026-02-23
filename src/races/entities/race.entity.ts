import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Race para persistencia en PostgreSQL
 */
@Entity('races')
export class RaceEntity {
  @PrimaryGeneratedColumn('increment')
  race_id!: number;

  @Column({ type: 'int' })
  competition_id!: number;

  @Column({ type: 'int' })
  num_race!: number;

  @Column({ type: 'date' })
  fecha!: string;

  @Column({ type: 'varchar', length: 50 })
  hora!: string;

  @Column({ type: 'int' })
  estado!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
