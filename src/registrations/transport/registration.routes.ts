import { Router, Request, Response } from 'express';
import { RegistrationRepository } from '../repository/registration.repository';
import { ListRegistrationsUseCase, CreateRegistrationUseCase, GetRegistrationUseCase, DeleteRegistrationUseCase } from '../domain/registration.use-cases';

export function createRegistrationRoutes(repository: RegistrationRepository): Router {
  const router = Router();
  const listUseCase = new ListRegistrationsUseCase(repository);
  const createUseCase = new CreateRegistrationUseCase(repository);
  const getUseCase = new GetRegistrationUseCase(repository);
  const deleteUseCase = new DeleteRegistrationUseCase(repository);

  router.get('/registrations', (req: Request, res: Response) => {
    try {
      const result = listUseCase.execute({ page: req.query.page ? parseInt(req.query.page as string, 10) : undefined, pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined, competitionId: req.query.competitionId ? parseInt(req.query.competitionId as string, 10) : undefined, userId: req.query.userId ? parseInt(req.query.userId as string, 10) : undefined });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/registrations', (req: Request, res: Response) => {
    try {
      res.status(201).json(createUseCase.execute(req.body));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/registrations/:id', (req: Request, res: Response) => {
    try {
      res.json(getUseCase.execute(parseInt(req.params.id, 10)));
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  router.delete('/registrations/:id', (req: Request, res: Response) => {
    try {
      deleteUseCase.execute(parseInt(req.params.id, 10));
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
