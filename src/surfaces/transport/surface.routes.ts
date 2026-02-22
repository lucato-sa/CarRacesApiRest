import { Router, Request, Response } from 'express';
import { SurfaceRepository } from '../repository/surface.repository';
import { ListSurfacesUseCase, CreateSurfaceUseCase, GetSurfaceUseCase } from '../domain/surface.use-cases';

export function createSurfaceRoutes(repository: SurfaceRepository): Router {
  const router = Router();
  const listUseCase = new ListSurfacesUseCase(repository);
  const createUseCase = new CreateSurfaceUseCase(repository);
  const getUseCase = new GetSurfaceUseCase(repository);

  router.get('/surfaces', (req: Request, res: Response) => {
    try {
      const result = listUseCase.execute({ page: req.query.page ? parseInt(req.query.page as string, 10) : undefined, pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined, q: req.query.q as string | undefined });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/surfaces', (req: Request, res: Response) => {
    try {
      res.status(201).json(createUseCase.execute(req.body));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/surfaces/:id', (req: Request, res: Response) => {
    try {
      res.json(getUseCase.execute(parseInt(req.params.id, 10)));
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
