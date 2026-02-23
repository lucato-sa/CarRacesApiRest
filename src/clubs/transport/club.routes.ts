import { Router, Request, Response } from 'express';
import { ClubRepository } from '../repository/club.repository';
import { ListClubsUseCase, CreateClubUseCase } from '../domain/club.use-cases';

/**
 * Router para endpoints de Clubs.
 * Maneja solo serialización/deserialización y mapeo HTTP.
 */
export function createClubRoutes(repository: ClubRepository): Router {
  const router = Router();
  const listClubsUseCase = new ListClubsUseCase(repository);
  const createClubUseCase = new CreateClubUseCase(repository);

  // GET /api/clubs - listar con filtrado y paginación
  router.get('/clubs', async (req: Request, res: Response) => {
    try {
      const result = await listClubsUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        q: req.query.q as string | undefined,
        alias: req.query.alias as string | undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // POST /api/clubs - crear club
  router.post('/clubs', async (req: Request, res: Response) => {
    try {
      const club = await createClubUseCase.execute(req.body);
      res.status(201).json(club);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}
