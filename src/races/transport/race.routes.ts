import { Router, Request, Response } from 'express';
import { RaceRepository } from '../repository/race.repository';
import { UpdateRaceUseCase } from '../domain/race.use-cases';

export function createRaceRoutes(repository: RaceRepository): Router {
  const router = Router();
  const updateUseCase = new UpdateRaceUseCase(repository);

  router.put('/races/:id', (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const race = updateUseCase.execute(id, req.body);
      res.json(race);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}
