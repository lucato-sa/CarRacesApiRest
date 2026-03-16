# 📝 EJEMPLOS ESPECÍFICOS - __tests__/cases/testCases.ts
## Casos de Prueba Reutilizables para Todos los Backends

```typescript
import request from 'supertest'
import express from 'express'

/**
 * ═══════════════════════════════════════════════════════════════════
 * USERS TEST CASES - Reutilizables para Memory, File, Postgres, Supabase, Oracle
 * ═══════════════════════════════════════════════════════════════════
 */

export const userTestCases = {
  /**
   * Caso: Crear usuario exitosamente
   */
  async testCreateUserSuccess(
    app: express.Application,
    userData: any
  ) {
    const res = await request(app)
      .post('/api/users')
      .send(userData)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('UserId')
    expect(res.body.data.Nick).toBe(userData.Nick)
    expect(res.body.data.Email).toBe(userData.Email)
  },

  /**
   * Caso: Validar campos requeridos
   */
  async testValidateRequiredFields(app: express.Application) {
    const incompleteUser = {
      Nick: 'incomplete_user',
      // Falta Nombre, Apellidos, Email
    }

    const res = await request(app)
      .post('/api/users')
      .send(incompleteUser)

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.errors).toBeDefined()
  },

  /**
   * Caso: Validar formato de email
   */
  async testValidateEmailFormat(app: express.Application) {
    const invalidEmailUser = {
      Nick: 'invalid_email_user',
      Nombre: 'Test',
      Apellidos: 'User',
      Email: 'invalid-email', // Sin @
    }

    const res = await request(app)
      .post('/api/users')
      .send(invalidEmailUser)

    expect(res.status).toBe(400)
    expect(res.body.errors).toContain(expect.stringContaining('email'))
  },

  /**
   * Caso: Listar usuarios con paginación
   */
  async testListUsersWithPagination(app: express.Application) {
    const res = await request(app)
      .get('/api/users?page=1&pageSize=10')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('total')
    expect(res.body).toHaveProperty('page', 1)
    expect(res.body).toHaveProperty('pageSize', 10)
    expect(res.body).toHaveProperty('items')
    expect(Array.isArray(res.body.items)).toBe(true)
  },

  /**
   * Caso: Buscar usuarios con query
   */
  async testSearchUsers(app: express.Application, query: string) {
    const res = await request(app)
      .get(`/api/users?q=${query}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
  },

  /**
   * Caso: Obtener usuario por ID
   */
  async testGetUserById(
    app: express.Application,
    userId: any
  ) {
    const res = await request(app)
      .get(`/api/users/${userId}`)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('UserId')
      expect(res.body).toHaveProperty('Nick')
      expect(res.body).toHaveProperty('Email')
    } else {
      expect(res.status).toBe(404)
    }
  },

  /**
   * Caso: Actualizar usuario
   */
  async testUpdateUser(
    app: express.Application,
    userId: any,
    updateData: any
  ) {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send(updateData)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('UserId')
    } else {
      expect(res.status).toBe(404)
    }
  },

  /**
   * Caso: Eliminar usuario
   */
  async testDeleteUser(app: express.Application, userId: any) {
    const res = await request(app)
      .delete(`/api/users/${userId}`)

    expect([204, 404]).toContain(res.status)
  },
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * CLUBS TEST CASES
 * ═══════════════════════════════════════════════════════════════════
 */

export const clubTestCases = {
  async testCreateClubSuccess(
    app: express.Application,
    clubData: any
  ) {
    const res = await request(app)
      .post('/api/clubs')
      .send(clubData)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('ClubId')
    expect(res.body.data.ClubName).toBe(clubData.ClubName)
  },

  async testListClubsWithPagination(app: express.Application) {
    const res = await request(app)
      .get('/api/clubs?page=1&pageSize=10')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('total')
    expect(res.body).toHaveProperty('items')
  },

  async testGetClubById(app: express.Application, clubId: any) {
    const res = await request(app)
      .get(`/api/clubs/${clubId}`)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('ClubId')
    } else {
      expect(res.status).toBe(404)
    }
  },

  async testUpdateClub(
    app: express.Application,
    clubId: any,
    updateData: any
  ) {
    const res = await request(app)
      .put(`/api/clubs/${clubId}`)
      .send(updateData)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('ClubId')
    } else {
      expect(res.status).toBe(404)
    }
  },

  async testDeleteClub(app: express.Application, clubId: any) {
    const res = await request(app)
      .delete(`/api/clubs/${clubId}`)

    expect([204, 404]).toContain(res.status)
  },

  async testValidateRequiredFields(app: express.Application) {
    const incompleteClub = {
      // Falta ClubName
      Descripcion: 'Test Club',
    }

    const res = await request(app)
      .post('/api/clubs')
      .send(incompleteClub)

    expect(res.status).toBe(400)
  },
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * RACES TEST CASES
 * ═══════════════════════════════════════════════════════════════════
 */

export const raceTestCases = {
  async testCreateRaceSuccess(
    app: express.Application,
    raceData: any
  ) {
    const res = await request(app)
      .post('/api/races')
      .send(raceData)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('RaceId')
    expect(res.body.data.RaceName).toBe(raceData.RaceName)
  },

  async testListRacesWithPagination(app: express.Application) {
    const res = await request(app)
      .get('/api/races?page=1&pageSize=10')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
    expect(res.body).toHaveProperty('total')
  },

  async testFilterRacesByChampionship(
    app: express.Application,
    championshipId: any
  ) {
    const res = await request(app)
      .get(`/api/races?ChampionshipId=${championshipId}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
  },

  async testGetRaceById(app: express.Application, raceId: any) {
    const res = await request(app)
      .get(`/api/races/${raceId}`)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('RaceId')
      expect(res.body).toHaveProperty('RaceName')
    } else {
      expect(res.status).toBe(404)
    }
  },

  async testUpdateRace(
    app: express.Application,
    raceId: any,
    updateData: any
  ) {
    const res = await request(app)
      .put(`/api/races/${raceId}`)
      .send(updateData)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('RaceId')
    } else {
      expect(res.status).toBe(404)
    }
  },

  async testDeleteRace(app: express.Application, raceId: any) {
    const res = await request(app)
      .delete(`/api/races/${raceId}`)

    expect([204, 404]).toContain(res.status)
  },

  async testValidateRequiredFields(app: express.Application) {
    const incompleteRace = {
      // Falta RaceName, FechaInicio, FechaFin, etc.
    }

    const res = await request(app)
      .post('/api/races')
      .send(incompleteRace)

    expect(res.status).toBe(400)
  },
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * COMPETITIONS TEST CASES
 * ═══════════════════════════════════════════════════════════════════
 */

export const competitionTestCases = {
  async testCreateCompetitionSuccess(
    app: express.Application,
    competitionData: any
  ) {
    const res = await request(app)
      .post('/api/competitions')
      .send(competitionData)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('CompetitionId')
  },

  async testListCompetitions(app: express.Application) {
    const res = await request(app)
      .get('/api/competitions?page=1&pageSize=20')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
  },

  async testGetCompetitionById(
    app: express.Application,
    competitionId: any
  ) {
    const res = await request(app)
      .get(`/api/competitions/${competitionId}`)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('CompetitionId')
    } else {
      expect(res.status).toBe(404)
    }
  },

  async testUpdateCompetition(
    app: express.Application,
    competitionId: any,
    updateData: any
  ) {
    const res = await request(app)
      .put(`/api/competitions/${competitionId}`)
      .send(updateData)

    expect([200, 404]).toContain(res.status)
  },

  async testDeleteCompetition(
    app: express.Application,
    competitionId: any
  ) {
    const res = await request(app)
      .delete(`/api/competitions/${competitionId}`)

    expect([204, 404]).toContain(res.status)
  },
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * CHAMPIONSHIPS TEST CASES (Read-only)
 * ═══════════════════════════════════════════════════════════════════
 */

export const championshipTestCases = {
  async testListChampionships(app: express.Application) {
    const res = await request(app)
      .get('/api/championships')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
  },

  async testGetChampionshipById(
    app: express.Application,
    championshipId: any
  ) {
    const res = await request(app)
      .get(`/api/championships/${championshipId}`)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('ChampionshipId')
    } else {
      expect(res.status).toBe(404)
    }
  },
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * EVENTS TEST CASES
 * ═══════════════════════════════════════════════════════════════════
 */

export const eventTestCases = {
  async testCreateEventSuccess(
    app: express.Application,
    eventData: any
  ) {
    const res = await request(app)
      .post('/api/events')
      .send(eventData)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('EventId')
  },

  async testListEvents(app: express.Application) {
    const res = await request(app)
      .get('/api/events')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
  },

  async testGetEventById(app: express.Application, eventId: any) {
    const res = await request(app)
      .get(`/api/events/${eventId}`)

    if (res.status === 200) {
      expect(res.body).toHaveProperty('EventId')
    } else {
      expect(res.status).toBe(404)
    }
  },
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * REGISTRATIONS TEST CASES
 * ═══════════════════════════════════════════════════════════════════
 */

export const registrationTestCases = {
  async testCreateRegistrationSuccess(
    app: express.Application,
    registrationData: any
  ) {
    const res = await request(app)
      .post('/api/registrations')
      .send(registrationData)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
  },

  async testListRegistrations(app: express.Application) {
    const res = await request(app)
      .get('/api/registrations')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
  },

  async testGetRegistrationById(
    app: express.Application,
    registrationId: any
  ) {
    const res = await request(app)
      .get(`/api/registrations/${registrationId}`)

    expect([200, 404]).toContain(res.status)
  },

  async testDeleteRegistration(
    app: express.Application,
    registrationId: any
  ) {
    const res = await request(app)
      .delete(`/api/registrations/${registrationId}`)

    expect([204, 404]).toContain(res.status)
  },
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * DISCIPLINES TEST CASES
 * ═══════════════════════════════════════════════════════════════════
 */

export const disciplineTestCases = {
  async testListDisciplines(app: express.Application) {
    const res = await request(app)
      .get('/api/disciplines')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('items')
  },

  async testCreateDisciplineSuccess(
    app: express.Application,
    disciplineData: any
  ) {
    const res = await request(app)
      .post('/api/disciplines')
      .send(disciplineData)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
  },

  async testGetDisciplineById(
    app: express.Application,
    disciplineId: any
  ) {
    const res = await request(app)
      .get(`/api/disciplines/${disciplineId}`)

    expect([200, 404]).toContain(res.status)
  },
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * MASTER TEST CASES - Agrupa todos los casos para fácil referencia
 * ═══════════════════════════════════════════════════════════════════
 */

export const allTestCases = {
  users: userTestCases,
  clubs: clubTestCases,
  races: raceTestCases,
  competitions: competitionTestCases,
  championships: championshipTestCases,
  events: eventTestCases,
  registrations: registrationTestCases,
  disciplines: disciplineTestCases,

  // Aún por completar:
  // formats: formatTestCases,
  // surfaces: surfaceTestCases,
  // divisions: divisionTestCases,
  // roles: roleTestCases,
  // roleEntities: roleEntityTestCases,
  // userEntities: userEntityTestCases,
  // raceResults: raceResultTestCases,
  // entityLinks: entityLinkTestCases,
  // specialities: specialityTestCases,
  // drivingEnvironments: drivingEnvironmentTestCases,
}

/**
 * Helper: Hook común para setup de datos
 * Uso en beforeEach
 */
export async function setupTestData(
  app: express.Application,
  testDataSets: any
) {
  // Crear datos base que todos los tests pueden utilizar
  const user = await request(app)
    .post('/api/users')
    .send(testDataSets.users.valid)

  const club = await request(app)
    .post('/api/clubs')
    .send(testDataSets.clubs.valid)

  return {
    userId: user.body.data?.UserId,
    clubId: club.body.data?.ClubId,
  }
}
```

