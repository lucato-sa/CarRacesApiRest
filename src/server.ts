import { createApp } from './app';
import { AppDataSource } from './database/data-source';

const app = createApp();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

/**
 * Inicializa la conexión a la base de datos y arranca el servidor.
 */
async function startServer() {
  try {
    // Inicializar conexión a PostgreSQL
    await AppDataSource.initialize();
    // eslint-disable-next-line no-console
    console.log('✅ PostgreSQL connected successfully');

    // Iniciar servidor Express
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
