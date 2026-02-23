import { Router, Request, Response } from 'express';
import { RegistrationRepository } from '../repository/registration.repository';
import {
  ListRegistrationsUseCase,
  CreateRegistrationUseCase,
  GetRegistrationUseCase,
  DeleteRegistrationUseCase,
} from '../domain/registration.use-cases';

export function createRegistrationRoutes(repository: RegistrationRepository): Router {
  const router = Router();
  const listUseCase = new ListRegistrationsUseCase(repository);
  const createUseCase = new CreateRegistrationUseCase(repository);
  const getUseCase = new GetRegistrationUseCase(repository);
  const deleteUseCase = new DeleteRegistrationUseCase(repository);

  router.get('/registrations', async (req: Request, res: Response) => {
    try {
      const result = await listUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        competitionId: req.query.competitionId ? parseInt(req.query.competitionId as string, 10) : undefined,
        userId: req.query.userId ? parseInt(req.query.userId as string, 10) : undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/registrations', async (req: Request, res: Response) => {
    try {
      const registration = await createUseCase.execute(req.body);
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/registrations/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const registration = await getUseCase.execute(id);
      res.json(registration);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  router.delete('/registrations/:id', async (req: Request, res: Response) => {
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