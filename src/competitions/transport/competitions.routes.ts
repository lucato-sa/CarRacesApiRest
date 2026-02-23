import { Router, Request, Response } from 'express';
import { CompetitionRepository } from '../repository/competition.repository';
import {
  ListCompetitionsUseCase,
  CreateCompetitionUseCase,
  GetCompetitionUseCase,
  UpdateCompetitionUseCase,
  DeleteCompetitionUseCase,
} from '../domain/competition.use-cases';

/**
 * Router para endpoints de Competitions.
 */
export function createCompetitionRoutes(repository: CompetitionRepository): Router {
  const router = Router();
  const listUseCase = new ListCompetitionsUseCase(repository);
  const createUseCase = new CreateCompetitionUseCase(repository);
  const getUseCase = new GetCompetitionUseCase(repository);
  const updateUseCase = new UpdateCompetitionUseCase(repository);
  const deleteUseCase = new DeleteCompetitionUseCase(repository);

  router.get('/competitions', async (req: Request, res: Response) => {
    try {
      const result = await listUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        seasonId: req.query.seasonId ? parseInt(req.query.seasonId as string, 10) : undefined,
        eventId: req.query.eventId ? parseInt(req.query.eventId as string, 10) : undefined,
        venueId: req.query.venueId ? parseInt(req.query.venueId as string, 10) : undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/competitions', async (req: Request, res: Response) => {
    try {
      const competition = await createUseCase.execute(req.body);
      res.status(201).json(competition);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/competitions/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const competition = await getUseCase.execute(id);
      res.json(competition);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  router.put('/competitions/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const competition = await updateUseCase.execute(id, req.body);
      res.json(competition);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.delete('/competitions/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      await deleteUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}