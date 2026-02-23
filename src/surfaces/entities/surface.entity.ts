import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Surface para persistencia en PostgreSQL
 */
@Entity('surfaces')
export class SurfaceEntity {
  @PrimaryGeneratedColumn('increment')
  surface_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  alias!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
