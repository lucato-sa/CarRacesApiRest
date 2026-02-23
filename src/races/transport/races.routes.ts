import { Router, Request, Response } from 'express';
import { RaceRepository } from '../repository/race.repository';
import { UpdateRaceUseCase, GetRaceUseCase } from '../domain/race.use-cases';

export function createRaceRoutes(repository: RaceRepository): Router {
  const router = Router();
  const updateUseCase = new UpdateRaceUseCase(repository);
  const getUseCase = new GetRaceUseCase(repository);

  router.get('/races/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const race = await getUseCase.execute(id);
      res.json(race);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  router.put('/races/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const race = await updateUseCase.execute(id, req.body);
      res.json(race);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}