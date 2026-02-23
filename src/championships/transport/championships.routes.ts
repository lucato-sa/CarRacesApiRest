import { Router, Request, Response } from 'express';
import { ChampionshipRepository } from '../repository/championship.repository';
import { ListChampionshipsUseCase, GetChampionshipUseCase } from '../domain/championship.use-cases';

export function createChampionshipRoutes(repository: ChampionshipRepository): Router {
  const router = Router();
  const listUseCase = new ListChampionshipsUseCase(repository);
  const getUseCase = new GetChampionshipUseCase(repository);

  router.get('/championships', async (req: Request, res: Response) => {
    try {
      const result = await listUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        clubId: req.query.clubId ? parseInt(req.query.clubId as string, 10) : undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/championships/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const championship = await getUseCase.execute(id);
      res.json(championship);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}