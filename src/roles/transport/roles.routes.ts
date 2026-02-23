import { Router, Request, Response } from 'express';
import { RoleRepository } from '../repository/role.repository';
import { ListRolesUseCase, GetRoleUseCase } from '../domain/role.use-cases';

export function createRoleRoutes(repository: RoleRepository): Router {
  const router = Router();
  const listUseCase = new ListRolesUseCase(repository);
  const getUseCase = new GetRoleUseCase(repository);

  router.get('/roles', async (req: Request, res: Response) => {
    try {
      const roles = await listUseCase.execute();
      res.json(roles);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/roles/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const role = await getUseCase.execute(id);
      res.json(role);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}