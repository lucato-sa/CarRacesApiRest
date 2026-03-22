import express, { Express, Router } from 'express'
import { IBackend } from '../../src/backends/IBackend'

/**
 * Helper: Extraer parámetros de paginación y filtros
 */
function extractPaginationAndFilters(query: any) {
  const page = query.page ? Math.max(1, parseInt(query.page as string, 10)) : 1;
  const pageSize = query.pageSize ? Math.max(1, parseInt(query.pageSize as string, 10)) : 20;
  
  // Extraer filtros (todo lo que NO sea page o pageSize)
  const filters: any = {};
  Object.entries(query).forEach(([key, value]) => {
    if (key !== 'page' && key !== 'pageSize' && value !== undefined) {
      filters[key] = value;
    }
  });
  
  return { page, pageSize, filters };
}

/**
 * Helper: Aplicar paginación en memoria
 */
function applyPagination(items: any[], page: number, pageSize: number) {
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
 * Factory function to create the test Express application
 * with all routes injected and backend operations available
 */
export async function createTestApp(backend: IBackend): Promise<Express> {
  const app = express()

  // Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', backend: backend.constructor.name })
  })

  // ============ CLUBS Routes ============
  const clubsRouter = Router()
  clubsRouter.post('/clubs', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('clubs', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  clubsRouter.get('/clubs', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('clubs', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true, 
        total: paginated.total, 
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  clubsRouter.get('/clubs/:id', async (req, res) => {
    try {
      const result = await backend.read('clubs', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  clubsRouter.put('/clubs/:id', async (req, res) => {
    try {
      const result = await backend.update('clubs', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  clubsRouter.delete('/clubs/:id', async (req, res) => {
    try {
      await backend.delete('clubs', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ USERS Routes ============
  const usersRouter = Router()
  usersRouter.post('/users', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('users', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  usersRouter.get('/users', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('users', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  usersRouter.get('/users/:id', async (req, res) => {
    try {
      const result = await backend.read('users', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  usersRouter.put('/users/:id', async (req, res) => {
    try {
      const result = await backend.update('users', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  usersRouter.delete('/users/:id', async (req, res) => {
    try {
      await backend.delete('users', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ RACES Routes ============
  const racesRouter = Router()
  racesRouter.post('/races', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('races', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  racesRouter.get('/races', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('races', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  racesRouter.get('/races/:id', async (req, res) => {
    try {
      const result = await backend.read('races', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  racesRouter.put('/races/:id', async (req, res) => {
    try {
      const result = await backend.update('races', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  racesRouter.delete('/races/:id', async (req, res) => {
    try {
      await backend.delete('races', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ COMPETITIONS Routes ============
  const competitionsRouter = Router()
  competitionsRouter.post('/competitions', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('competitions', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  competitionsRouter.get('/competitions', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('competitions', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  competitionsRouter.get('/competitions/:id', async (req, res) => {
    try {
      const result = await backend.read('competitions', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  competitionsRouter.put('/competitions/:id', async (req, res) => {
    try {
      const result = await backend.update('competitions', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  competitionsRouter.delete('/competitions/:id', async (req, res) => {
    try {
      await backend.delete('competitions', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ CHAMPIONSHIPS Routes ============
  const championshipsRouter = Router()
  championshipsRouter.post('/championships', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('championships', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  championshipsRouter.get('/championships', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('championships', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  championshipsRouter.get('/championships/:id', async (req, res) => {
    try {
      const result = await backend.read('championships', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  championshipsRouter.put('/championships/:id', async (req, res) => {
    try {
      const result = await backend.update('championships', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  championshipsRouter.delete('/championships/:id', async (req, res) => {
    try {
      await backend.delete('championships', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ DISCIPLINES Routes ============
  const disciplinesRouter = Router()
  disciplinesRouter.post('/disciplines', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('disciplines', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  disciplinesRouter.get('/disciplines', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('disciplines', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  disciplinesRouter.get('/disciplines/:id', async (req, res) => {
    try {
      const result = await backend.read('disciplines', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  disciplinesRouter.put('/disciplines/:id', async (req, res) => {
    try {
      const result = await backend.update('disciplines', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  disciplinesRouter.delete('/disciplines/:id', async (req, res) => {
    try {
      await backend.delete('disciplines', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ EVENTS Routes ============
  const eventsRouter = Router()
  eventsRouter.post('/events', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('events', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  eventsRouter.get('/events', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('events', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  eventsRouter.get('/events/:id', async (req, res) => {
    try {
      const result = await backend.read('events', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  eventsRouter.put('/events/:id', async (req, res) => {
    try {
      const result = await backend.update('events', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  eventsRouter.delete('/events/:id', async (req, res) => {
    try {
      await backend.delete('events', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ REGISTRATIONS Routes ============
  const registrationsRouter = Router()
  registrationsRouter.post('/registrations', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('registrations', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  registrationsRouter.get('/registrations', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('registrations', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  registrationsRouter.get('/registrations/:id', async (req, res) => {
    try {
      const result = await backend.read('registrations', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  registrationsRouter.put('/registrations/:id', async (req, res) => {
    try {
      const result = await backend.update('registrations', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  registrationsRouter.delete('/registrations/:id', async (req, res) => {
    try {
      await backend.delete('registrations', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ FORMATS Routes ============
  const formatsRouter = Router()
  formatsRouter.post('/formats', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('formats', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  formatsRouter.get('/formats', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('formats', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  formatsRouter.get('/formats/:id', async (req, res) => {
    try {
      const result = await backend.read('formats', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  formatsRouter.put('/formats/:id', async (req, res) => {
    try {
      const result = await backend.update('formats', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  formatsRouter.delete('/formats/:id', async (req, res) => {
    try {
      await backend.delete('formats', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ SURFACES Routes ============
  const surfacesRouter = Router()
  surfacesRouter.post('/surfaces', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('surfaces', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  surfacesRouter.get('/surfaces', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('surfaces', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  surfacesRouter.get('/surfaces/:id', async (req, res) => {
    try {
      const result = await backend.read('surfaces', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  surfacesRouter.put('/surfaces/:id', async (req, res) => {
    try {
      const result = await backend.update('surfaces', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  surfacesRouter.delete('/surfaces/:id', async (req, res) => {
    try {
      await backend.delete('surfaces', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ DIVISIONS Routes ============
  const divisionsRouter = Router()
  divisionsRouter.post('/divisions', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('divisions', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  divisionsRouter.get('/divisions', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('divisions', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  divisionsRouter.get('/divisions/:id', async (req, res) => {
    try {
      const result = await backend.read('divisions', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  divisionsRouter.put('/divisions/:id', async (req, res) => {
    try {
      const result = await backend.update('divisions', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  divisionsRouter.delete('/divisions/:id', async (req, res) => {
    try {
      await backend.delete('divisions', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ ROLES Routes ============
  const rolesRouter = Router()
  rolesRouter.post('/roles', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('roles', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rolesRouter.get('/roles', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('roles', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rolesRouter.get('/roles/:id', async (req, res) => {
    try {
      const result = await backend.read('roles', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rolesRouter.put('/roles/:id', async (req, res) => {
    try {
      const result = await backend.update('roles', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rolesRouter.delete('/roles/:id', async (req, res) => {
    try {
      await backend.delete('roles', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ RACERESULTS Routes ============
  const raceresultsRouter = Router()
  raceresultsRouter.post('/race_results', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('race_results', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  raceresultsRouter.get('/race_results', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('race_results', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  raceresultsRouter.get('/race_results/:id', async (req, res) => {
    try {
      const result = await backend.read('race_results', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  raceresultsRouter.put('/race_results/:id', async (req, res) => {
    try {
      const result = await backend.update('race_results', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  raceresultsRouter.delete('/race_results/:id', async (req, res) => {
    try {
      await backend.delete('race_results', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ SPECIALITIES Routes ============
  const specialitiesRouter = Router()
  specialitiesRouter.post('/specialities', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('specialities', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  specialitiesRouter.get('/specialities', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('specialities', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  specialitiesRouter.get('/specialities/:id', async (req, res) => {
    try {
      const result = await backend.read('specialities', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  specialitiesRouter.put('/specialities/:id', async (req, res) => {
    try {
      const result = await backend.update('specialities', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  specialitiesRouter.delete('/specialities/:id', async (req, res) => {
    try {
      await backend.delete('specialities', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ DRIVING ENVIRONMENTS Routes ============
  const drivingenvironmentsRouter = Router()
  drivingenvironmentsRouter.post('/driving_environments', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('driving_environments', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  drivingenvironmentsRouter.get('/driving_environments', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('driving_environments', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  drivingenvironmentsRouter.get('/driving_environments/:id', async (req, res) => {
    try {
      const result = await backend.read('driving_environments', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  drivingenvironmentsRouter.put('/driving_environments/:id', async (req, res) => {
    try {
      const result = await backend.update('driving_environments', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  drivingenvironmentsRouter.delete('/driving_environments/:id', async (req, res) => {
    try {
      await backend.delete('driving_environments', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ ENTITY LINKS Routes ============
  const entitylinksRouter = Router()
  entitylinksRouter.post('/entity_links', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('entity_links', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  entitylinksRouter.get('/entity_links', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('entity_links', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  entitylinksRouter.get('/entity_links/:id', async (req, res) => {
    try {
      const result = await backend.read('entity_links', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  entitylinksRouter.put('/entity_links/:id', async (req, res) => {
    try {
      const result = await backend.update('entity_links', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  entitylinksRouter.delete('/entity_links/:id', async (req, res) => {
    try {
      await backend.delete('entity_links', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ USER ENTITIES Routes ============
  const userentitiesRouter = Router()
  userentitiesRouter.post('/user_entities', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('user_entities', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  userentitiesRouter.get('/user_entities', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('user_entities', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  userentitiesRouter.get('/user_entities/:id', async (req, res) => {
    try {
      const result = await backend.read('user_entities', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  userentitiesRouter.put('/user_entities/:id', async (req, res) => {
    try {
      const result = await backend.update('user_entities', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  userentitiesRouter.delete('/user_entities/:id', async (req, res) => {
    try {
      await backend.delete('user_entities', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ ROLE ENTITIES Routes ============
  const rolentitiesRouter = Router()
  rolentitiesRouter.post('/rol_entities', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('rol_entities', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rolentitiesRouter.get('/rol_entities', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('rol_entities', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rolentitiesRouter.get('/rol_entities/:id', async (req, res) => {
    try {
      const result = await backend.read('rol_entities', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rolentitiesRouter.put('/rol_entities/:id', async (req, res) => {
    try {
      const result = await backend.update('rol_entities', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rolentitiesRouter.delete('/rol_entities/:id', async (req, res) => {
    try {
      await backend.delete('rol_entities', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ LEVELS Routes ============
  const levelsRouter = Router()
  levelsRouter.post('/levels', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('levels', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  levelsRouter.get('/levels', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('levels', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  levelsRouter.get('/levels/:id', async (req, res) => {
    try {
      const result = await backend.read('levels', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  levelsRouter.put('/levels/:id', async (req, res) => {
    try {
      const result = await backend.update('levels', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  levelsRouter.delete('/levels/:id', async (req, res) => {
    try {
      await backend.delete('levels', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ GROUPS Routes ============
  const groupsRouter = Router()
  groupsRouter.post('/groups', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('groups', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  groupsRouter.get('/groups', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('groups', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  groupsRouter.get('/groups/:id', async (req, res) => {
    try {
      const result = await backend.read('groups', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  groupsRouter.put('/groups/:id', async (req, res) => {
    try {
      const result = await backend.update('groups', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  groupsRouter.delete('/groups/:id', async (req, res) => {
    try {
      await backend.delete('groups', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ SCORING Routes ============
  const scoringRouter = Router()
  scoringRouter.post('/scoring', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('scoring', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  scoringRouter.get('/scoring', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('scoring', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  scoringRouter.get('/scoring/:id', async (req, res) => {
    try {
      const result = await backend.read('scoring', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  scoringRouter.put('/scoring/:id', async (req, res) => {
    try {
      const result = await backend.update('scoring', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  scoringRouter.delete('/scoring/:id', async (req, res) => {
    try {
      await backend.delete('scoring', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ SCORING DET Routes ============
  const scoringdetRouter = Router()
  scoringdetRouter.post('/scoring_det', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('scoring_det', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  scoringdetRouter.get('/scoring_det', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('scoring_det', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  scoringdetRouter.get('/scoring_det/:id', async (req, res) => {
    try {
      const result = await backend.read('scoring_det', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  scoringdetRouter.put('/scoring_det/:id', async (req, res) => {
    try {
      const result = await backend.update('scoring_det', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  scoringdetRouter.delete('/scoring_det/:id', async (req, res) => {
    try {
      await backend.delete('scoring_det', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ RULEBOOKS Routes ============
  const rulebooksRouter = Router()
  rulebooksRouter.post('/rulebooks', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('rulebooks', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rulebooksRouter.get('/rulebooks', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('rulebooks', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rulebooksRouter.get('/rulebooks/:id', async (req, res) => {
    try {
      const result = await backend.read('rulebooks', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rulebooksRouter.put('/rulebooks/:id', async (req, res) => {
    try {
      const result = await backend.update('rulebooks', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rulebooksRouter.delete('/rulebooks/:id', async (req, res) => {
    try {
      await backend.delete('rulebooks', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ RULES Routes ============
  const rulesRouter = Router()
  rulesRouter.post('/rules', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('rules', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rulesRouter.get('/rules', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('rules', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rulesRouter.get('/rules/:id', async (req, res) => {
    try {
      const result = await backend.read('rules', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rulesRouter.put('/rules/:id', async (req, res) => {
    try {
      const result = await backend.update('rules', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  rulesRouter.delete('/rules/:id', async (req, res) => {
    try {
      await backend.delete('rules', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ SEASONS Routes ============
  const seasonsRouter = Router()
  seasonsRouter.post('/seasons', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('seasons', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  seasonsRouter.get('/seasons', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('seasons', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  seasonsRouter.get('/seasons/:id', async (req, res) => {
    try {
      const result = await backend.read('seasons', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  seasonsRouter.put('/seasons/:id', async (req, res) => {
    try {
      const result = await backend.update('seasons', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  seasonsRouter.delete('/seasons/:id', async (req, res) => {
    try {
      await backend.delete('seasons', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ VENUES Routes ============
  const venuesRouter = Router()
  venuesRouter.post('/venues', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('venues', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  venuesRouter.get('/venues', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('venues', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  venuesRouter.get('/venues/:id', async (req, res) => {
    try {
      const result = await backend.read('venues', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  venuesRouter.put('/venues/:id', async (req, res) => {
    try {
      const result = await backend.update('venues', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  venuesRouter.delete('/venues/:id', async (req, res) => {
    try {
      await backend.delete('venues', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ CIRCUITS Routes ============
  const circuitsRouter = Router()
  circuitsRouter.post('/circuits', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('circuits', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  circuitsRouter.get('/circuits', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('circuits', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  circuitsRouter.get('/circuits/:id', async (req, res) => {
    try {
      const result = await backend.read('circuits', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  circuitsRouter.put('/circuits/:id', async (req, res) => {
    try {
      const result = await backend.update('circuits', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  circuitsRouter.delete('/circuits/:id', async (req, res) => {
    try {
      await backend.delete('circuits', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // ============ SEGMENTS Routes ============
  const segmentsRouter = Router()
  segmentsRouter.post('/segments', async (req, res) => {
    try {
      const data = req.body
      const result = await backend.create('segments', data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  segmentsRouter.get('/segments', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('segments', Object.keys(filters).length > 0 ? filters : undefined);
      const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true,
        total: paginated.total,
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  segmentsRouter.get('/segments/:id', async (req, res) => {
    try {
      const result = await backend.read('segments', parseInt(req.params.id))
      if (!result) {
        return res.status(404).json({ success: false, error: 'Not found' })
      }
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  segmentsRouter.put('/segments/:id', async (req, res) => {
    try {
      const result = await backend.update('segments', parseInt(req.params.id), req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  segmentsRouter.delete('/segments/:id', async (req, res) => {
    try {
      await backend.delete('segments', parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  })

  // Register all routers
  app.use('/api', clubsRouter)
  app.use('/api', usersRouter)
  app.use('/api', racesRouter)
  app.use('/api', competitionsRouter)
  app.use('/api', championshipsRouter)
  app.use('/api', disciplinesRouter)
  app.use('/api', eventsRouter)
  app.use('/api', registrationsRouter)
  app.use('/api', formatsRouter)
  app.use('/api', surfacesRouter)
  app.use('/api', divisionsRouter)
  app.use('/api', rolesRouter)
  app.use('/api', raceresultsRouter)
  app.use('/api', specialitiesRouter)
  app.use('/api', drivingenvironmentsRouter)
  app.use('/api', entitylinksRouter)
  app.use('/api', userentitiesRouter)
  app.use('/api', rolentitiesRouter)
  app.use('/api', levelsRouter)
  app.use('/api', groupsRouter)
  app.use('/api', scoringRouter)
  app.use('/api', scoringdetRouter)
  app.use('/api', rulebooksRouter)
  app.use('/api', rulesRouter)
  app.use('/api', seasonsRouter)
  app.use('/api', venuesRouter)
  app.use('/api', circuitsRouter)
  app.use('/api', segmentsRouter)

  return app
}
