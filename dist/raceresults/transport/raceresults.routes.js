"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRaceResultRoutes = createRaceResultRoutes;
const express_1 = require("express");
const raceresult_use_cases_1 = require("../domain/raceresult.use-cases");
function createRaceResultRoutes(repository) {
    const router = (0, express_1.Router)();
    const updateUseCase = new raceresult_use_cases_1.UpdateRaceResultUseCase(repository);
    const getUseCase = new raceresult_use_cases_1.GetRaceResultUseCase(repository);
    router.get('/raceresults/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await getUseCase.execute(id);
            res.json(result);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    router.put('/raceresults/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await updateUseCase.execute(id, req.body);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
