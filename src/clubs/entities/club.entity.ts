import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Club para persistencia en PostgreSQL
 */
@Entity('clubs')
export class ClubEntity {
  @PrimaryGeneratedColumn('increment')
  club_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  alias!: string;

  @Column({ type: 'varchar', length: 255 })
  tax_nombre!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  tax_numero!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'date' })
  fecha_fundacion!: string;

  @Column({ type: 'boolean', default: false })
  default?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
