import { Router, Request, Response } from 'express';
import { UserRepository } from '../repository/user.repository';
import {
  ListUsersUseCase,
  CreateUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../domain/user.use-cases';

/**
 * Router para endpoints de Users.
 * Maneja solo serialización/deserialización y mapeo HTTP.
 */
export function createUserRoutes(repository: UserRepository): Router {
  const router = Router();
  const listUsersUseCase = new ListUsersUseCase(repository);
  const createUserUseCase = new CreateUserUseCase(repository);
  const getUserUseCase = new GetUserUseCase(repository);
  const updateUserUseCase = new UpdateUserUseCase(repository);
  const deleteUserUseCase = new DeleteUserUseCase(repository);

  // GET /api/users - listar con filtrado y paginación
  router.get('/users', async (req: Request, res: Response) => {
    try {
      const result = await listUsersUseCase.execute({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        q: req.query.q as string | undefined,
        nick: req.query.nick as string | undefined,
      });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // POST /api/users - crear usuario
  router.post('/users', async (req: Request, res: Response) => {
    try {
      const user = await createUserUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // GET /api/users/:id - obtener usuario por ID
  router.get('/users/:id', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await getUserUseCase.execute(userId);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  // PUT /api/users/:id - actualizar usuario
  router.put('/users/:id', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await updateUserUseCase.execute(userId, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // DELETE /api/users/:id - eliminar usuario
  router.delete('/users/:id', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      await deleteUserUseCase.execute(userId);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  });

  return router;
}
