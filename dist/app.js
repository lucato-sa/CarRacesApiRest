"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importStar(require("express"));
const logger_middleware_1 = require("./middleware/logger.middleware");
/**
 * Helper: Extract pagination and filters from query parameters
 */
function extractPaginationAndFilters(query) {
    const page = query.page ? Math.max(1, parseInt(query.page, 10)) : 1;
    const pageSize = query.pageSize ? Math.max(1, parseInt(query.pageSize, 10)) : 20;
    const filters = {};
    Object.entries(query).forEach(([key, value]) => {
        if (key !== 'page' && key !== 'pageSize' && value !== undefined) {
            filters[key] = value;
        }
    });
    return { page, pageSize, filters };
}
/**
 * Helper: Apply pagination in memory
 */
function applyPagination(items, page, pageSize) {
    const start = (page - 1) * pageSize;
    const paginatedItems = items.slice(start, start + pageSize);
    return {
        items: paginatedItems,
        total: items.length,
        page,
        pageSize
    };
}
/**
 * Helper: Create generic CRUD routes for any entity
 */
function createEntityRoutes(entityName, backend) {
    const router = (0, express_1.Router)();
    // POST: Create
    router.post(`/${entityName}`, async (req, res) => {
        try {
            const result = await backend.create(entityName, req.body);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
    // GET: List all with pagination
    router.get(`/${entityName}`, async (req, res) => {
        try {
            const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
            const results = await backend.readAll(entityName, Object.keys(filters).length > 0 ? filters : undefined);
            const paginated = applyPagination(results, page, pageSize);
            res.status(200).json({
                success: true,
                total: paginated.total,
                items: paginated.items,
                page: paginated.page,
                pageSize: paginated.pageSize
            });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
    // GET: Get by ID
    router.get(`/${entityName}/:id`, async (req, res) => {
        try {
            const result = await backend.read(entityName, parseInt(req.params.id));
            if (!result) {
                return res.status(404).json({ success: false, error: 'Not found' });
            }
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
    // PUT: Update by ID
    router.put(`/${entityName}/:id`, async (req, res) => {
        try {
            const result = await backend.update(entityName, parseInt(req.params.id), req.body);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
    // DELETE: Delete by ID
    router.delete(`/${entityName}/:id`, async (req, res) => {
        try {
            await backend.delete(entityName, parseInt(req.params.id));
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
    return router;
}
/**
 * Creates the Express application with all routes using backends abstraction
 */
function createApp(backend) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // === MIDDLEWARE: Logger ===
    app.use(logger_middleware_1.loggerMiddleware);
    // === HEALTH CHECK ===
    app.get('/api/health', (req, res) => {
        res.status(200).json({ status: 'ok', backend: 'SupabaseBackend' });
    });
    // === ENTITIES: Register CRUD routes for all entities ===
    const entities = [
        'clubs',
        'users',
        'competitions',
        'events',
        'roles',
        'specialities',
        'divisions',
        'groups',
        'levels',
        'scoring',
        'scoring_det',  
        'rulebooks',
        'rules',
        'seasons',
        'disciplines',
        'surfaces',
        'formats',
        'venues',
        'circuits',
        'segments',        
        'driving_environments',
        'entity_links',
        'registrations',
        'championships',
        'races',
        'race_results',
        'user_entities',
        'rol_entities'
    ];
    entities.forEach(entity => {
        const router = createEntityRoutes(entity, backend);
        app.use('/api', router);
    });
    return app;
}
