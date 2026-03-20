"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegistrationRoutes = createRegistrationRoutes;
const express_1 = require("express");
const registration_use_cases_1 = require("../domain/registration.use-cases");
function createRegistrationRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new registration_use_cases_1.ListRegistrationsUseCase(repository);
    const createUseCase = new registration_use_cases_1.CreateRegistrationUseCase(repository);
    const getUseCase = new registration_use_cases_1.GetRegistrationUseCase(repository);
    const deleteUseCase = new registration_use_cases_1.DeleteRegistrationUseCase(repository);
    router.get('/registrations', async (req, res) => {
        try {
            const result = await listUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                competitionId: req.query.competitionId ? parseInt(req.query.competitionId, 10) : undefined,
                userId: req.query.userId ? parseInt(req.query.userId, 10) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/registrations', async (req, res) => {
        try {
            const registration = await createUseCase.execute(req.body);
            res.status(201).json(registration);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    router.get('/registrations/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const registration = await getUseCase.execute(id);
            res.json(registration);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    router.delete('/registrations/:id', async (req, res) => {
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
