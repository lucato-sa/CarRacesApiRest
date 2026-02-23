import 'reflect-metadata';
import { DataSource } from 'typeorm';

/**
 * Configuración de conexión a PostgreSQL usando TypeORM
 * Soporta tanto Supabase como PostgreSQL local
 */

const isProduction = process.env.NODE_ENV === 'production';
const isSupabase = process.env.DB_HOST?.includes('supabase.co');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'carracesapi',
  synchronize: !isProduction, // Auto-crear tablas en desarrollo
  logging: process.env.DB_LOGGING === 'true', // Logs de SQL si está habilitado
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  
  // Configuración SSL para Supabase (requerido)
  ...(isSupabase && {
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false, // Para desarrollo, acepta certificados auto-firmados
      },
    },
  }),
});
