import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad EntityLink para persistencia en PostgreSQL
 */
@Entity('entity_links')
export class EntityLinkEntity {
  @PrimaryGeneratedColumn('increment')
  entity_link_id!: number;

  @Column({ type: 'varchar', length: 100 })
  entity_name!: string;

  @Column({ type: 'int' })
  entity_id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
