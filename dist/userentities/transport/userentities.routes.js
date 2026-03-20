"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserEntityRoutes = createUserEntityRoutes;
const express_1 = require("express");
const userentity_use_cases_1 = require("../domain/userentity.use-cases");
function createUserEntityRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new userentity_use_cases_1.ListUserEntitiesUseCase(repository);
    const createUseCase = new userentity_use_cases_1.CreateUserEntityUseCase(repository);
    router.get('/userentities', async (req, res) => {
        try {
            const result = await listUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/userentities', async (req, res) => {
        try {
            const userEntity = await createUseCase.execute(req.body);
            res.status(201).json(userEntity);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
