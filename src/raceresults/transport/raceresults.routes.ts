import { Router, Request, Response } from 'express';
import { RaceResultRepository } from '../repository/raceresult.repository';
import { UpdateRaceResultUseCase, GetRaceResultUseCase } from '../domain/raceresult.use-cases';

export function createRaceResultRoutes(repository: RaceResultRepository): Router {
  const router = Router();
  const updateUseCase = new UpdateRaceResultUseCase(repository);
  const getUseCase = new GetRaceResultUseCase(repository);

  router.get('/raceresults/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await getUseCase.execute(id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  router.put('/raceresults/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await updateUseCase.execute(id, req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}