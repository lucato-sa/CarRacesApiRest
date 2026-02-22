import { Router, Request, Response } from 'express';
import { EventRepository } from '../repository/event.repository';
import {
  ListEventsUseCase,
  CreateEventUseCase,
  GetEventUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
} from '../domain/event.use-cases';

/**
 * Router para endpoints de Events.
 */
export function createEventRoutes(repository: EventRepository): Router {
  const router = Router();
  const listUseCase = new ListEventsUseCase(repository);
  const createUseCase = new CreateEventUseCase(repository);
  const getUseCase = new GetEventUseCase(repository);
  const updateUseCase = new UpdateEventUseCase(repository);
  const deleteUseCase = new DeleteEventUseCase(repository);

  router.get('/events', (req: Request, res: Response) => {
    try {
      const result = listUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        clubId: req.query.clubId ? parseInt(req.query.clubId as string, 10) : undefined,
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/events', (req: Request, res: Response) => {
    try {
      const event = createUseCase.execute(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/events/:id', (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const event = getUseCase.execute(id);
      res.json(event);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  router.put('/events/:id', (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const event = updateUseCase.execute(id, req.body);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.delete('/events/:id', (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      deleteUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
