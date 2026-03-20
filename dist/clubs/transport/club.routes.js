"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClubRoutes = createClubRoutes;
const express_1 = require("express");
const club_use_cases_1 = require("../domain/club.use-cases");
/**
 * Router para endpoints de Clubs.
 * Maneja solo serialización/deserialización y mapeo HTTP.
 */
function createClubRoutes(repository) {
    const router = (0, express_1.Router)();
    const listClubsUseCase = new club_use_cases_1.ListClubsUseCase(repository);
    const createClubUseCase = new club_use_cases_1.CreateClubUseCase(repository);
    // GET /api/clubs - listar con filtrado y paginación
    router.get('/clubs', async (req, res) => {
        try {
            const result = await listClubsUseCase.execute({
                page: req.query.page ? parseInt(req.query.page, 10) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined,
                q: req.query.q,
                alias: req.query.alias,
            });
            res.json(result);
        }
        catch (error) {
            console.error('Ruta /api/clubs error:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // POST /api/clubs - crear club
    router.post('/clubs', async (req, res) => {
        try {
            const club = await createClubUseCase.execute(req.body);
            res.status(201).json(club);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
