import { Router, Request, Response } from 'express';
import { DrivingEnvironmentRepository } from '../repository/drivingenvironment.repository';
import { ListDrivingEnvironmentsUseCase, CreateDrivingEnvironmentUseCase, GetDrivingEnvironmentUseCase } from '../domain/drivingenvironment.use-cases';

export function createDrivingEnvironmentRoutes(repository: DrivingEnvironmentRepository): Router {
  const router = Router();
  const listUseCase = new ListDrivingEnvironmentsUseCase(repository);
  const createUseCase = new CreateDrivingEnvironmentUseCase(repository);
  const getUseCase = new GetDrivingEnvironmentUseCase(repository);

  router.get('/drivingenviroments', (req: Request, res: Response) => {
    try {
      const result = listUseCase.execute({ page: req.query.page ? parseInt(req.query.page as string, 10) : undefined, pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined, q: req.query.q as string | undefined, alias: req.query.alias as string | undefined });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/drivingenviroments', (req: Request, res: Response) => {
    try {
      res.status(201).json(createUseCase.execute(req.body));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/drivingenviroments/:id', (req: Request, res: Response) => {
    try {
      res.json(getUseCase.execute(parseInt(req.params.id, 10)));
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
