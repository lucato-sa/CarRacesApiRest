"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSurfaceRoutes = createSurfaceRoutes;
const express_1 = require("express");
const surface_use_cases_1 = require("../domain/surface.use-cases");
function createSurfaceRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new surface_use_cases_1.ListSurfacesUseCase(repository);
    const createUseCase = new surface_use_cases_1.CreateSurfaceUseCase(repository);
    const getUseCase = new surface_use_cases_1.GetSurfaceUseCase(repository);
    router.get('/surfaces', async (req, res) => {
        try {
            const result = await listUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                q: req.query.q,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/surfaces', async (req, res) => {
        try {
            const surface = await createUseCase.execute(req.body);
            res.status(201).json(surface);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/surfaces/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const surface = await getUseCase.execute(id);
            res.json(surface);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
