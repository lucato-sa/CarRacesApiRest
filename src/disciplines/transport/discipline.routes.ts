import { Router, Request, Response } from 'express';
import { DisciplineRepository } from '../repository/discipline.repository';
import { ListDisciplinesUseCase, GetDisciplineUseCase } from '../domain/discipline.use-cases';

export function createDisciplineRoutes(repository: DisciplineRepository): Router {
  const router = Router();
  const listUseCase = new ListDisciplinesUseCase(repository);
  const getUseCase = new GetDisciplineUseCase(repository);

  router.get('/disciplines', (req: Request, res: Response) => {
    try {
      const result = listUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        specialityId: req.query.specialityId ? parseInt(req.query.specialityId as string, 10) : undefined,
        formatId: req.query.formatId ? parseInt(req.query.formatId as string, 10) : undefined,
        surfaceId: req.query.surfaceId ? parseInt(req.query.surfaceId as string, 10) : undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/disciplines/:id', (req: Request, res: Response) => {
    try {
      res.json(getUseCase.execute(parseInt(req.params.id, 10)));
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
