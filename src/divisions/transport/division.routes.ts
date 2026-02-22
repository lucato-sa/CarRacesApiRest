import { Router, Request, Response } from 'express';
import { DivisionRepository } from '../repository/division.repository';
import { ListDivisionsUseCase, GetDivisionUseCase } from '../domain/division.use-cases';

export function createDivisionRoutes(repository: DivisionRepository): Router {
  const router = Router();
  const listUseCase = new ListDivisionsUseCase(repository);
  const getUseCase = new GetDivisionUseCase(repository);

  router.get('/divisions', (req: Request, res: Response) => {
    try {
      const result = listUseCase.execute({ page: req.query.page ? parseInt(req.query.page as string, 10) : undefined, pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/divisions/:id', (req: Request, res: Response) => {
    try {
      res.json(getUseCase.execute(parseInt(req.params.id, 10)));
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
