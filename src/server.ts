import { createApp } from './app';
import { AppDataSource } from './database/data-source';

const app = createApp();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

/**
 * Inicializa la conexión a la base de datos y arranca el servidor.
 */
async function startServer() {
  try {
    // Inicializar conexión a PostgreSQL/Supabase
    console.log('📡 Conectando a base de datos...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Puerto: ${process.env.DB_PORT}`);
    console.log(`   BD: ${process.env.DB_NAME}`);
    
    await AppDataSource.initialize();
    // eslint-disable-next-line no-console
    console.log('✅ PostgreSQL/Supabase conectado exitosamente');

    // Iniciar servidor Express
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
      console.log(`📊 18 tablas disponibles desde la base de datos`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error al iniciar servidor:', error);
    if (error instanceof Error) {
      console.error('   Detalles:', error.message);
    }
    process.exit(1);
  }
}

startServer();

export default app;
