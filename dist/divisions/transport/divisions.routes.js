"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDivisionRoutes = createDivisionRoutes;
const express_1 = require("express");
const division_use_cases_1 = require("../domain/division.use-cases");
function createDivisionRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new division_use_cases_1.ListDivisionsUseCase(repository);
    const getUseCase = new division_use_cases_1.GetDivisionUseCase(repository);
    router.get('/divisions', async (req, res) => {
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
    router.get('/divisions/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const division = await getUseCase.execute(id);
            res.json(division);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
