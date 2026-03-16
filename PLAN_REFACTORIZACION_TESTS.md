# 📋 PLAN DE REFACTORIZACIÓN DE TESTS - ApiCarRaces
## Arquitectura Modular Multi-Entorno

---

## 📊 ANÁLISIS ACTUAL

### Estructura Presente
```
tests/
├── integration/          ❌ Tests sin modularizar
│   ├── users.test.ts
│   ├── clubs.test.ts
│   ├── competitions.test.ts
│   └── ... (18 archivos de test no refactorizados)
├── setup.ts             (Minimal - solo reflect-metadata)
└── setup.db.ts
```

### Estructura Objetivo (TestApi1)
```
__tests__/
├── cases/               ✅ Modularización de tests
│   ├── fixtures.ts      📦 Datos de prueba reutilizables
│   ├── setupApp.ts      🏗️  Factory de app + endpoints
│   └── testCases.ts     🧪 Casos de prueba reutilizables
├── integration/         🔗 Integración con múltiples backends
│   ├── api.memory.test.ts
│   ├── api.file.test.ts
│   ├── api.postgres.test.ts
│   ├── api.oracle.test.ts
│   └── api.supabase.test.ts
├── setup.ts            ⚙️  Configuración global
└── unit/
    └── repositories.test.ts
```

---

## 🎯 BENEFICIOS DE LA REFACTORIZACIÓN

| Aspecto | Antes | Después |
|---------|-------|--------|
| **DRY (Don't Repeat Yourself)** | ❌ Casos repetidos x 18 archivos | ✅ Un solo casos.ts |
| **Mantenibilidad** | ❌ Editar test = cambiar 18 archivos | ✅ Cambio centralizado |
| **Multi-entorno** | ❌ Solo PostgreSQL | ✅ Memory, File, Oracle, Supabase |
| **Reutilización** | ❌ Fixtures duplicadas | ✅ Fixtures.ts centralizado |
| **Escalabilidad** | ❌ Difícil agregar nuevas entidades | ✅ Agregar 1 línea en testCases.ts |

---

## 📋 PLAN IMPLEMENTACIÓN FASE 1: ESTRUCTURA BASE

### PASO 1: Crear estructura de directorios

```bash
mkdir -p __tests__\cases
mkdir -p __tests__\integration
mkdir -p __tests__\unit
mkdir -p src\backends              # Para interfaces de backends
```

---

### PASO 2: Crear `__tests__/cases/fixtures.ts`

**Propósito:** Centralizar TODOS los datos de prueba de las 16 entidades

**Estructura:**
```typescript
// Para cada entidad: modelo base + variantes
export const validClub = { /* datos válidos */ }
export const validUser = { /* datos válidos */ }
export const validCompetition = { /* datos válidos */ }
// ... 16 entidades

// Variantes para test de validación
export const incompleteClub = { /* sin campo requerido */ }
export const invalidEmail = { /* email inválido */ }

export const testDataSets = {
  clubs: { valid: validClub, incomplete: incompleteClub },
  users: { valid: validUser, invalid: invalidUser },
  competitions: { /* ... */ },
  // ... todas las 16 entidades
}
```

📊 **Cobertura:** Users | Clubs | Competitions | Events | Races | Registrations | Championships | Disciplines | Formats | Surfaces | Divisions | Roles | RolEntities | UserEntities | RaceResults | EntityLinks | Specialities | DrivingEnvironments

---

### PASO 3: Crear `__tests__/cases/setupApp.ts`

**Propósito:** Factory function para crear Express app con todos los endpoints

**Estructura:**
```typescript
export interface IBackendRepository {
  // Métodos comunes para todos los backends
  initialize(): Promise<void>
  clear(): Promise<void>
  close(): Promise<void>
}

export function createTestApp(
  repositories: {
    clubRepository: IClubRepository
    userRepository: IUserRepository
    // ... 16 repositorios
  }
): express.Application {
  const app = express()
  app.use(express.json())
  
  // Registrar todas las rutas
  app.use('/api', createClubRoutes(repositories.clubRepository))
  app.use('/api', createUserRoutes(repositories.userRepository))
  // ... 16 rutas
  
  return app
}
```

---

### PASO 4: Crear `__tests__/cases/testCases.ts`

**Propósito:** Casos de prueba reutilizables para TODOS los backends

**Estructura - Patrón:**
```typescript
export const raceTestCases = {
  // CRUD: Create
  async testCreateRace(app: express.Application) {
    const res = await request(app)
      .post('/api/races')
      .send(validRace)
    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('RaceId')
  },

  // CRUD: Read List
  async testListRaces(app: express.Application) {
    const res = await request(app)
      .get('/api/races?page=1&pageSize=20')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('total')
    expect(res.body).toHaveProperty('items')
  },

  // CRUD: Read by ID
  async testGetRaceById(app: express.Application, id: number) {
    const res = await request(app).get(`/api/races/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.RaceId).toBe(id)
  },

  // CRUD: Update
  async testUpdateRace(app: express.Application, id: number) {
    const res = await request(app)
      .put(`/api/races/${id}`)
      .send({ Descripcion: 'Updated' })
    expect(res.status).toBe(200)
  },

  // CRUD: Delete
  async testDeleteRace(app: express.Application, id: number) {
    const res = await request(app).delete(`/api/races/${id}`)
    expect(res.status).toBe(204)
  },

  // Validación
  async testValidateRequiredFields(app: express.Application) {
    const res = await request(app)
      .post('/api/races')
      .send({}) // Objeto vacío
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  },

  // Paginación
  async testPagination(app: express.Application) {
    const res = await request(app)
      .get('/api/races?page=1&pageSize=10')
    expect(res.body.page).toBe(1)
    expect(res.body.pageSize).toBe(10)
  },

  // Búsqueda
  async testSearch(app: express.Application, query: string) {
    const res = await request(app)
      .get(`/api/races?q=${query}`)
    expect(res.status).toBe(200)
  },

  // Filtrado
  async testFilter(app: express.Application) {
    const res = await request(app)
      .get('/api/races?ChampionshipId=1')
    expect(res.status).toBe(200)
  }
}

// Repetir para las 16 entidades:
export const clubTestCases = { /* ... */ }
export const userTestCases = { /* ... */ }
export const competitionTestCases = { /* ... */ }
// ... (13 más)

export const allTestCases = {
  races: raceTestCases,
  clubs: clubTestCases,
  users: userTestCases,
  // ... todas
}
```

---

## 📋 PLAN IMPLEMENTACIÓN FASE 2: BACKENDS MULTIPLESX

### PASO 5: Crear backends (Memory, File, PostgreSQL, Supabase)

**Estructura:**
```
src/backends/
├── IBackend.ts          # Interfaz común
├── MemoryBackend.ts     # En RAM
├── FileBackend.ts       # JSON files
├── PostgresBackend.ts   # Actual (reuse)
├── SupabaseBackend.ts   # Supabase
└── OracleBackend.ts     # Oracle
```

**Interfaz base `src/backends/IBackend.ts`:**
```typescript
export interface IBackend {
  initialize(): Promise<void>
  clear(): Promise<void>
  close(): Promise<void>
  
  // Métodos genéricos (CRUD por entidad)
  create(entity: string, data: any): Promise<any>
  read(entity: string, id: any): Promise<any>
  readAll(entity: string, filters?: any): Promise<any[]>
  update(entity: string, id: any, data: any): Promise<any>
  delete(entity: string, id: any): Promise<void>
}
```

---

### PASO 6: Crear `__tests__/integration/api.memory.test.ts`

**Patrón a repetir para: file, postgres, oracle, supabase**

```typescript
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { MemoryBackend } from '../../src/backends/MemoryBackend'
import { createTestApp } from '../cases/setupApp'
import { allTestCases } from '../cases/testCases'
import { testDataSets } from '../cases/fixtures'

describe('API Integration - Memory Backend', () => {
  let app: express.Application
  let backend: MemoryBackend

  beforeAll(async () => {
    backend = new MemoryBackend()
    await backend.initialize()
    const repositories = createRepositoriesFromBackend(backend)
    app = createTestApp(repositories)
  })

  afterAll(async () => {
    await backend.close()
  })

  beforeEach(async () => {
    await backend.clear()
  })

  // ====== RACES TESTS ======
  describe('Races', () => {
    it('should create a race', () => 
      allTestCases.races.testCreateRace(app))
    
    it('should list races with pagination', () => 
      allTestCases.races.testListRaces(app))
    
    it('should get race by id', () => 
      allTestCases.races.testGetRaceById(app, 1))
    
    it('should update a race', () => 
      allTestCases.races.testUpdateRace(app, 1))
    
    it('should delete a race', () => 
      allTestCases.races.testDeleteRace(app, 1))
    
    it('should validate required fields', () => 
      allTestCases.races.testValidateRequiredFields(app))
  })

  // ====== USERS TESTS ======
  describe('Users', () => {
    it('should create a user', () => 
      allTestCases.users.testCreateUser(app))
    // ... más tests
  })

  // ====== CLUBS TESTS ======
  describe('Clubs', () => {
    it('should create a club', () => 
      allTestCases.clubs.testCreateClub(app))
    // ... más tests
  })

  // ... Repetir para las 13 entidades restantes
})
```

---

## 📋 PLAN IMPLEMENTACIÓN FASE 3: CONFIGURACIÓN

### PASO 7: Actualizar `__tests__/setup.ts`

```typescript
import 'reflect-metadata'
import { config } from 'dotenv'

// Cargar variables de entorno según el backend
const envFile = process.env.BACKEND || 'memory'
config({ path: `.env.test.${envFile}` })

console.log('✅ Reflect-metadata loaded')
console.log(`✅ Testing with backend: ${envFile}`)
```

### PASO 8: Actualizar `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['__tests__/setup.ts'],
    include: ['__tests__/**/*.test.ts'],
    
    // Backends a probar
    env: {
      BACKEND: process.env.BACKEND || 'memory'
    }
  }
})
```

### PASO 9: Actualizar `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:memory": "BACKEND=memory vitest",
    "test:file": "BACKEND=file vitest",
    "test:postgres": "BACKEND=postgres vitest",
    "test:supabase": "BACKEND=supabase vitest",
    "test:oracle": "BACKEND=oracle vitest",
    "test:all": "npm run test:memory && npm run test:file && npm run test:postgres && npm run test:supabase && npm run test:oracle",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 📋 PLAN IMPLEMENTACIÓN FASE 4: MIGRACIÓN

### PASO 10: Migrar tests existentes

**workflow:**
1. ✅ Mantener `tests/integration/*.test.ts` (backup)
2. ✅ Crear versión modular en `__tests__/integration/*.test.ts`
3. ✅ Validar que pasen todos los tests
4. ✅ Eliminar archivos antiguos

**Mapeo de archivos:**

| Antes | Después | Módulo |
|-------|---------|---------|
| `tests/integration/users.test.ts` | `__tests__/integration/api.*.test.ts` | allTestCases.users |
| `tests/integration/clubs.test.ts` | `__tests__/integration/api.*.test.ts` | allTestCases.clubs |
| `tests/integration/races.test.ts` | `__tests__/integration/api.*.test.ts` | allTestCases.races |
| ... (18 archivos) | ... | ... |

---

## 📊 DIAGRAMA DE FLUJO

```
┌─────────────────────────────────────────────┐
│     __tests__/cases/fixtures.ts            │
│                                             │
│  ├─ validClub, validUser, ...              │
│  ├─ incompleteClub, invalidEmail, ...      │
│  └─ testDataSets{clubs, users, ...}        │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│   __tests__/cases/setupApp.ts              │
│                                             │
│  ├─ createTestApp(repositories)            │
│  └─ Registra 16 rutas                      │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│   __tests__/cases/testCases.ts             │
│                                             │
│  ├─ allTestCases.races.testCreateRace()   │
│  ├─ allTestCases.users.testCreateUser()   │
│  └─ ... 16 entidades                       │
└────────────┬────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│      __tests__/integration/api.{backend}.test.ts        │
│                                                          │
│  ├─ api.memory.test.ts    ← MemoryBackend              │
│  ├─ api.file.test.ts      ← FileBackend                │
│  ├─ api.postgres.test.ts  ← PostgresBackend            │
│  ├─ api.supabase.test.ts  ← SupabaseBackend            │
│  └─ api.oracle.test.ts    ← OracleBackend              │
└──────────────────────────────────────────────────────────┘
```

---

## 📈 ESTADÍSTICAS POST-REFACTORIZACIÓN

### Antes
```
tests/integration/
├── 18 archivos
├── ~2,000 líneas de código
└── 111 tests (100% duplicación)
```

### Después
```
__tests__/
├── cases/          (300 líneas - centralizado)
├── integration/    (500 líneas - solo 5 archivos)
└── unit/          (200 líneas)

Total: 1,000 líneas (-50% código)
Duplicación: 0%
Tests ejecutables: 111 × 5 = 555 tests (5 backends)
```

---

## 🔄 EJECUCIÓN PROGRESIVA

### Fase 1: Fundamentos (Paso 1-4)
- ⏱️ Estimado: 2-3 horas
- 🎯 Resultado: Estructura modular bases

### Fase 2: Multi-Backend (Paso 5-6)
- ⏱️ Estimado: 4-5 horas
- 🎯 Resultado: Tests en 5 backends

### Fase 3: Configuración (Paso 7-9)
- ⏱️ Estimado: 1 hora
- 🎯 Resultado: Scripts de test listos

### Fase 4: Migración (Paso 10)
- ⏱️ Estimado: 2 horas
- 🎯 Resultado: Migration completa

---

## ✅ CHECKLIST FINAL

- [ ] Estructura `__tests__/cases/` creada
- [ ] `fixtures.ts` con 16 entidades
- [ ] `setupApp.ts` con factory
- [ ] `testCases.ts` reutilizable
- [ ] Backends creados (Memory, File, Postgres, Supabase, Oracle)
- [ ] `__tests__/integration/*.test.ts` refactorizado (5 archivos)
- [ ] `vitest.config.ts` actualizado
- [ ] `package.json` scripts agregados
- [ ] Todos los tests pasan
- [ ] Tests `tests/integration/` eliminados (o respaldados)

---

## 📞 NOTAS IMPORTANTES

1. **Fixtures:** Usa los mismos tipos de `src/*/entities/*.ts`
2. **Backends:** Crea wrappers que unifiquen las interfaces diferentes
3. **Tests:** Usa patrones async/await para consistencia
4. **Documentación:** Comenta cada caso de prueba
5. **CI/CD:** Actualiza tu pipeline para correr 5 backends

