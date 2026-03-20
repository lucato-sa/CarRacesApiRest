"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRolEntityRoutes = createRolEntityRoutes;
const express_1 = require("express");
const rolentity_use_cases_1 = require("../domain/rolentity.use-cases");
function createRolEntityRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new rolentity_use_cases_1.ListRolEntitiesUseCase(repository);
    const createUseCase = new rolentity_use_cases_1.CreateRolEntityUseCase(repository);
    router.get('/rolentities', (req, res) => {
        try {
            const result = listUseCase.execute({ page: req.query.page ? parseInt(req.query.page, 10) : undefined, pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/rolentities', (req, res) => {
        try {
            res.status(201).json(createUseCase.execute(req.body));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
