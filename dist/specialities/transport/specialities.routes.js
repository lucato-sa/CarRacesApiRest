"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpecialityRoutes = createSpecialityRoutes;
const express_1 = require("express");
const speciality_use_cases_1 = require("../domain/speciality.use-cases");
function createSpecialityRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new speciality_use_cases_1.ListSpecialitiesUseCase(repository);
    const getUseCase = new speciality_use_cases_1.GetSpecialityUseCase(repository);
    router.get('/specialities', async (req, res) => {
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
    router.get('/specialities/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const speciality = await getUseCase.execute(id);
            res.json(speciality);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
