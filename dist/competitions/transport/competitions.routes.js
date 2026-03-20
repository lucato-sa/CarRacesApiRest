"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompetitionRoutes = createCompetitionRoutes;
const express_1 = require("express");
const competition_use_cases_1 = require("../domain/competition.use-cases");
/**
 * Router para endpoints de Competitions.
 */
function createCompetitionRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new competition_use_cases_1.ListCompetitionsUseCase(repository);
    const createUseCase = new competition_use_cases_1.CreateCompetitionUseCase(repository);
    const getUseCase = new competition_use_cases_1.GetCompetitionUseCase(repository);
    const updateUseCase = new competition_use_cases_1.UpdateCompetitionUseCase(repository);
    const deleteUseCase = new competition_use_cases_1.DeleteCompetitionUseCase(repository);
    router.get('/competitions', async (req, res) => {
        try {
            const result = await listUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                seasonId: req.query.seasonId ? parseInt(req.query.seasonId, 10) : undefined,
                eventId: req.query.eventId ? parseInt(req.query.eventId, 10) : undefined,
                venueId: req.query.venueId ? parseInt(req.query.venueId, 10) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/competitions', async (req, res) => {
        try {
            const competition = await createUseCase.execute(req.body);
            res.status(201).json(competition);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/competitions/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const competition = await getUseCase.execute(id);
            res.json(competition);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    router.put('/competitions/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const competition = await updateUseCase.execute(id, req.body);
            res.json(competition);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.delete('/competitions/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            await deleteUseCase.execute(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    return router;
}
