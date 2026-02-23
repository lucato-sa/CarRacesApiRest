import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad Event para persistencia en PostgreSQL
 */
@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('increment')
  event_id!: number;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'date' })
  fecha_inicio!: string;

  @Column({ type: 'date' })
  fecha_fin!: string;

  @Column({ type: 'int' })
  club_id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;
}
