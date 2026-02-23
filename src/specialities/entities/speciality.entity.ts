import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Speciality para persistencia en PostgreSQL
 */
@Entity('specialities')
export class SpecialityEntity {
  @PrimaryGeneratedColumn('increment')
  speciality_id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  alias!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'boolean', default: false })
  default?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
