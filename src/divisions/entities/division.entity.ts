import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Division para persistencia en PostgreSQL
 */
@Entity('divisions')
export class DivisionEntity {
  @PrimaryGeneratedColumn('increment')
  division_id!: number;

  @Column({ type: 'int' })
  discipline_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  alias!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
