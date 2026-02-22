import { Router, Request, Response } from 'express';
import { RaceResultRepository } from '../repository/raceresult.repository';
import { UpdateRaceResultUseCase } from '../domain/raceresult.use-cases';

export function createRaceResultRoutes(repository: RaceResultRepository): Router {
  const router = Router();
  const updateUseCase = new UpdateRaceResultUseCase(repository);

  router.put('/raceresults/:id', (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = updateUseCase.execute(id, req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}
