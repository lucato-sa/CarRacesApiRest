import { Router, Request, Response } from 'express';
import { SurfaceRepository } from '../repository/surface.repository';
import { ListSurfacesUseCase, CreateSurfaceUseCase, GetSurfaceUseCase } from '../domain/surface.use-cases';

export function createSurfaceRoutes(repository: SurfaceRepository): Router {
  const router = Router();
  const listUseCase = new ListSurfacesUseCase(repository);
  const createUseCase = new CreateSurfaceUseCase(repository);
  const getUseCase = new GetSurfaceUseCase(repository);

  router.get('/surfaces', async (req: Request, res: Response) => {
    try {
      const result = await listUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        q: req.query.q as string | undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/surfaces', async (req: Request, res: Response) => {
    try {
      const surface = await createUseCase.execute(req.body);
      res.status(201).json(surface);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/surfaces/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const surface = await getUseCase.execute(id);
      res.json(surface);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}