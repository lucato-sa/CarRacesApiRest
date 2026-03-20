"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChampionshipRoutes = createChampionshipRoutes;
const express_1 = require("express");
const championship_use_cases_1 = require("../domain/championship.use-cases");
function createChampionshipRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new championship_use_cases_1.ListChampionshipsUseCase(repository);
    const getUseCase = new championship_use_cases_1.GetChampionshipUseCase(repository);
    router.get('/championships', async (req, res) => {
        try {
            const result = await listUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                clubId: req.query.clubId ? parseInt(req.query.clubId, 10) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/championships/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const championship = await getUseCase.execute(id);
            res.json(championship);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
