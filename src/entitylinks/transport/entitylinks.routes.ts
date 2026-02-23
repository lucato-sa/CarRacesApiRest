import { Router, Request, Response } from 'express';
import { EntityLinkRepository } from '../repository/entitylink.repository';
import { ListEntityLinksUseCase } from '../domain/entitylink.use-cases';

export function createEntityLinkRoutes(repository: EntityLinkRepository): Router {
  const router = Router();
  const listUseCase = new ListEntityLinksUseCase(repository);

  router.get('/entitylinks', async (req: Request, res: Response) => {
    try {
      const links = await listUseCase.execute();
      res.json(links);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}