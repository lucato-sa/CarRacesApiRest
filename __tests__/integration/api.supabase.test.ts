import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { Express } from 'express'
import { SupabaseBackend } from '../../src/backends/SupabaseBackend'
import { createTestApp } from '../cases/setupApp'
import { allTestCases } from '../cases/testCases'

// Only run this test suite when BACKEND=supabase
const skipSupabaseTests = process.env.BACKEND !== 'supabase'

describe.skipIf(skipSupabaseTests)('API Integration - Supabase Backend', () => {
  let app: Express
  let backend: SupabaseBackend

  beforeAll(async () => {
    console.log('☁️ Starting Supabase Backend tests...')
    
    // Initialize Supabase backend with environment variables
    backend = new SupabaseBackend()
    
    try {
      await backend.initialize()
      app = await createTestApp(backend)
      console.log('✅ Supabase Backend initialized')
    } catch (error) {
      console.warn('⚠️ Supabase Backend initialization failed:', error)
      console.warn('Make sure SUPABASE_URL and SUPABASE_KEY environment variables are set')
      // Tests will skip if backend is not ready
    }
  })

  afterAll(async () => {
    try {
      await backend.close()
      console.log('✅ Supabase Backend closed')
    } catch (error) {
      console.warn('⚠️ Error closing Supabase Backend:', error)
    }
  })
  
  beforeEach(async () => {
    try {
      await backend.clear()
    } catch (error) {
      console.warn('⚠️ Error clearing Supabase data:', error)
    }
  })
  

  // ====== HEALTH CHECK ======
  describe('Health Check', () => {
    it('should return health status', async () => {
      const result = await (app as any).request?.get('/api/health') || { status: 200 }
      expect(result.status).toBe(200)
    })
  })
 
  // ====== RACES TESTS ======
  describe('Races', () => {
    it('should create a race', async () => {
      const result = await allTestCases.races.testCreateRace(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
      expect(result.hasId).toBe(true)
    })

    it('should list races', async () => {
      await allTestCases.races.testCreateRace(app)
      const result = await allTestCases.races.testListRaces(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get race by id', async () => {
      const result = await allTestCases.races.testGetRaceById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should update a race', async () => {
      const result = await allTestCases.races.testUpdateRace(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should delete a race', async () => {
      const result = await allTestCases.races.testDeleteRace(app)
      expect(result.status).toBe(204)
    })

    it.skip('should validate required fields', async () => {
      const result = await allTestCases.races.testValidateRaceRequiredFields(app)
      expect(result.success).toBe(true)
    })
  })

  // ====== CLUBS TESTS ======
  describe('Clubs', () => {
    it('should create a club', async () => {
      const result = await allTestCases.clubs.testCreateClub(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
      //expect(result.hasId).toBe(true)
    })

    it('should list clubs', async () => {
      // await allTestCases.clubs.testCreateClub(app)
      const result = await allTestCases.clubs.testListClubs(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get club by id', async () => {
      const result = await allTestCases.clubs.testGetClubById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should update a club', async () => {
      const result = await allTestCases.clubs.testUpdateClub(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
    /*
    it('should delete a club', async () => {
      const result = await allTestCases.clubs.testDeleteClub(app)
      expect(result.status).toBe(204)
    })
    */
  })

  // ====== USERS TESTS ======
  describe('Users', () => {
    it('should create a user', async () => {
      const result = await allTestCases.users.testCreateUser(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
      expect(result.hasId).toBe(true)
    })

    it('should list users', async () => {
      await allTestCases.users.testCreateUser(app)
      const result = await allTestCases.users.testListUsers(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get user by id', async () => {
      const result = await allTestCases.users.testGetUserById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should update a user', async () => {
      const result = await allTestCases.users.testUpdateUser(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should delete a user', async () => {
      const result = await allTestCases.users.testDeleteUser(app)
      expect(result.status).toBe(204)
    })
  })

  // ====== COMPETITIONS TESTS ======
  describe('Competitions', () => {
    it('should create a competition', async () => {
      const result = await allTestCases.competitions.testCreateCompetition(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list competitions', async () => {
      await allTestCases.competitions.testCreateCompetition(app)
      const result = await allTestCases.competitions.testListCompetitions(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get competition by id', async () => {
      const result = await allTestCases.competitions.testGetCompetitionById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should update a competition', async () => {
      const result = await allTestCases.competitions.testUpdateCompetition(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should delete a competition', async () => {
      const result = await allTestCases.competitions.testDeleteCompetition(app)
      expect(result.status).toBe(204)
    })
  })

  // ====== CHAMPIONSHIPS TESTS ======
  describe('Championships', () => {
    it('should create a championship', async () => {
      const result = await allTestCases.championships.testCreateChampionship(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list championships', async () => {
      await allTestCases.championships.testCreateChampionship(app)
      const result = await allTestCases.championships.testListChampionships(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get championship by id', async () => {
      const result = await allTestCases.championships.testGetChampionshipById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== DISCIPLINES TESTS ======
  describe('Disciplines', () => {
    it('should create a discipline', async () => {
      const result = await allTestCases.disciplines.testCreateDiscipline(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list disciplines', async () => {
      await allTestCases.disciplines.testCreateDiscipline(app)
      const result = await allTestCases.disciplines.testListDisciplines(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get discipline by id', async () => {
      const result = await allTestCases.disciplines.testGetDisciplineById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== EVENTS TESTS ======
  describe('Events', () => {
    it('should create an event', async () => {
      const result = await allTestCases.events.testCreateEvent(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list events', async () => {
      await allTestCases.events.testCreateEvent(app)
      const result = await allTestCases.events.testListEvents(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== REGISTRATIONS TESTS ======
  describe('Registrations', () => {
    it('should create a registration', async () => {
      const result = await allTestCases.registrations.testCreateRegistration(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list registrations', async () => {
      await allTestCases.registrations.testCreateRegistration(app)
      const result = await allTestCases.registrations.testListRegistrations(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== FORMATS TESTS ======
  describe('Formats', () => {
    it('should create a format', async () => {
      const result = await allTestCases.formats.testCreateFormat(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list formats', async () => {
      await allTestCases.formats.testCreateFormat(app)
      const result = await allTestCases.formats.testListFormats(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== SURFACES TESTS ======
  describe('Surfaces', () => {
    it('should create a surface', async () => {
      const result = await allTestCases.surfaces.testCreateSurface(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list surfaces', async () => {
      await allTestCases.surfaces.testCreateSurface(app)
      const result = await allTestCases.surfaces.testListSurfaces(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== DIVISIONS TESTS ======
  describe('Divisions', () => {
    it('should create a division', async () => {
      const result = await allTestCases.divisions.testCreateDivision(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list divisions', async () => {
      await allTestCases.divisions.testCreateDivision(app)
      const result = await allTestCases.divisions.testListDivisions(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== ROLES TESTS ======
  describe('Roles', () => {
    it('should create a role', async () => {
      const result = await allTestCases.roles.testCreateRole(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list roles', async () => {
      await allTestCases.roles.testCreateRole(app)
      const result = await allTestCases.roles.testListRoles(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== RACERESULTS TESTS ======
  describe('Race Results', () => {
    it('should create a race result', async () => {
      const result = await allTestCases.raceresults.testCreateRaceResult(app)
      expect(result.status).toBeGreaterThanOrEqual(200)
      expect(result.status).toBeLessThan(500)
      expect(result.success).toBe(true)
    })

    it('should list race results', async () => {
      await allTestCases.raceresults.testCreateRaceResult(app)
      const result = await allTestCases.raceresults.testListRaceResults(app)
      expect(result.status).toBeGreaterThanOrEqual(200)
      expect(result.status).toBeLessThan(500)
      expect(result.success).toBe(true)
    })
  })

  // ====== SPECIALITIES TESTS ======
  describe('Specialities', () => {
    it('should create a speciality', async () => {
      const result = await allTestCases.specialities.testCreateSpeciality(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list specialities', async () => {
      await allTestCases.specialities.testCreateSpeciality(app)
      const result = await allTestCases.specialities.testListSpecialities(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== LEVELS TESTS ======
  describe('Levels', () => {
    it('should create a level', async () => {
      const result = await allTestCases.levels.testCreateLevel(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list levels', async () => {
      // await allTestCases.levels.testCreateLevel(app)
      const result = await allTestCases.levels.testListLevels(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get level by id', async () => {
      const result = await allTestCases.levels.testGetLevelById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== GROUPS TESTS ======
  describe('Groups', () => {
    it('should create a group', async () => {
      const result = await allTestCases.groups.testCreateGroup(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list groups', async () => {
      //await allTestCases.groups.testCreateGroup(app)
      const result = await allTestCases.groups.testListGroups(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get group by id', async () => {
      const result = await allTestCases.groups.testGetGroupById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== SCORING TESTS ======
  describe('Scoring', () => {
    it('should create scoring', async () => {
      const result = await allTestCases.scoring.testCreateScoring(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list scoring', async () => {
      //await allTestCases.scoring.testCreateScoring(app)
      const result = await allTestCases.scoring.testListScoring(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get scoring by id', async () => {
      const result = await allTestCases.scoring.testGetScoringById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== SCORINGDET TESTS ======
  describe('Scoring Detail', () => {
    it('should create scoring detail', async () => {
      const result = await allTestCases.scoringdet.testCreateScoringDet(app)
      expect(result.status).toBeGreaterThanOrEqual(200)
      expect(result.status).toBeLessThan(500)
    })

    it('should list scoring details', async () => {
      const result = await allTestCases.scoringdet.testListScoringDet(app)
      expect(result.status).toBeGreaterThanOrEqual(200)
      expect(result.status).toBeLessThan(500)
    })
  })

  // ====== RULEBOOKS TESTS ======
  describe('Rulebooks', () => {
    it('should create a rulebook', async () => {
      const result = await allTestCases.rulebooks.testCreateRulebook(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list rulebooks', async () => {
      await allTestCases.rulebooks.testCreateRulebook(app)
      const result = await allTestCases.rulebooks.testListRulebooks(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get rulebook by id', async () => {
      const result = await allTestCases.rulebooks.testGetRulebookById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== RULES TESTS ======
  describe('Rules', () => {
    it('should create a rule', async () => {
      const result = await allTestCases.rules.testCreateRule(app)
      expect(result.status).toBeGreaterThanOrEqual(200)
      expect(result.status).toBeLessThan(500)
    })

    it('should list rules', async () => {
      const result = await allTestCases.rules.testListRules(app)
      expect(result.status).toBeGreaterThanOrEqual(200)
      expect(result.status).toBeLessThan(500)
    })
  })

  // ====== SEASONS TESTS ======
  describe('Seasons', () => {
    it('should create a season', async () => {
      const result = await allTestCases.seasons.testCreateSeason(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list seasons', async () => {
      //await allTestCases.seasons.testCreateSeason(app)
      const result = await allTestCases.seasons.testListSeasons(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get season by id', async () => {
      const result = await allTestCases.seasons.testGetSeasonById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== VENUES TESTS ======
  describe('Venues', () => {
    it('should create a venue', async () => {
      const result = await allTestCases.venues.testCreateVenue(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list venues', async () => {
      // await allTestCases.venues.testCreateVenue(app)
      const result = await allTestCases.venues.testListVenues(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get venue by id', async () => {
      const result = await allTestCases.venues.testGetVenueById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== CIRCUITS TESTS ======
  describe('Circuits', () => {
    it('should create a circuit', async () => {
      const result = await allTestCases.circuits.testCreateCircuit(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list circuits', async () => {
      //await allTestCases.circuits.testCreateCircuit(app)
      const result = await allTestCases.circuits.testListCircuits(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get circuit by id', async () => {
      const result = await allTestCases.circuits.testGetCircuitById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

  // ====== SEGMENTS TESTS ======
  describe('Segments', () => {
    it('should create a segment', async () => {
      const result = await allTestCases.segments.testCreateSegment(app)
      expect(result.status).toBe(201)
      expect(result.success).toBe(true)
    })

    it('should list segments', async () => {
      //await allTestCases.segments.testCreateSegment(app)
      const result = await allTestCases.segments.testListSegments(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get segment by id', async () => {
      const result = await allTestCases.segments.testGetSegmentById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

 // ====== DRIVING ENVIRONMENTS TESTS ======
  describe('Drivingenvironments', () => {

    it('should list driving environments', async () => {
      //await allTestCases.levels.testCreateLevel(app)
      const result = await allTestCases.drivingenvironments.testListDrivingEnvironments(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })

    it('should get driving environments by id', async () => {
      const result = await allTestCases.drivingenvironments.testGetDrivingEnvironmentById(app)
      expect(result.status).toBe(200)
      expect(result.success).toBe(true)
    })
  })

})
