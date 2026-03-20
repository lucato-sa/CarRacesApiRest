"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDisciplineRoutes = createDisciplineRoutes;
const express_1 = require("express");
const discipline_use_cases_1 = require("../domain/discipline.use-cases");
function createDisciplineRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new discipline_use_cases_1.ListDisciplinesUseCase(repository);
    const getUseCase = new discipline_use_cases_1.GetDisciplineUseCase(repository);
    router.get('/disciplines', async (req, res) => {
        try {
            const result = await listUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                specialityId: req.query.specialityId ? parseInt(req.query.specialityId, 10) : undefined,
                formatId: req.query.formatId ? parseInt(req.query.formatId, 10) : undefined,
                surfaceId: req.query.surfaceId ? parseInt(req.query.surfaceId, 10) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/disciplines/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const discipline = await getUseCase.execute(id);
            res.json(discipline);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
