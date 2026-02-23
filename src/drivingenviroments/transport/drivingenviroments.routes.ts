import { Router, Request, Response } from 'express';
import { DrivingEnvironmentRepository } from '../repository/drivingenvironment.repository';
import {
  ListDrivingEnvironmentsUseCase,
  CreateDrivingEnvironmentUseCase,
  GetDrivingEnvironmentUseCase,
} from '../domain/drivingenvironment.use-cases';

export function createDrivingEnvironmentRoutes(repository: DrivingEnvironmentRepository): Router {
  const router = Router();
  const listUseCase = new ListDrivingEnvironmentsUseCase(repository);
  const createUseCase = new CreateDrivingEnvironmentUseCase(repository);
  const getUseCase = new GetDrivingEnvironmentUseCase(repository);

  router.get('/drivingenvironments', async (req: Request, res: Response) => {
    try {
      const result = await listUseCase.execute({
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

  router.post('/drivingenvironments', async (req: Request, res: Response) => {
    try {
      const env = await createUseCase.execute(req.body);
      res.status(201).json(env);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/drivingenvironments/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const env = await getUseCase.execute(id);
      res.json(env);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}