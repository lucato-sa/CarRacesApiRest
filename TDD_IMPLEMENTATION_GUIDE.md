# Guía TDD - Implementación de la API CarRaces

## Flujo de Implementación Recomendado

### Paso 1: Crear la estructura base de Express

```typescript
// src/server.ts
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Aquí irán las rutas

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
```

### Paso 2: Implementar Controlador de Clubs (ejemplo)

**Siguiendo TDD:**

1. El test ya espera: `GET /clubs` → lista paginada
2. El test espera: `POST /clubs` → crear club
3. El test espera: `GET /clubs/{id}` → obtener club
4. El test espera: `PUT /clubs/{id}` → actualizar club
5. El test espera: `DELETE /clubs/{id}` → eliminar club

```typescript
// src/controllers/clubs.controller.ts
import { Request, Response } from 'express';

interface Club {
  ClubId?: number;
  Alias: string;
  TaxNombre: string;
  TaxNumero: string;
  Descripcion: string;
  FechaFundacion: string;
  default?: boolean;
}

// Simular base de datos en memoria (reemplazar con DB real)
const clubs: Club[] = [
  {
    ClubId: 1,
    Alias: 'ClubRacing',
    TaxNombre: 'Racing SL',
    TaxNumero: 'B12345678',
    Descripcion: 'Club de pruebas',
    FechaFundacion: '1995-06-15',
    default: true,
  },
];

export const getClubs = (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const q = req.query.q as string;
  const alias = req.query.alias as string;

  // Filtrar
  let filtered = clubs;
  if (q) {
    filtered = filtered.filter(c => 
      c.Alias.toLowerCase().includes(q.toLowerCase()) ||
      c.TaxNombre.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (alias) {
    filtered = filtered.filter(c => c.Alias === alias);
  }

  // Paginar
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  res.json({
    total: filtered.length,
    page,
    pageSize,
    items,
  });
};

export const createClub = (req: Request, res: Response) => {
  const { Alias, TaxNombre, TaxNumero, Descripcion, FechaFundacion } = req.body;

  // Validar campos requeridos
  if (!Alias || !TaxNombre || !TaxNumero || !Descripcion || !FechaFundacion) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newClub: Club = {
    ClubId: Math.max(...clubs.map(c => c.ClubId || 0)) + 1,
    Alias,
    TaxNombre,
    TaxNumero,
    Descripcion,
    FechaFundacion,
  };

  clubs.push(newClub);
  res.status(201).json(newClub);
};

export const getClubById = (req: Request, res: Response) => {
  const club = clubs.find(c => c.ClubId === parseInt(req.params.id));
  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }
  res.json(club);
};

export const updateClub = (req: Request, res: Response) => {
  const club = clubs.find(c => c.ClubId === parseInt(req.params.id));
  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }

  Object.assign(club, req.body);
  res.json(club);
};

export const deleteClub = (req: Request, res: Response) => {
  const index = clubs.findIndex(c => c.ClubId === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Club not found' });
  }

  clubs.splice(index, 1);
  res.status(204).send();
};
```

### Paso 3: Crear Rutas

```typescript
// src/routes/clubs.routes.ts
import { Router } from 'express';
import {
  getClubs,
  createClub,
  getClubById,
  updateClub,
  deleteClub,
} from '../controllers/clubs.controller';

const router = Router();

router.get('/clubs', getClubs);
router.post('/clubs', createClub);
router.get('/clubs/:id', getClubById);
router.put('/clubs/:id', updateClub);
router.delete('/clubs/:id', deleteClub);

export default router;
```

### Paso 4: Registrar Rutas en Server

```typescript
// src/server.ts
import express from 'express';
import clubsRoutes from './routes/clubs.routes';

const app = express();
app.use(express.json());

// Mount routes under /api
app.use('/api', clubsRoutes);

export default app;
```

### Paso 5: Ejecutar Tests Against API (E2E)

Para tests reales (cuando el servidor esté listo), usar supertest:

```typescript
// tests/integration/clubs.e2e.test.ts
import request from 'supertest';
import app from '../../src/server';

describe('Clubs Endpoints [E2E]', () => {
  describe('POST /api/clubs', () => {
    it('should create a club and return 201', async () => {
      const newClub = {
        Alias: 'TestClub',
        TaxNombre: 'Test SL',
        TaxNumero: 'B99999999',
        Descripcion: 'Test club',
        FechaFundacion: '2025-01-01',
      };

      const response = await request(app)
        .post('/api/clubs')
        .send(newClub)
        .expect(201);

      expect(response.body).toHaveProperty('ClubId');
      expect(response.body.Alias).toBe('TestClub');
    });

    it('should return 400 if missing required fields', async () => {
      await request(app)
        .post('/api/clubs')
        .send({ Alias: 'OnlyAlias' })
        .expect(400);
    });
  });

  describe('GET /api/clubs', () => {
    it('should return paginated list', async () => {
      const response = await request(app)
        .get('/api/clubs')
        .query({ page: 1, pageSize: 20 })
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('items');
    });
  });

  describe('GET /api/clubs/{id}', () => {
    it('should return specific club', async () => {
      const response = await request(app)
        .get('/api/clubs/1')
        .expect(200);

      expect(response.body.ClubId).toBe(1);
    });

    it('should return 404 for non-existent club', async () => {
      await request(app)
        .get('/api/clubs/9999')
        .expect(404);
    });
  });

  describe('PUT /api/clubs/{id}', () => {
    it('should update club', async () => {
      const updateData = {
        Alias: 'UpdatedClub',
        TaxNombre: 'Updated SL',
        TaxNumero: 'B88888888',
        Descripcion: 'Updated',
        FechaFundacion: '1995-06-15',
      };

      const response = await request(app)
        .put('/api/clubs/1')
        .send(updateData)
        .expect(200);

      expect(response.body.Alias).toBe('UpdatedClub');
    });
  });

  describe('DELETE /api/clubs/{id}', () => {
    it('should delete club', async () => {
      await request(app)
        .delete('/api/clubs/1')
        .expect(204);
    });

    it('should return 404 when deleting non-existent', async () => {
      await request(app)
        .delete('/api/clubs/9999')
        .expect(404);
    });
  });
});
```

---

## Orden Recomendado de Implementación

1. **Master Data** (sin lógica compleja):
   - Formats
   - Surfaces
   - DrivingEnviroments
   - Specialities

2. **Core Entities** (con CRUD completo):
   - Clubs
   - Users
   - Divisions
   - Disciplines

3. **Complex Entities** (con relaciones):
   - Championships
   - Events
   - Competitions
   - Registrations

4. **Specialized Endpoints**:
   - Races (solo UPDATE)
   - RaceResults (solo UPDATE)
   - RolEntities
   - UserEntities

---

## Checklist de Implementación

- [ ] Estructura Express configurada
- [ ] Base de datos/repositorio configurado
- [ ] Master Data endpoints implementados
- [ ] Clubs CRUD completo
- [ ] Users CRUD completo
- [ ] Validaciones en middleware
- [ ] Error handling centralizado
- [ ] Events CRUD
- [ ] Competitions CRUD
- [ ] Registrations CRUD
- [ ] Races/RaceResults
- [ ] RolEntities/UserEntities
- [ ] Autenticación JWT (si es necesaria)
- [ ] Tests E2E con supertest
- [ ] Documentación API actualizada

---

## Comandos Útiles

```bash
# Ejecutar servidor en desarrollo
npm run dev

# Ejecutar tests en watch mode
npm test -- --watch

# Ejecutar tests + coverage
npm test -- --coverage

# Build del proyecto
npm run build

# Iniciar servidor producción
npm run start
```

---

## Validaciones a Implementar (Middleware)

```typescript
// src/middleware/validation.ts
export const validateClub = (req: Request, res: Response, next: NextFunction) => {
  const { Alias, TaxNombre, TaxNumero, Descripcion, FechaFundacion } = req.body;

  const errors: string[] = [];
  if (!Alias) errors.push('Alias is required');
  if (!TaxNombre) errors.push('TaxNombre is required');
  if (!TaxNumero) errors.push('TaxNumero is required');
  if (!Descripcion) errors.push('Descripcion is required');
  if (!FechaFundacion) errors.push('FechaFundacion is required');

  // Validar formato de fecha
  if (FechaFundacion && !/^\d{4}-\d{2}-\d{2}$/.test(FechaFundacion)) {
    errors.push('FechaFundacion must be in YYYY-MM-DD format');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
```

---

## Próximos Pasos

1. Implementar estructura base y master data
2. Agregar tests E2E progresivamente
3. Implementar validaciones robustas
4. Agregar autenticación si es requerida
5. Deploying
