import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad RolEntity para persistencia en PostgreSQL
 */
@Entity('rol_entities')
export class RolEntityMapping {
  @PrimaryGeneratedColumn('increment')
  rol_entity_id!: number;

  @Column({ type: 'int' })
  entity_link_id!: number;

  @Column({ type: 'int' })
  rol_id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
