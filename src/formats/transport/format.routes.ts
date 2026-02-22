import { Router, Request, Response } from 'express';
import { FormatRepository } from '../repository/format.repository';
import { ListFormatsUseCase, CreateFormatUseCase, GetFormatUseCase } from '../domain/format.use-cases';

export function createFormatRoutes(repository: FormatRepository): Router {
  const router = Router();
  const listUseCase = new ListFormatsUseCase(repository);
  const createUseCase = new CreateFormatUseCase(repository);
  const getUseCase = new GetFormatUseCase(repository);

  router.get('/formats', (req: Request, res: Response) => {
    try {
      const result = listUseCase.execute({ page: req.query.page ? parseInt(req.query.page as string, 10) : undefined, pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined, q: req.query.q as string | undefined });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/formats', (req: Request, res: Response) => {
    try {
      res.status(201).json(createUseCase.execute(req.body));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/formats/:id', (req: Request, res: Response) => {
    try {
      res.json(getUseCase.execute(parseInt(req.params.id, 10)));
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
