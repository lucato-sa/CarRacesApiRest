

/**
 * 📝 EJEMPLOS ESPECÍFICOS - __tests__/cases/fixtures.ts
 * Datos de prueba centralizados para ApiCarRaces (16 entidades)
 */

// Importar tipos de modelos
import { User } from '../../src/users/models/user.model';
import { Club } from '../../src/clubs/models/club.model';
import { Race } from '../../src/races/models/race.model';
import { Competition } from '../../src/competitions/models/competition.model';
import { Championship } from '../../src/championships/models/championship.model';
import { Event } from '../../src/events/models/event.model';
import { Registration } from '../../src/registrations/models/registration.model';
import { Discipline } from '../../src/disciplines/models/discipline.model';
import { Format } from '../../src/formats/models/format.model';
import { Surface } from '../../src/surfaces/models/surface.model';
import { Division } from '../../src/divisions/models/division.model';
import { Role } from '../../src/roles/models/role.model';
import { RoleEntity } from '../../src/rolentities/models/roleentity.model';
import { UserEntity } from '../../src/userentities/models/userentity.model';
import { RaceResult } from '../../src/raceresults/models/raceresult.model';
import { EntityLink } from '../../src/entitylinks/models/entitylink.model';
import { Speciality } from '../../src/specialities/models/speciality.model';
import { DrivingEnvironment } from '../../src/drivingenviroments/models/drivingenvironment.model';

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
  Alias:'Carreras Madrid',
  TaxNombre:'Club oficial de carreras en Madrid',
  TaxNumero:'212113141',
  Descripcion:'Test Carrreras Madrid',
  FechaFundacion:'2026-02-23'
}

/*export const validClub = {
  ClubName: 'Club de Carreras Madrid',
  Descripcion: 'Club oficial de carreras en Madrid',
  Ubicacion: 'Madrid, España',
  FundacionAnio: 2010,
}
*/  

export const secondClub = {
  Alias: 'Circuit Barcelona',
  TaxNombre: 'Club especializado en circuitos',
  TaxNumero: '212113142',
  Descripcion: 'Club de Barcelona',
  FechaFundacion: '2005-06-15',
}

export const incompleteClub = {
  Alias: 'Incomplete Club',
  // Falta TaxNombre, TaxNumero, Descripcion, FechaFundacion
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 3: RACES (Carreras)
 * ═══════════════════════════════════════════════════════════════
 */

export const validRace = {
  CompetitionId: 1,
  NumRace: 1,
  Fecha: '2024-03-16',
  Hora: '10:00:00',
  Estado: 'completada',
}

export const secondRace = {
  CompetitionId: 1,
  NumRace: 2,
  Fecha: '2024-03-17',
  Hora: '14:00:00',
  Estado: 'completada',
}

export const incompleteRace = {
  CompetitionId: 1,
  // Falta NumRace y Fecha
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 4: COMPETITIONS (Competiciones)
 * ═══════════════════════════════════════════════════════════════
 */

export const validCompetition = {
  Alias: 'Competencia Nacional 2024',
  Descripcion: 'Campeonato Nacional de Carreras 2024',
}

export const secondCompetition = {
  Alias: 'Copa Regional',
  Descripcion: 'Copa Regional de Speed',
}

export const incompleteCompetition = {
  Descripcion: 'Incomplete Competition',
  // Falta Alias (requerido)
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 5: CHAMPIONSHIPS (Campeonatos)
 * ═══════════════════════════════════════════════════════════════
 */

export const validChampionship = {
  Alias: 'Campeonato Oficial 2024',
  Descripcion: 'Campeonato Oficial Temporada 2024',
  ClubId: 1,
}

export const secondChampionship = {
  Alias: 'Liga de Aficionados',
  Descripcion: 'Liga de Aficionados 2024',
  ClubId: 2,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 6: EVENTS (Eventos)
 * ═══════════════════════════════════════════════════════════════
 */

export const validEvent = {
  Descripcion: 'Evento de inauguración de temporada',
  FechaInicio: '2024-01-15',
  FechaFin: '2024-01-15',
  ClubId: 1,
}

export const secondEvent = {
  Descripcion: 'Evento de cierre de temporada',
  FechaInicio: '2024-12-20',
  FechaFin: '2024-12-20',
  ClubId: 1,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 7: REGISTRATIONS (Registros/Inscripciones)
 * ═══════════════════════════════════════════════════════════════
 */

export const validRegistration = {
  CompetitionId: 1,
  UserId: 1,
  FechaRegistro: '2024-01-10',
  Estado: 'ACTIVO',
}

export const secondRegistration = {
  CompetitionId: 1,
  UserId: 2,
  FechaRegistro: '2024-01-11',
  Estado: 'ACTIVO',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 8: DISCIPLINES (Disciplinas)
 * ═══════════════════════════════════════════════════════════════
 */

export const validDiscipline = {
  Alias: 'RALLY',
  SpecialityId: 1,
  FormatId: 1,
  SurfaceId: 1,
}

export const secondDiscipline = {
  Alias: 'CIRCUIT',
  SpecialityId: 1,
  FormatId: 2,
  SurfaceId: 2,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 9: FORMATS (Formatos)
 * ═══════════════════════════════════════════════════════════════
 */

export const validFormat = {
  Alias: 'Dos mangas',
  Descripcion: 'Formato de carrera con 2 mangas',
}

export const secondFormat = {
  Alias: 'Final única',
  Descripcion: 'Formato de carrera con final única',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 10: SURFACES (Superficies)
 * ═══════════════════════════════════════════════════════════════
 */

export const validSurface = {
  Alias: 'Asfalto',
  Descripcion: 'Superficie de asfalto',
}

export const secondSurface = {
  Alias: 'Tierra',
  Descripcion: 'Superficie de tierra/gravilla',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 11: DIVISIONS (Divisiones)
 * ═══════════════════════════════════════════════════════════════
 */

export const validDivision = {
  Alias: 'Junior',
  Descripcion: 'División Junior',
  DisciplineId: 1,
}

export const secondDivision = {
  Alias: 'Senior',
  Descripcion: 'División Senior',
  DisciplineId: 1,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 12: ROLES
 * ═══════════════════════════════════════════════════════════════
 */

export const validRole = {
  Nombre: 'PILOTO',
  Pseudonimo: 'Piloto de carrera',
}

export const secondRole = {
  Nombre: 'MECANICO',
  Pseudonimo: 'Mecánico de equipo',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 13: ROLENTITIES (Rol-Entidades)
 * ═══════════════════════════════════════════════════════════════
 */

export const validRolEntity = {
  EntityLinkId: 1,
  RolId: 1,
}

export const secondRolEntity = {
  EntityLinkId: 2,
  RolId: 2,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 14: USERENTITIES (Usuario-Entidades)
 * ═══════════════════════════════════════════════════════════════
 */

export const validUserEntity = {
  UserId: 1,
  EntityLinkId: 1,
  RolId: 1,
  EntityLinkIdDat: 1,
}

export const secondUserEntity = {
  UserId: 2,
  EntityLinkId: 2,
  RolId: 2,
  EntityLinkIdDat: 2,
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
  Vueltas: 50,
  PrimeraLinea: true,
  VueltaRapida: false,
}

export const secondRaceResult = {
  RaceId: 1,
  UserId: 2,
  Posicion: 2,
  Vueltas: 49,
  PrimeraLinea: false,
  VueltaRapida: true,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 16: ENTITYLINKS (Enlaces de Entidades)
 * ═══════════════════════════════════════════════════════════════
 */

export const validEntityLink = {
  EntityName: 'Club',
}

export const secondEntityLink = {
  EntityName: 'Event',
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 17: SPECIALITIES (Especialidades)
 * ═══════════════════════════════════════════════════════════════
 */

export const validSpeciality = {
  Alias: 'ROAD_RACING',
  Descripcion: 'Carreras en carretera',
  Default: false,
}

export const secondSpeciality = {
  Alias: 'CIRCUIT_RACING',
  Descripcion: 'Carreras en circuito',
  Default: true,
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ENTIDAD 18: DRIVINGENVIRONMENTS (Ambientes de Conducción)
 * ═══════════════════════════════════════════════════════════════
 */
/* CTorre: 22-03-2026 descarto, valores iniciales
export const validDrivingEnvironment = {
  Alias: 'COCHES_TURISMO',
  Descripcion: 'Conducción de turismos',
  Default: true,
}

export const secondDrivingEnvironment = {
  Alias: 'MOTOS',
  Descripcion: 'Conducción de motocicletas',
  Default: false,
}
*/  

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
  /* CTorre: 22-03-2026 descarto, valores iniciales
  drivingEnvironments: {
    valid: validDrivingEnvironment,
    second: secondDrivingEnvironment,
  },
  */
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


