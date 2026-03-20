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
    router.get('/formats', (req, res) => {
        try {
            const result = listUseCase.execute({ page: req.query.page ? parseInt(req.query.page, 10) : undefined, pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined, q: req.query.q });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/formats', (req, res) => {
        try {
            res.status(201).json(createUseCase.execute(req.body));
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/formats/:id', (req, res) => {
        try {
            res.json(getUseCase.execute(parseInt(req.params.id, 10)));
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
