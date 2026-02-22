import express, { Application } from 'express';
import { ClubRepository } from './clubs/repository/club.repository';
import { createClubRoutes } from './clubs/transport/club.routes';

/**
 * Crea la aplicación Express con todas las capas (transporte, dominio, persistencia).
 */
export function createApp(): Application {
  const app = express();
  app.use(express.json());

  // === PERSISTENCIA: Inicializar repositorios ===
  const clubRepository = new ClubRepository();

  // === TRANSPORTE: Registrar rutas ===
  const clubRoutes = createClubRoutes(clubRepository);
  app.use('/api', clubRoutes);

  return app;
}

export default createApp();