"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntityLinkRoutes = createEntityLinkRoutes;
const express_1 = require("express");
const entitylink_use_cases_1 = require("../domain/entitylink.use-cases");
function createEntityLinkRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new entitylink_use_cases_1.ListEntityLinksUseCase(repository);
    router.get('/entitylinks', async (req, res) => {
        try {
            const links = await listUseCase.execute();
            res.json(links);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
