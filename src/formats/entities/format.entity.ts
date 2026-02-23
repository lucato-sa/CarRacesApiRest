import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Format para persistencia en PostgreSQL
 */
@Entity('formats')
export class FormatEntity {
  @PrimaryGeneratedColumn('increment')
  format_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  alias!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
