import { Router, Request, Response } from 'express';
import { RoleRepository } from '../repository/role.repository';
import { ListRolesUseCase, GetRoleUseCase } from '../domain/role.use-cases';

export function createRoleRoutes(repository: RoleRepository): Router {
  const router = Router();
  const listUseCase = new ListRolesUseCase(repository);
  const getUseCase = new GetRoleUseCase(repository);

  router.get('/roles', (req: Request, res: Response) => {
    try {
      res.json(listUseCase.execute());
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
}
