"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserEntityRoutes = createUserEntityRoutes;
const express_1 = require("express");
const userentity_use_cases_1 = require("../domain/userentity.use-cases");
function createUserEntityRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new userentity_use_cases_1.ListUserEntitiesUseCase(repository);
    const createUseCase = new userentity_use_cases_1.CreateUserEntityUseCase(repository);
    router.get('/userentities', (req, res) => {
        try {
            const result = listUseCase.execute({ page: req.query.page ? parseInt(req.query.page, 10) : undefined, pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/userentities', (req, res) => {
        try {
            res.status(201).json(createUseCase.execute(req.body));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
