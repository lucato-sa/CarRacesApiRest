import 'ts-node/register/transpile-only'; // <--- habilita imports .ts
import { beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { createApp } from '../src/app';
import { AppDataSource } from '../src/database/data-source';

let pool: Pool;
let app: any;

beforeAll(async () => {
  try {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // inicializar TypeORM/Supabase
    await AppDataSource.initialize();
    console.log('🔌 AppDataSource inicializado');

    app = createApp();

    const client = await pool.connect();
    console.log('✅ Conectado a Supabase para tests');
    client.release();
  } catch (error) {
    console.error('❌ Error en setup de tests:', error);
    throw error;
  }
});

afterAll(async () => {
  await pool.end();
  console.log('❌ Desconectado de Supabase');
});

export { pool, app };