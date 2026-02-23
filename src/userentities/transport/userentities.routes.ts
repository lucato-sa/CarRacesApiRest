import { Router, Request, Response } from 'express';
import { UserEntityRepository } from '../repository/userentity.repository';
import { ListUserEntitiesUseCase, CreateUserEntityUseCase } from '../domain/userentity.use-cases';

export function createUserEntityRoutes(repository: UserEntityRepository): Router {
  const router = Router();
  const listUseCase = new ListUserEntitiesUseCase(repository);
  const createUseCase = new CreateUserEntityUseCase(repository);

  router.get('/userentities', async (req: Request, res: Response) => {
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

  router.post('/userentities', async (req: Request, res: Response) => {
    try {
      const userEntity = await createUseCase.execute(req.body);
      res.status(201).json(userEntity);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}