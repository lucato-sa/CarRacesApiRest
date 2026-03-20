"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormatRoutes = createFormatRoutes;
const express_1 = require("express");
const format_use_cases_1 = require("../domain/format.use-cases");
function createFormatRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new format_use_cases_1.ListFormatsUseCase(repository);
    const createUseCase = new format_use_cases_1.CreateFormatUseCase(repository);
    const getUseCase = new format_use_cases_1.GetFormatUseCase(repository);
    router.get('/formats', async (req, res) => {
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
    router.post('/formats', async (req, res) => {
        try {
            const format = await createUseCase.execute(req.body);
            res.status(201).json(format);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/formats/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const format = await getUseCase.execute(id);
            res.json(format);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
