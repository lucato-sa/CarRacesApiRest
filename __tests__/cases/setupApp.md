# 📝 EJEMPLOS ESPECÍFICOS - __tests__/cases/setupApp.ts
## Factory de Express App para ApiCarRaces

```typescript
import express, { Application } from 'express'
import { loggerMiddleware } from '../../src/middleware/logger.middleware'

/**
 * Interfaces base para los repositorios
 * Estos son wrappers que unifican diferentes backends
 */

export interface ITestClubRepository {
  saveClub(data: any): Promise<any>
  getAllClubs(filters?: any): Promise<any[]>
  getClubById(id: any): Promise<any>
  updateClub(id: any, data: any): Promise<any>
  deleteClub(id: any): Promise<void>
  countClubs(): Promise<number>
}

export interface ITestUserRepository {
  saveUser(data: any): Promise<any>
  getAllUsers(filters?: any): Promise<any[]>
  getUserById(id: any): Promise<any>
  updateUser(id: any, data: any): Promise<any>
  deleteUser(id: any): Promise<void>
  countUsers(): Promise<number>
}

export interface ITestRaceRepository {
  saveRace(data: any): Promise<any>
  getAllRaces(filters?: any): Promise<any[]>
  getRaceById(id: any): Promise<any>
  updateRace(id: any, data: any): Promise<any>
  deleteRace(id: any): Promise<void>
  countRaces(): Promise<number>
}

export interface ITestCompetitionRepository {
  saveCompetition(data: any): Promise<any>
  getAllCompetitions(filters?: any): Promise<any[]>
  getCompetitionById(id: any): Promise<any>
  updateCompetition(id: any, data: any): Promise<any>
  deleteCompetition(id: any): Promise<void>
  countCompetitions(): Promise<number>
}

export interface ITestChampionshipRepository {
  saveChampionship(data: any): Promise<any>
  getAllChampionships(filters?: any): Promise<any[]>
  getChampionshipById(id: any): Promise<any>
  updateChampionship(id: any, data: any): Promise<any>
  deleteChampionship(id: any): Promise<void>
}

export interface ITestEventRepository {
  saveEvent(data: any): Promise<any>
  getAllEvents(filters?: any): Promise<any[]>
  getEventById(id: any): Promise<any>
  updateEvent(id: any, data: any): Promise<any>
  deleteEvent(id: any): Promise<void>
}

export interface ITestRegistrationRepository {
  saveRegistration(data: any): Promise<any>
  getAllRegistrations(filters?: any): Promise<any[]>
  getRegistrationById(id: any): Promise<any>
  deleteRegistration(id: any): Promise<void>
}

export interface ITestDisciplineRepository {
  saveDiscipline(data: any): Promise<any>
  getAllDisciplines(filters?: any): Promise<any[]>
  getDisciplineById(id: any): Promise<any>
  updateDiscipline(id: any, data: any): Promise<any>
}

export interface ITestFormatRepository {
  saveFormat(data: any): Promise<any>
  getAllFormats(): Promise<any[]>
  getFormatById(id: any): Promise<any>
  updateFormat(id: any, data: any): Promise<any>
}

export interface ITestSurfaceRepository {
  saveSurface(data: any): Promise<any>
  getAllSurfaces(): Promise<any[]>
  getSurfaceById(id: any): Promise<any>
  updateSurface(id: any, data: any): Promise<any>
}

export interface ITestDivisionRepository {
  saveDivision(data: any): Promise<any>
  getAllDivisions(filters?: any): Promise<any[]>
  getDivisionById(id: any): Promise<any>
  updateDivision(id: any, data: any): Promise<any>
}

export interface ITestRoleRepository {
  getAllRoles(): Promise<any[]>
  getRoleById(id: any): Promise<any>
}

export interface ITestRoleEntityRepository {
  saveRoleEntity(data: any): Promise<any>
  getAllRoleEntities(): Promise<any[]>
}

export interface ITestUserEntityRepository {
  saveUserEntity(data: any): Promise<any>
  getAllUserEntities(): Promise<any[]>
}

export interface ITestRaceResultRepository {
  saveRaceResult(data: any): Promise<any>
  getAllRaceResults(raceId?: any): Promise<any[]>
  updateRaceResult(id: any, data: any): Promise<any>
}

export interface ITestEntityLinkRepository {
  getAllEntityLinks(): Promise<any[]>
}

export interface ITestSpecialityRepository {
  getAllSpecialities(): Promise<any[]>
  getSpecialityById(id: any): Promise<any>
  saveSpeciality(data: any): Promise<any>
}

export interface ITestDrivingEnvironmentRepository {
  saveDrivingEnvironment(data: any): Promise<any>
  getAllDrivingEnvironments(): Promise<any[]>
  getDrivingEnvironmentById(id: any): Promise<any>
  updateDrivingEnvironment(id: any, data: any): Promise<any>
}

/**
 * Paquete de todos los repositorios para inyección
 */
export interface IRepositories {
  clubRepository: ITestClubRepository
  userRepository: ITestUserRepository
  raceRepository: ITestRaceRepository
  competitionRepository: ITestCompetitionRepository
  championshipRepository: ITestChampionshipRepository
  eventRepository: ITestEventRepository
  registrationRepository: ITestRegistrationRepository
  disciplineRepository: ITestDisciplineRepository
  formatRepository: ITestFormatRepository
  surfaceRepository: ITestSurfaceRepository
  divisionRepository: ITestDivisionRepository
  roleRepository: ITestRoleRepository
  roleEntityRepository: ITestRoleEntityRepository
  userEntityRepository: ITestUserEntityRepository
  raceResultRepository: ITestRaceResultRepository
  entityLinkRepository: ITestEntityLinkRepository
  specialityRepository: ITestSpecialityRepository
  drivingEnvironmentRepository: ITestDrivingEnvironmentRepository
}

/**
 * Factory PRINCIPAL: Crear la aplicación Express con TODAS las rutas
 * 
 * Inyecta los repositorios y registra todos los endpoints
 */
export function createTestApp(repositories: IRepositories): Application {
  const app = express()
  app.use(express.json())
  app.use(loggerMiddleware)

  // ════════════════════════════════════════════════════════════
  // ROUTES: USERS  (GET, POST, GET/:id, PUT/:id, DELETE/:id)
  // ════════════════════════════════════════════════════════════
  
  app.get('/api/users', async (req, res) => {
    try {
      const { page = 1, pageSize = 20, q, nick } = req.query
      const filters = { ...(nick && { nick }), ...(q && { q }) }
      
      const users = await repositories.userRepository.getAllUsers(filters)
      const total = await repositories.userRepository.countUsers()
      const pageNum = Math.max(1, parseInt(page as string) || 1)
      const pageSizeNum = Math.max(1, parseInt(pageSize as string) || 20)
      const items = users.slice(
        (pageNum - 1) * pageSizeNum,
        pageNum * pageSizeNum
      )

      res.json({ total, page: pageNum, pageSize: pageSizeNum, items })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post('/api/users', async (req, res) => {
    try {
      const { Nick, Nombre, Apellidos, Email } = req.body
      const errors = []

      if (!Nick) errors.push('Nick is required')
      if (!Nombre) errors.push('Nombre is required')
      if (!Apellidos) errors.push('Apellidos is required')
      if (!Email) errors.push('Email is required')
      if (Email && !Email.includes('@')) errors.push('Invalid email format')

      if (errors.length > 0) {
        return res.status(400).json({ success: false, errors })
      }

      const user = await repositories.userRepository.saveUser(req.body)
      res.status(201).json({ success: true, data: user })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  })

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await repositories.userRepository.getUserById(req.params.id)
      if (!user) return res.status(404).json({ error: 'User not found' })
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.put('/api/users/:id', async (req, res) => {
    try {
      const user = await repositories.userRepository.updateUser(
        req.params.id,
        req.body
      )
      if (!user) return res.status(404).json({ error: 'User not found' })
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.delete('/api/users/:id', async (req, res) => {
    try {
      await repositories.userRepository.deleteUser(req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // ════════════════════════════════════════════════════════════
  // ROUTES: CLUBS
  // ════════════════════════════════════════════════════════════

  app.get('/api/clubs', async (req, res) => {
    try {
      const { page = 1, pageSize = 20 } = req.query
      const clubs = await repositories.clubRepository.getAllClubs()
      const total = await repositories.clubRepository.countClubs()
      const pageNum = Math.max(1, parseInt(page as string) || 1)
      const pageSizeNum = Math.max(1, parseInt(pageSize as string) || 20)
      const items = clubs.slice(
        (pageNum - 1) * pageSizeNum,
        pageNum * pageSizeNum
      )

      res.json({ total, page: pageNum, pageSize: pageSizeNum, items })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post('/api/clubs', async (req, res) => {
    try {
      const { ClubName } = req.body
      if (!ClubName) {
        return res.status(400).json({ success: false, error: 'ClubName is required' })
      }

      const club = await repositories.clubRepository.saveClub(req.body)
      res.status(201).json({ success: true, data: club })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  })

  app.get('/api/clubs/:id', async (req, res) => {
    try {
      const club = await repositories.clubRepository.getClubById(req.params.id)
      if (!club) return res.status(404).json({ error: 'Club not found' })
      res.json(club)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.put('/api/clubs/:id', async (req, res) => {
    try {
      const club = await repositories.clubRepository.updateClub(
        req.params.id,
        req.body
      )
      if (!club) return res.status(404).json({ error: 'Club not found' })
      res.json(club)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.delete('/api/clubs/:id', async (req, res) => {
    try {
      await repositories.clubRepository.deleteClub(req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // ════════════════════════════════════════════════════════════
  // ROUTES: RACES  
  // ════════════════════════════════════════════════════════════

  app.get('/api/races', async (req, res) => {
    try {
      const { page = 1, pageSize = 20, ChampionshipId } = req.query
      const filters = { ...(ChampionshipId && { ChampionshipId }) }
      const races = await repositories.raceRepository.getAllRaces(filters)
      const total = await repositories.raceRepository.countRaces()
      const pageNum = Math.max(1, parseInt(page as string) || 1)
      const pageSizeNum = Math.max(1, parseInt(pageSize as string) || 20)
      const items = races.slice(
        (pageNum - 1) * pageSizeNum,
        pageNum * pageSizeNum
      )

      res.json({ total, page: pageNum, pageSize: pageSizeNum, items })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post('/api/races', async (req, res) => {
    try {
      const { RaceName } = req.body
      if (!RaceName) {
        return res.status(400).json({ success: false, error: 'RaceName is required' })
      }

      const race = await repositories.raceRepository.saveRace(req.body)
      res.status(201).json({ success: true, data: race })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  })

  app.get('/api/races/:id', async (req, res) => {
    try {
      const race = await repositories.raceRepository.getRaceById(req.params.id)
      if (!race) return res.status(404).json({ error: 'Race not found' })
      res.json(race)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.put('/api/races/:id', async (req, res) => {
    try {
      const race = await repositories.raceRepository.updateRace(
        req.params.id,
        req.body
      )
      if (!race) return res.status(404).json({ error: 'Race not found' })
      res.json(race)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.delete('/api/races/:id', async (req, res) => {
    try {
      await repositories.raceRepository.deleteRace(req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // ════════════════════════════════════════════════════════════
  // ROUTES: COMPETITIONS
  // ════════════════════════════════════════════════════════════

  app.get('/api/competitions', async (req, res) => {
    try {
      const { page = 1, pageSize = 20 } = req.query
      const competitions =
        await repositories.competitionRepository.getAllCompetitions()
      const total = await repositories.competitionRepository.countCompetitions()
      const pageNum = Math.max(1, parseInt(page as string) || 1)
      const pageSizeNum = Math.max(1, parseInt(pageSize as string) || 20)
      const items = competitions.slice(
        (pageNum - 1) * pageSizeNum,
        pageNum * pageSizeNum
      )

      res.json({ total, page: pageNum, pageSize: pageSizeNum, items })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post('/api/competitions', async (req, res) => {
    try {
      const { Descripcion } = req.body
      if (!Descripcion) {
        return res
          .status(400)
          .json({ success: false, error: 'Descripcion is required' })
      }

      const competition = await repositories.competitionRepository.saveCompetition(
        req.body
      )
      res.status(201).json({ success: true, data: competition })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  })

  app.get('/api/competitions/:id', async (req, res) => {
    try {
      const competition =
        await repositories.competitionRepository.getCompetitionById(
          req.params.id
        )
      if (!competition)
        return res.status(404).json({ error: 'Competition not found' })
      res.json(competition)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.put('/api/competitions/:id', async (req, res) => {
    try {
      const competition =
        await repositories.competitionRepository.updateCompetition(
          req.params.id,
          req.body
        )
      if (!competition)
        return res.status(404).json({ error: 'Competition not found' })
      res.json(competition)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.delete('/api/competitions/:id', async (req, res) => {
    try {
      await repositories.competitionRepository.deleteCompetition(req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // ════════════════════════════════════════════════════════════
  // ROUTES: CHAMPIONSHIPS (solo GET)
  // ════════════════════════════════════════════════════════════

  app.get('/api/championships', async (req, res) => {
    try {
      const championships =
        await repositories.championshipRepository.getAllChampionships()
      res.json({ items: championships, count: championships.length })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.get('/api/championships/:id', async (req, res) => {
    try {
      const championship =
        await repositories.championshipRepository.getChampionshipById(
          req.params.id
        )
      if (!championship)
        return res.status(404).json({ error: 'Championship not found' })
      res.json(championship)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // ════════════════════════════════════════════════════════════
  // ROUTES: EVENTS
  // ════════════════════════════════════════════════════════════

  app.get('/api/events', async (req, res) => {
    try {
      const events = await repositories.eventRepository.getAllEvents()
      res.json({ items: events, count: events.length })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post('/api/events', async (req, res) => {
    try {
      const event = await repositories.eventRepository.saveEvent(req.body)
      res.status(201).json({ success: true, data: event })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  })

  app.get('/api/events/:id', async (req, res) => {
    try {
      const event = await repositories.eventRepository.getEventById(req.params.id)
      if (!event) return res.status(404).json({ error: 'Event not found' })
      res.json(event)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.put('/api/events/:id', async (req, res) => {
    try {
      const event = await repositories.eventRepository.updateEvent(
        req.params.id,
        req.body
      )
      if (!event) return res.status(404).json({ error: 'Event not found' })
      res.json(event)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // ════════════════════════════════════════════════════════════
  // ROUTES: REGISTRATIONS
  // ════════════════════════════════════════════════════════════

  app.get('/api/registrations', async (req, res) => {
    try {
      const registrations =
        await repositories.registrationRepository.getAllRegistrations()
      res.json({ items: registrations, count: registrations.length })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post('/api/registrations', async (req, res) => {
    try {
      const registration = await repositories.registrationRepository.saveRegistration(
        req.body
      )
      res.status(201).json({ success: true, data: registration })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  })

  app.get('/api/registrations/:id', async (req, res) => {
    try {
      const registration =
        await repositories.registrationRepository.getRegistrationById(
          req.params.id
        )
      if (!registration)
        return res.status(404).json({ error: 'Registration not found' })
      res.json(registration)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.delete('/api/registrations/:id', async (req, res) => {
    try {
      await repositories.registrationRepository.deleteRegistration(req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // ════════════════════════════════════════════════════════════
  // ROUTES: DISCIPLINES
  // ════════════════════════════════════════════════════════════

  app.get('/api/disciplines', async (req, res) => {
    try {
      const disciplines =
        await repositories.disciplineRepository.getAllDisciplines()
      res.json({ items: disciplines, count: disciplines.length })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post('/api/disciplines', async (req, res) => {
    try {
      const discipline = await repositories.disciplineRepository.saveDiscipline(
        req.body
      )
      res.status(201).json({ success: true, data: discipline })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  })

  app.get('/api/disciplines/:id', async (req, res) => {
    try {
      const discipline = await repositories.disciplineRepository.getDisciplineById(
        req.params.id
      )
      if (!discipline)
        return res.status(404).json({ error: 'Discipline not found' })
      res.json(discipline)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.put('/api/disciplines/:id', async (req, res) => {
    try {
      const discipline = await repositories.disciplineRepository.updateDiscipline(
        req.params.id,
        req.body
      )
      if (!discipline)
        return res.status(404).json({ error: 'Discipline not found' })
      res.json(discipline)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // ════════════════════════════════════════════════════════════
  // ROUTES: FORMATS, SURFACES, DIVISIONS, ROLES, etc. (Similar pattern)
  // ════════════════════════════════════════════════════════════

  // [Incluir las rutas restantes siguiendo el mismo patrón]
  // - Formats
  // - Surfaces
  // - Divisions
  // - Roles
  // - RoleEntities
  // - UserEntities
  // - RaceResults
  // - EntityLinks
  // - Specialities
  // - DrivingEnvironments

  return app
}
```

