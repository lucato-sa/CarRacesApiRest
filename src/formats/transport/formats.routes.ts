import { Router, Request, Response } from 'express';
import { FormatRepository } from '../repository/format.repository';
import { ListFormatsUseCase, CreateFormatUseCase, GetFormatUseCase } from '../domain/format.use-cases';

export function createFormatRoutes(repository: FormatRepository): Router {
  const router = Router();
  const listUseCase = new ListFormatsUseCase(repository);
  const createUseCase = new CreateFormatUseCase(repository);
  const getUseCase = new GetFormatUseCase(repository);

  router.get('/formats', async (req: Request, res: Response) => {
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

  router.post('/formats', async (req: Request, res: Response) => {
    try {
      const format = await createUseCase.execute(req.body);
      res.status(201).json(format);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/formats/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const format = await getUseCase.execute(id);
      res.json(format);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}