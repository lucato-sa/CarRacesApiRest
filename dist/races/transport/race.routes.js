"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRaceRoutes = createRaceRoutes;
const express_1 = require("express");
const race_use_cases_1 = require("../domain/race.use-cases");
function createRaceRoutes(repository) {
    const router = (0, express_1.Router)();
    const updateUseCase = new race_use_cases_1.UpdateRaceUseCase(repository);
    router.put('/races/:id', (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const race = updateUseCase.execute(id, req.body);
            res.json(race);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
