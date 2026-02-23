import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Championship para persistencia en PostgreSQL
 */
@Entity('championships')
export class ChampionshipEntity {
  @PrimaryGeneratedColumn('increment')
  championship_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  alias!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'int' })
  club_id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
