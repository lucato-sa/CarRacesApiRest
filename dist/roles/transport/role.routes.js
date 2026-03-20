"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleRoutes = createRoleRoutes;
const express_1 = require("express");
const role_use_cases_1 = require("../domain/role.use-cases");
function createRoleRoutes(repository) {
    const router = (0, express_1.Router)();
    const listUseCase = new role_use_cases_1.ListRolesUseCase(repository);
    const getUseCase = new role_use_cases_1.GetRoleUseCase(repository);
    router.get('/roles', (req, res) => {
        try {
            res.json(listUseCase.execute());
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}
