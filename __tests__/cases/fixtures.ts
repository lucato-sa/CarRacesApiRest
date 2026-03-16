

/**
 * 📝 EJEMPLOS ESPECÍFICOS - __tests__/cases/fixtures.ts
 * Datos de prueba centralizados para ApiCarRaces (16 entidades)
 */

// Importar tipos de repositorios
import { User } from '../../src/users/repository/user.repository';
import { Club } from '../../src/clubs/repository/club.repository';
import { Race } from '../../src/races/repository/race.repository';
import { Competition } from '../../src/competitions/repository/competition.repository';
import { Championship } from '../../src/championships/repository/championship.repository';
import { Event } from '../../src/events/repository/event.repository';
import { Registration } from '../../src/registrations/repository/registration.repository';
import { Discipline } from '../../src/disciplines/repository/discipline.repository';
import { Format } from '../../src/formats/repository/format.repository';
import { Surface } from '../../src/surfaces/repository/surface.repository';
import { Division } from '../../src/divisions/repository/division.repository';
import { Role } from '../../src/roles/repository/role.repository';
import { RolEntity } from '../../src/rolentities/repository/rolentity.repository';
import { UserEntity } from '../../src/userentities/repository/userentity.repository';
import { RaceResult } from '../../src/raceresults/repository/raceresult.repository';
import { EntityLink } from '../../src/entitylinks/repository/entitylink.repository';
import { Speciality } from '../../src/specialities/repository/speciality.repository';
import { DrivingEnvironment } from '../../src/drivingenviroments/repository/drivingenvironment.repository';

export const validUser: Partial<User> = {
  Nick: 'piloto_juan',
  Nombre: 'Juan',
  Apellidos: 'Pérez García',
  Email: 'juan.perez@example.com',
  Direccion: 'Calle Principal 123',
  Localidad: 'Madrid',
  Provincia: 'Madrid',
  Pais: 'España',
}

export const secondUser: Partial<User> = {
  Nick: 'piloto_maria',
  Nombre: 'María',
  Apellidos: 'López Martínez',
  Email: 'maria.lopez@example.com',
  Direccion: 'Avenida Secundaria 456',
  Localidad: 'Barcelona',
  Provincia: 'Barcelona',
  Pais: 'España',
}

export const incompleteUser = {
  Nick: 'piloto_test',
  Nombre: 'Test',
  // Falta: Apellidos, Email, Direccion, etc.
}

export const invalidEmailUser = {
  ...validUser,
  Email: 'invalid-email',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 2: CLUBS
 * ═══════════════════════════════════════════════════════════════
 */

export const validClub = {
  ClubName: 'Club de Carreras Madrid',
  Descripcion: 'Club oficial de carreras en Madrid',
  Ubicacion: 'Madrid, España',
  FundacionAnio: 2010,
}

export const secondClub = {
  ClubName: 'Circuit Barcelona',
  Descripcion: 'Club especializado en circuitos',
  Ubicacion: 'Barcelona, España',
  FundacionAnio: 2005,
}

export const incompleteClub = {
  ClubName: 'Incomplete Club',
  // Falta Descripcion
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 3: RACES (Carreras)
 * ═══════════════════════════════════════════════════════════════
 */

export const validRace = {
  RaceName: 'Grand Prix Madrid 2024',
  Descripcion: 'Carrera principal de la temporada',
  FechaInicio: '2024-06-15T10:00:00Z',
  FechaFin: '2024-06-15T14:00:00Z',
  Ubicacion: 'Circuito de Madrid',
  ChampionshipId: 1,
  DisciplineId: 1,
}

export const secondRace = {
  RaceName: 'Qualifying Round Barcelona',
  Descripcion: 'Ronda de clasificación en Barcelona',
  FechaInicio: '2024-06-22T09:00:00Z',
  FechaFin: '2024-06-22T13:00:00Z',
  Ubicacion: 'Circuito de Barcelona',
  ChampionshipId: 1,
  DisciplineId: 1,
}

export const incompleteRace = {
  RaceName: 'Incomplete Race',
  // Falta FechaInicio, FechaFin, etc.
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 4: COMPETITIONS (Competiciones)
 * ═══════════════════════════════════════════════════════════════
 */

export const validCompetition = {
  Descripcion: 'Campeonato Nacional de Carreras 2024',
  FechaInicio: '2024-01-01',
  FechaFin: '2024-12-31',
  MaxParticipantes: 100,
  ClubId: 1,
}

export const secondCompetition = {
  Descripcion: 'Copa Regional de Speed',
  FechaInicio: '2024-03-01',
  FechaFin: '2024-09-30',
  MaxParticipantes: 50,
  ClubId: 2,
}

export const incompleteCompetition = {
  Descripcion: 'Incomplete Competition',
  // Falta FechaInicio, FechaFin
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 5: CHAMPIONSHIPS (Campeonatos)
 * ═══════════════════════════════════════════════════════════════
 */

export const validChampionship = {
  Descripcion: 'Campeonato Oficial 2024',
  DrivingEnviromentId: 1,
  SpecialityId: 1,
  DisciplineId: 1,
  DivisionId: 1,
  ClubId: 1,
}

export const secondChampionship = {
  Descripcion: 'Liga de Aficionados',
  DrivingEnviromentId: 1,
  SpecialityId: 2,
  DisciplineId: 2,
  DivisionId: 2,
  ClubId: 2,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 6: EVENTS (Eventos)
 * ═══════════════════════════════════════════════════════════════
 */

export const validEvent = {
  EventName: 'Event Inauguración 2024',
  Descripcion: 'Evento de inauguración de temporada',
  FechaEvento: '2024-01-15',
  Ubicacion: 'Circuito Oficial',
  CompetitionId: 1,
  ChampionshipId: 1,
}

export const secondEvent = {
  EventName: 'Event Final Season',
  Descripcion: 'Evento de cierre de temporada',
  FechaEvento: '2024-12-20',
  Ubicacion: 'Circuito Nacional',
  CompetitionId: 1,
  ChampionshipId: 1,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 7: REGISTRATIONS (Registros/Inscripciones)
 * ═══════════════════════════════════════════════════════════════
 */

export const validRegistration = {
  UserId: 1,
  CompetitionId: 1,
  EventId: 1,
  FechaRegistro: new Date().toISOString(),
  Estado: 'ACTIVO',
}

export const secondRegistration = {
  UserId: 2,
  CompetitionId: 1,
  EventId: 1,
  FechaRegistro: new Date().toISOString(),
  Estado: 'ACTIVO',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 8: DISCIPLINES (Disciplinas)
 * ═══════════════════════════════════════════════════════════════
 */

export const validDiscipline = {
  Alias: 'RALLY',
  Descripcion: 'Rally (Carrera en carreteras)',
  SpecialityId: 1,
  FormatId: 1,
  SurfaceId: 1,
  default: false,
}

export const secondDiscipline = {
  Alias: 'CIRCUIT',
  Descripcion: 'Circuito (Carrera en circuito cerrado)',
  SpecialityId: 1,
  FormatId: 2,
  SurfaceId: 2,
  default: false,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 9: FORMATS (Formatos)
 * ═══════════════════════════════════════════════════════════════
 */

export const validFormat = {
  Descripcion: 'Formato de carrera - 2 mangas',
  default: false,
}

export const secondFormat = {
  Descripcion: 'Formato de carrera - Final única',
  default: true,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 10: SURFACES (Superficies)
 * ═══════════════════════════════════════════════════════════════
 */

export const validSurface = {
  Descripcion: 'Asfalto',
  default: true,
}

export const secondSurface = {
  Descripcion: 'Tierra/Gravilla',
  default: false,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 11: DIVISIONS (Divisiones)
 * ═══════════════════════════════════════════════════════════════
 */

export const validDivision = {
  Descripcion: 'División Junior',
  DisciplineId: 1,
  ClubId: 1,
  default: false,
}

export const secondDivision = {
  Descripcion: 'División Senior',
  DisciplineId: 1,
  ClubId: 1,
  default: true,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 12: ROLES
 * ═══════════════════════════════════════════════════════════════
 */

export const validRole = {
  RoleId: 1,
  RoleName: 'PILOTO',
  Descripcion: 'Piloto de carrera',
}

export const secondRole = {
  RoleId: 2,
  RoleName: 'MECANICO',
  Descripcion: 'Mecánico de equipo',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 13: ROLENTITIES (Rol-Entidades)
 * ═══════════════════════════════════════════════════════════════
 */

export const validRolEntity = {
  RoleId: 1,
  EntityType: 'USER',
  EntityId: 1,
}

export const secondRolEntity = {
  RoleId: 2,
  EntityType: 'CLUB',
  EntityId: 1,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 14: USERENTITIES (Usuario-Entidades)
 * ═══════════════════════════════════════════════════════════════
 */

export const validUserEntity = {
  UserId: 1,
  EntityType: 'CLUB',
  EntityId: 1,
  Rol: 'MIEMBRO',
}

export const secondUserEntity = {
  UserId: 2,
  EntityType: 'COMPETITION',
  EntityId: 1,
  Rol: 'PARTICIPANTE',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 15: RACERESULTS (Resultados de Carrera)
 * ═══════════════════════════════════════════════════════════════
 */

export const validRaceResult = {
  RaceId: 1,
  UserId: 1,
  Posicion: 1,
  Tiempo: 120.45,
  Puntos: 10,
  Estado: 'FINALIZADO',
}

export const secondRaceResult = {
  RaceId: 1,
  UserId: 2,
  Posicion: 2,
  Tiempo: 121.30,
  Puntos: 8,
  Estado: 'FINALIZADO',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 16: ENTITYLINKS (Enlaces de Entidades)
 * ═══════════════════════════════════════════════════════════════
 */

export const validEntityLink = {
  SourceEntity: 'RACE',
  SourceId: 1,
  TargetEntity: 'CHAMPIONSHIP',
  TargetId: 1,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 17: SPECIALITIES (Especialidades)
 * ═══════════════════════════════════════════════════════════════
 */

export const validSpeciality = {
  Alias: 'ROAD_RACING',
  Descripcion: 'Carreras en carretera',
  default: false,
}

export const secondSpeciality = {
  Alias: 'CIRCUIT_RACING',
  Descripcion: 'Carreras en circuito',
  default: true,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 18: DRIVINGENVIRONMENTS (Ambientes de Conducción)
 * ═══════════════════════════════════════════════════════════════
 */

export const validDrivingEnvironment = {
  Alias: 'COCHES_TURISMO',
  Descripcion: 'Conducción de turismos',
  default: true,
}

export const secondDrivingEnvironment = {
  Alias: 'MOTOS',
  Descripcion: 'Conducción de motocicletas',
  default: false,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * DATASET COMPLETO - Reutilizable
 * ═══════════════════════════════════════════════════════════════
 */

export const testDataSets = {
  users: {
    valid: validUser,
    second: secondUser,
    incomplete: incompleteUser,
    invalidEmail: invalidEmailUser,
  },
  clubs: {
    valid: validClub,
    second: secondClub,
    incomplete: incompleteClub,
  },
  races: {
    valid: validRace,
    second: secondRace,
    incomplete: incompleteRace,
  },
  competitions: {
    valid: validCompetition,
    second: secondCompetition,
    incomplete: incompleteCompetition,
  },
  championships: {
    valid: validChampionship,
    second: secondChampionship,
  },
  events: {
    valid: validEvent,
    second: secondEvent,
  },
  registrations: {
    valid: validRegistration,
    second: secondRegistration,
  },
  disciplines: {
    valid: validDiscipline,
    second: secondDiscipline,
  },
  formats: {
    valid: validFormat,
    second: secondFormat,
  },
  surfaces: {
    valid: validSurface,
    second: secondSurface,
  },
  divisions: {
    valid: validDivision,
    second: secondDivision,
  },
  roles: {
    valid: validRole,
    second: secondRole,
  },
  rolEntities: {
    valid: validRolEntity,
    second: secondRolEntity,
  },
  userEntities: {
    valid: validUserEntity,
    second: secondUserEntity,
  },
  raceResults: {
    valid: validRaceResult,
    second: secondRaceResult,
  },
  entityLinks: {
    valid: validEntityLink,
  },
  specialities: {
    valid: validSpeciality,
    second: secondSpeciality,
  },
  drivingEnvironments: {
    valid: validDrivingEnvironment,
    second: secondDrivingEnvironment,
  },
}

/**
 * Helper: Crear datos con sobrescrituras
 * Uso: createTestData('users', { Nick: 'custom-nick' })
 */
export function createTestData<T extends keyof typeof testDataSets>(
  entity: T,
  overrides?: Partial<(typeof testDataSets)[T]['valid']>
): (typeof testDataSets)[T]['valid'] {
  return {
    ...testDataSets[entity].valid,
    ...overrides,
  }
}


