"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDrivingEnvironmentRoutes = createDrivingEnvironmentRoutes;
const express_1 = require("express");
const drivingenvironment_use_cases_1 = require("../domain/drivingenvironment.use-cases");
function createDrivingEnvironmentRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new drivingenvironment_use_cases_1.ListDrivingEnvironmentsUseCase(repository);
    const createUseCase = new drivingenvironment_use_cases_1.CreateDrivingEnvironmentUseCase(repository);
    const getUseCase = new drivingenvironment_use_cases_1.GetDrivingEnvironmentUseCase(repository);
    router.get('/drivingenvironments', async (req, res) => {
        try {
            const result = await listUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                q: req.query.q,
                alias: req.query.alias,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/drivingenvironments', async (req, res) => {
        try {
            const env = await createUseCase.execute(req.body);
            res.status(201).json(env);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/drivingenvironments/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const env = await getUseCase.execute(id);
            res.json(env);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
