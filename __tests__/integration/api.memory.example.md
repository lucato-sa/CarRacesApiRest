# 📝 EJEMPLOS ESPECÍFICOS - __tests__/integration/api.*.test.ts
## Patrón de Tests para Memory, File, PostgreSQL, Supabase, Oracle

```typescript
// ════════════════════════════════════════════════════════════════
// __tests__/integration/api.memory.test.ts
// ════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'

// Importar funciones base
import { createTestApp, IRepositories } from '../cases/setupApp'
import { allTestCases, setupTestData } from '../cases/testCases'
import { testDataSets } from '../cases/fixtures'

// Backend: Memory
import { MemoryUserRepository } from '../../src/backends/MemoryBackend'
import { MemoryClubRepository } from '../../src/backends/MemoryBackend'
import { MemoryRaceRepository } from '../../src/backends/MemoryBackend'
import { MemoryCompetitionRepository } from '../../src/backends/MemoryBackend'
import { MemoryChampionshipRepository } from '../../src/backends/MemoryBackend'
import { MemoryEventRepository } from '../../src/backends/MemoryBackend'
import { MemoryRegistrationRepository } from '../../src/backends/MemoryBackend'
import { MemoryDisciplineRepository } from '../../src/backends/MemoryBackend'
import { MemoryFormatRepository } from '../../src/backends/MemoryBackend'
import { MemorySurfaceRepository } from '../../src/backends/MemoryBackend'
import { MemoryDivisionRepository } from '../../src/backends/MemoryBackend'
import { MemoryRoleRepository } from '../../src/backends/MemoryBackend'
import { MemoryRoleEntityRepository } from '../../src/backends/MemoryBackend'
import { MemoryUserEntityRepository } from '../../src/backends/MemoryBackend'
import { MemoryRaceResultRepository } from '../../src/backends/MemoryBackend'
import { MemoryEntityLinkRepository } from '../../src/backends/MemoryBackend'
import { MemorySpecialityRepository } from '../../src/backends/MemoryBackend'
import { MemoryDrivingEnvironmentRepository } from '../../src/backends/MemoryBackend'

describe('📱 API Integration Tests - Memory Backend', () => {
  let app: express.Application
  let repositories: IRepositories
  let testIds: { userId?: number; clubId?: number } = {}

  // ═══════════════════════════════════════════════════════════
  // SETUP & TEARDOWN
  // ═══════════════════════════════════════════════════════════

  beforeAll(async () => {
    console.log('🚀 Memory Backend: Initializing...')
    
    // Crear instancias de repositorios en memoria
    repositories = {
      userRepository: new MemoryUserRepository(),
      clubRepository: new MemoryClubRepository(),
      raceRepository: new MemoryRaceRepository(),
      competitionRepository: new MemoryCompetitionRepository(),
      championshipRepository: new MemoryChampionshipRepository(),
      eventRepository: new MemoryEventRepository(),
      registrationRepository: new MemoryRegistrationRepository(),
      disciplineRepository: new MemoryDisciplineRepository(),
      formatRepository: new MemoryFormatRepository(),
      surfaceRepository: new MemorySurfaceRepository(),
      divisionRepository: new MemoryDivisionRepository(),
      roleRepository: new MemoryRoleRepository(),
      roleEntityRepository: new MemoryRoleEntityRepository(),
      userEntityRepository: new MemoryUserEntityRepository(),
      raceResultRepository: new MemoryRaceResultRepository(),
      entityLinkRepository: new MemoryEntityLinkRepository(),
      specialityRepository: new MemorySpecialityRepository(),
      drivingEnvironmentRepository: new MemoryDrivingEnvironmentRepository(),
    }

    // Crear app con repositorios
    app = createTestApp(repositories)
    
    console.log('✅ Memory Backend: Ready')
  })

  afterAll(async () => {
    console.log('🧹 Cleanup: Memory Backend')
  })

  beforeEach(async () => {
    // Limpiar datos antes de cada test
    await Promise.all([
      (repositories.userRepository as any).clear?.(),
      (repositories.clubRepository as any).clear?.(),
      (repositories.raceRepository as any).clear?.(),
    ].filter(Boolean))
  })

  // ═══════════════════════════════════════════════════════════
  // USERS TESTS
  // ═══════════════════════════════════════════════════════════

  describe('👤 Users', () => {
    it('should create a user', async () => {
      await allTestCases.users.testCreateUserSuccess(app, testDataSets.users.valid)
    })

    it('should validate required fields', async () => {
      await allTestCases.users.testValidateRequiredFields(app)
    })

    it('should validate email format', async () => {
      await allTestCases.users.testValidateEmailFormat(app)
    })

    it('should list users with pagination', async () => {
      // Setup: Crear 2 usuarios
      await request(app)
        .post('/api/users')
        .send(testDataSets.users.valid)
      await request(app)
        .post('/api/users')
        .send(testDataSets.users.second)

      // Test
      await allTestCases.users.testListUsersWithPagination(app)
    })

    it('should search users', async () => {
      await request(app)
        .post('/api/users')
        .send(testDataSets.users.valid)

      await allTestCases.users.testSearchUsers(app, 'Juan')
    })

    it('should get user by id', async () => {
      const createRes = await request(app)
        .post('/api/users')
        .send(testDataSets.users.valid)

      await allTestCases.users.testGetUserById(app, createRes.body.data.UserId)
    })

    it('should update user', async () => {
      const createRes = await request(app)
        .post('/api/users')
        .send(testDataSets.users.valid)

      await allTestCases.users.testUpdateUser(app, createRes.body.data.UserId, {
        Nombre: 'Juan Carlos',
      })
    })

    it('should delete user', async () => {
      const createRes = await request(app)
        .post('/api/users')
        .send(testDataSets.users.valid)

      await allTestCases.users.testDeleteUser(app, createRes.body.data.UserId)
    })
  })

  // ═══════════════════════════════════════════════════════════
  // CLUBS TESTS
  // ═══════════════════════════════════════════════════════════

  describe('🏁 Clubs', () => {
    it('should create a club', async () => {
      await allTestCases.clubs.testCreateClubSuccess(app, testDataSets.clubs.valid)
    })

    it('should validate required fields', async () => {
      await allTestCases.clubs.testValidateRequiredFields(app)
    })

    it('should list clubs with pagination', async () => {
      await request(app)
        .post('/api/clubs')
        .send(testDataSets.clubs.valid)
      await request(app)
        .post('/api/clubs')
        .send(testDataSets.clubs.second)

      await allTestCases.clubs.testListClubsWithPagination(app)
    })

    it('should get club by id', async () => {
      const createRes = await request(app)
        .post('/api/clubs')
        .send(testDataSets.clubs.valid)

      await allTestCases.clubs.testGetClubById(app, createRes.body.data.ClubId)
    })

    it('should update club', async () => {
      const createRes = await request(app)
        .post('/api/clubs')
        .send(testDataSets.clubs.valid)

      await allTestCases.clubs.testUpdateClub(app, createRes.body.data.ClubId, {
        ClubName: 'Updated Club Name',
      })
    })

    it('should delete club', async () => {
      const createRes = await request(app)
        .post('/api/clubs')
        .send(testDataSets.clubs.valid)

      await allTestCases.clubs.testDeleteClub(app, createRes.body.data.ClubId)
    })
  })

  // ═══════════════════════════════════════════════════════════
  // RACES TESTS
  // ═══════════════════════════════════════════════════════════

  describe('🏎️ Races', () => {
    it('should create a race', async () => {
      await allTestCases.races.testCreateRaceSuccess(app, testDataSets.races.valid)
    })

    it('should validate required fields', async () => {
      await allTestCases.races.testValidateRequiredFields(app)
    })

    it('should list races with pagination', async () => {
      await request(app)
        .post('/api/races')
        .send(testDataSets.races.valid)

      await allTestCases.races.testListRacesWithPagination(app)
    })

    it('should filter races by championship', async () => {
      await request(app)
        .post('/api/races')
        .send(testDataSets.races.valid)

      await allTestCases.races.testFilterRacesByChampionship(app, 1)
    })

    it('should get race by id', async () => {
      const createRes = await request(app)
        .post('/api/races')
        .send(testDataSets.races.valid)

      if (createRes.status === 201) {
        await allTestCases.races.testGetRaceById(app, createRes.body.data.RaceId)
      }
    })

    it('should update race', async () => {
      const createRes = await request(app)
        .post('/api/races')
        .send(testDataSets.races.valid)

      if (createRes.status === 201) {
        await allTestCases.races.testUpdateRace(
          app,
          createRes.body.data.RaceId,
          { Descripcion: 'Updated race' }
        )
      }
    })

    it('should delete race', async () => {
      const createRes = await request(app)
        .post('/api/races')
        .send(testDataSets.races.valid)

      if (createRes.status === 201) {
        await allTestCases.races.testDeleteRace(app, createRes.body.data.RaceId)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════
  // COMPETITIONS TESTS
  // ═══════════════════════════════════════════════════════════

  describe('🎯 Competitions', () => {
    it('should create a competition', async () => {
      await allTestCases.competitions.testCreateCompetitionSuccess(
        app,
        testDataSets.competitions.valid
      )
    })

    it('should list competitions', async () => {
      await request(app)
        .post('/api/competitions')
        .send(testDataSets.competitions.valid)

      await allTestCases.competitions.testListCompetitions(app)
    })

    it('should get competition by id', async () => {
      const createRes = await request(app)
        .post('/api/competitions')
        .send(testDataSets.competitions.valid)

      if (createRes.status === 201) {
        await allTestCases.competitions.testGetCompetitionById(
          app,
          createRes.body.data.CompetitionId
        )
      }
    })

    it('should update competition', async () => {
      const createRes = await request(app)
        .post('/api/competitions')
        .send(testDataSets.competitions.valid)

      if (createRes.status === 201) {
        await allTestCases.competitions.testUpdateCompetition(
          app,
          createRes.body.data.CompetitionId,
          { Descripcion: 'Updated competition' }
        )
      }
    })
  })

  // ═══════════════════════════════════════════════════════════
  // CHAMPIONSHIPS TESTS (Read-only)
  // ═══════════════════════════════════════════════════════════

  describe('👑 Championships', () => {
    it('should list championships', async () => {
      await allTestCases.championships.testListChampionships(app)
    })
  })

  // ═══════════════════════════════════════════════════════════
  // REGISTRATIONS TESTS
  // ═══════════════════════════════════════════════════════════

  describe('📝 Registrations', () => {
    it('should create a registration', async () => {
      // Setup: Crear usuario y competición primero
      const userRes = await request(app)
        .post('/api/users')
        .send(testDataSets.users.valid)
      const competitionRes = await request(app)
        .post('/api/competitions')
        .send(testDataSets.competitions.valid)

      if (userRes.status === 201 && competitionRes.status === 201) {
        const registrationData = {
          UserId: userRes.body.data.UserId,
          CompetitionId: competitionRes.body.data.CompetitionId,
          EventId: 1,
          FechaRegistro: new Date().toISOString(),
          Estado: 'ACTIVO',
        }

        await allTestCases.registrations.testCreateRegistrationSuccess(
          app,
          registrationData
        )
      }
    })

    it('should list registrations', async () => {
      await allTestCases.registrations.testListRegistrations(app)
    })
  })
})

/**
 * ════════════════════════════════════════════════════════════════
 * PATRÓN PARA OTROS BACKENDS
 * ════════════════════════════════════════════════════════════════
 * 
 * Para implementar tests en otros backends (File, PostgreSQL, Supabase, Oracle):
 * 
 * 1. Copiar este archivo
 * 2. Cambiar:
 *    - describe('... Memory Backend', () => {
 *    - Importar repositorios del backend correspondiente
 *    - beforeAll: inicializar con config del backend
 *    - beforeEach: clear específico del backend
 * 
 * EJEMPLO PARA FILE BACKEND:
 * 
 * import { FileUserRepository } from '../../src/backends/FileBackend'
 * import { FileClubRepository } from '../../src/backends/FileBackend'
 * //... etc
 * 
 * describe('📁 API Integration Tests - File Backend', () => {
 *   beforeAll(async () => {
 *     console.log('🚀 File Backend: Initializing...')
 *     
 *     repositories = {
 *       userRepository: new FileUserRepository('./data/users.json'),
 *       clubRepository: new FileClubRepository('./data/clubs.json'),
 *       // ... resto de repositorios
 *     }
 *     
 *     app = createTestApp(repositories)
 *     console.log('✅ File Backend: Ready')
 *   })
 * })
 * 
 * EJEMPLO PARA POSTGRES BACKEND:
 * 
 * import { PostgresUserRepository } from '../../src/backends/PostgresBackend'
 * 
 * describe('🐘 API Integration Tests - PostgreSQL Backend', () => {
 *   beforeAll(async () => {
 *     console.log('🚀 PostgreSQL Backend: Initializing...')
 *     
 *     // Usar conexión a DB test
 *     const dataSource = new DataSource({
 *       type: 'postgres',
 *       host: process.env.DB_HOST_TEST,
 *       // ... config
 *     })
 *     
 *     await dataSource.initialize()
 *     
 *     repositories = {
 *       userRepository: new PostgresUserRepository(dataSource),
 *       // ... resto
 *     }
 *     
 *     app = createTestApp(repositories)
 *     console.log('✅ PostgreSQL Backend: Ready')
 *   })
 * })
 */
```

