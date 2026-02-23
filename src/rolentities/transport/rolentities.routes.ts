import { Router, Request, Response } from 'express';
import { RolEntityRepository } from '../repository/rolentity.repository';
import { ListRolEntitiesUseCase, CreateRolEntityUseCase } from '../domain/rolentity.use-cases';

export function createRolEntityRoutes(repository: RolEntityRepository): Router {
  const router = Router();
  const listUseCase = new ListRolEntitiesUseCase(repository);
  const createUseCase = new CreateRolEntityUseCase(repository);

  router.get('/rolentities', async (req: Request, res: Response) => {
    try {
      const result = await listUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/rolentities', async (req: Request, res: Response) => {
    try {
      const rolEntity = await createUseCase.execute(req.body);
      res.status(201).json(rolEntity);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}