import { Router, Request, Response } from 'express';
import { SpecialityRepository } from '../repository/speciality.repository';
import { ListSpecialitiesUseCase, GetSpecialityUseCase } from '../domain/speciality.use-cases';

export function createSpecialityRoutes(repository: SpecialityRepository): Router {
  const router = Router();
  const listUseCase = new ListSpecialitiesUseCase(repository);
  const getUseCase = new GetSpecialityUseCase(repository);

  router.get('/specialities', async (req: Request, res: Response) => {
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

  router.get('/specialities/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const speciality = await getUseCase.execute(id);
      res.json(speciality);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}