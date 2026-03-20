"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const data_source_1 = require("./database/data-source");
const PostgresBackend_1 = require("./backends/PostgresBackend");
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
        // 🆕 Usar conexión con 'pg' en lugar de TypeORM
        await (0, data_source_1.initializeDB)();
        console.log('✅ PostgreSQL/Supabase conectado exitosamente');
        // Inicializar backend PostgreSQL
        console.log('🐘 Inicializando PostgreSQL Backend...');
        const backend = new PostgresBackend_1.PostgresBackend();
        await backend.initialize();
        console.log('✅ PostgreSQL Backend inicializado');
        // Crear la aplicación Express con el backend inicializado
        const app = (0, app_1.createApp)(backend);
        // Iniciar servidor Express
        const server = app.listen(port, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
            console.log(`📊 18 tablas disponibles desde la base de datos`);
        });
        // 🆕 Manejar cierre graceful de servidor
        process.on('SIGTERM', async () => {
            console.log('📛 SIGTERM recibido, cerrando servidor...');
            server.close(async () => {
                await (0, data_source_1.closeDB)();
                process.exit(0);
            });
        });
        process.on('SIGINT', async () => {
            console.log('📛 SIGINT recibido, cerrando servidor...');
            server.close(async () => {
                await (0, data_source_1.closeDB)();
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        if (error instanceof Error) {
            console.error('   Detalles:', error.message);
        }
        process.exit(1);
    }
}
startServer();
