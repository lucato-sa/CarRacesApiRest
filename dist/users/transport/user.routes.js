"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRoutes = createUserRoutes;
const express_1 = require("express");
const user_use_cases_1 = require("../domain/user.use-cases");
/**
 * Router para endpoints de Users.
 * Maneja solo serialización/deserialización y mapeo HTTP.
 */
function createUserRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUsersUseCase = new user_use_cases_1.ListUsersUseCase(repository);
    const createUserUseCase = new user_use_cases_1.CreateUserUseCase(repository);
    const getUserUseCase = new user_use_cases_1.GetUserUseCase(repository);
    const updateUserUseCase = new user_use_cases_1.UpdateUserUseCase(repository);
    const deleteUserUseCase = new user_use_cases_1.DeleteUserUseCase(repository);
    // GET /api/users - listar con filtrado y paginación
    router.get('/users', async (req, res) => {
        try {
            const result = await listUsersUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                q: req.query.q,
                nick: req.query.nick,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    // POST /api/users - crear usuario
    router.post('/users', async (req, res) => {
        try {
            const user = await createUserUseCase.execute(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    // GET /api/users/:id - obtener usuario por ID
    router.get('/users/:id', async (req, res) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await getUserUseCase.execute(userId);
            res.json(user);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    // PUT /api/users/:id - actualizar usuario
    router.put('/users/:id', async (req, res) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await updateUserUseCase.execute(userId, req.body);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    // DELETE /api/users/:id - eliminar usuario
    router.delete('/users/:id', async (req, res) => {
        try {
            const userId = parseInt(req.params.id, 10);
            await deleteUserUseCase.execute(userId);
            res.status(204).send();
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
