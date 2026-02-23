import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad UserEntity para persistencia en PostgreSQL
 */
@Entity('user_entities')
export class UserEntityMapping {
  @PrimaryGeneratedColumn('increment')
  user_entity_id!: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({ type: 'int' })
  entity_link_id!: number;

  @Column({ type: 'int' })
  rol_id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
