"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventRoutes = createEventRoutes;
const express_1 = require("express");
const event_use_cases_1 = require("../domain/event.use-cases");
/**
 * Router para endpoints de Events.
 */
function createEventRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new event_use_cases_1.ListEventsUseCase(repository);
    const createUseCase = new event_use_cases_1.CreateEventUseCase(repository);
    const getUseCase = new event_use_cases_1.GetEventUseCase(repository);
    const updateUseCase = new event_use_cases_1.UpdateEventUseCase(repository);
    const deleteUseCase = new event_use_cases_1.DeleteEventUseCase(repository);
    router.get('/events', async (req, res) => {
        try {
            const result = await listUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                clubId: req.query.clubId ? parseInt(req.query.clubId, 10) : undefined,
                from: req.query.from,
                to: req.query.to,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/events', async (req, res) => {
        try {
            const event = await createUseCase.execute(req.body);
            res.status(201).json(event);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/events/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const event = await getUseCase.execute(id);
            res.json(event);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    router.put('/events/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const event = await updateUseCase.execute(id, req.body);
            res.json(event);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.delete('/events/:id', async (req, res) => {
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
