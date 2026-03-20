"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRaceResultRoutes = createRaceResultRoutes;
const express_1 = require("express");
const raceresult_use_cases_1 = require("../domain/raceresult.use-cases");
function createRaceResultRoutes(repository) {
    const router = (0, express_1.Router)();
    const updateUseCase = new raceresult_use_cases_1.UpdateRaceResultUseCase(repository);
    router.put('/raceresults/:id', (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const result = updateUseCase.execute(id, req.body);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
