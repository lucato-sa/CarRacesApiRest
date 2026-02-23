import express, { Application } from 'express';
import { loggerMiddleware } from './middleware/logger.middleware';
import { ClubRepository } from './clubs/repository/club.repository';
import { createClubRoutes } from './clubs/transport/club.routes';
import { UserRepository } from './users/repository/user.repository';
import { createUserRoutes } from './users/transport/user.routes';
import { CompetitionRepository } from './competitions/repository/competition.repository';
import { createCompetitionRoutes } from './competitions/transport/competition.routes';
import { EventRepository } from './events/repository/event.repository';
import { createEventRoutes } from './events/transport/event.routes';
import { RoleRepository } from './roles/repository/role.repository';
import { createRoleRoutes } from './roles/transport/role.routes';
import { SpecialityRepository } from './specialities/repository/speciality.repository';
import { createSpecialityRoutes } from './specialities/transport/speciality.routes';
import { DivisionRepository } from './divisions/repository/division.repository';
import { createDivisionRoutes } from './divisions/transport/division.routes';
import { DisciplineRepository } from './disciplines/repository/discipline.repository';
import { createDisciplineRoutes } from './disciplines/transport/discipline.routes';
import { SurfaceRepository } from './surfaces/repository/surface.repository';
import { createSurfaceRoutes } from './surfaces/transport/surface.routes';
import { FormatRepository } from './formats/repository/format.repository';
import { createFormatRoutes } from './formats/transport/format.routes';
import { DrivingEnvironmentRepository } from './drivingenviroments/repository/drivingenvironment.repository';
import { createDrivingEnvironmentRoutes } from './drivingenviroments/transport/drivingenvironment.routes';
import { EntityLinkRepository } from './entitylinks/repository/entitylink.repository';
import { createEntityLinkRoutes } from './entitylinks/transport/entitylink.routes';
import { RegistrationRepository } from './registrations/repository/registration.repository';
import { createRegistrationRoutes } from './registrations/transport/registration.routes';
import { ChampionshipRepository } from './championships/repository/championship.repository';
import { createChampionshipRoutes } from './championships/transport/championship.routes';
import { RaceRepository } from './races/repository/race.repository';
import { createRaceRoutes } from './races/transport/race.routes';
import { RaceResultRepository } from './raceresults/repository/raceresult.repository';
import { createRaceResultRoutes } from './raceresults/transport/raceresult.routes';
import { UserEntityRepository } from './userentities/repository/userentity.repository';
import { createUserEntityRoutes } from './userentities/transport/userentity.routes';
import { RolEntityRepository } from './rolentities/repository/rolentity.repository';
import { createRolEntityRoutes } from './rolentities/transport/rolentity.routes';

/**
 * Crea la aplicación Express con todas las capas (transporte, dominio, persistencia).
 */
export function createApp(): Application {
  const app = express();
  app.use(express.json());

  // === MIDDLEWARE: Logger ===
  app.use(loggerMiddleware);

  // === PERSISTENCIA: Inicializar repositorios ===
  const clubRepository = new ClubRepository();
  const userRepository = new UserRepository();
  const competitionRepository = new CompetitionRepository();
  const eventRepository = new EventRepository();
  const roleRepository = new RoleRepository();
  const specialityRepository = new SpecialityRepository();
  const divisionRepository = new DivisionRepository();
  const disciplineRepository = new DisciplineRepository();
  const surfaceRepository = new SurfaceRepository();
  const formatRepository = new FormatRepository();
  const drivingEnvRepository = new DrivingEnvironmentRepository();
  const entityLinkRepository = new EntityLinkRepository();
  const registrationRepository = new RegistrationRepository();
  const championshipRepository = new ChampionshipRepository();
  const raceRepository = new RaceRepository();
  const raceResultRepository = new RaceResultRepository();
  const userEntityRepository = new UserEntityRepository();
  const rolEntityRepository = new RolEntityRepository();

  // === TRANSPORTE: Registrar rutas ===
  const clubRoutes = createClubRoutes(clubRepository);
  const userRoutes = createUserRoutes(userRepository);
  const competitionRoutes = createCompetitionRoutes(competitionRepository);
  const eventRoutes = createEventRoutes(eventRepository);
  const roleRoutes = createRoleRoutes(roleRepository);
  const specialityRoutes = createSpecialityRoutes(specialityRepository);
  const divisionRoutes = createDivisionRoutes(divisionRepository);
  const disciplineRoutes = createDisciplineRoutes(disciplineRepository);
  const surfaceRoutes = createSurfaceRoutes(surfaceRepository);
  const formatRoutes = createFormatRoutes(formatRepository);
  const drivingEnvRoutes = createDrivingEnvironmentRoutes(drivingEnvRepository);
  const entityLinkRoutes = createEntityLinkRoutes(entityLinkRepository);
  const registrationRoutes = createRegistrationRoutes(registrationRepository);
  const championshipRoutes = createChampionshipRoutes(championshipRepository);
  const raceRoutes = createRaceRoutes(raceRepository);
  const raceResultRoutes = createRaceResultRoutes(raceResultRepository);
  const userEntityRoutes = createUserEntityRoutes(userEntityRepository);
  const rolEntityRoutes = createRolEntityRoutes(rolEntityRepository);

  app.use('/api', clubRoutes);
  app.use('/api', userRoutes);
  app.use('/api', competitionRoutes);
  app.use('/api', eventRoutes);
  app.use('/api', roleRoutes);
  app.use('/api', specialityRoutes);
  app.use('/api', divisionRoutes);
  app.use('/api', disciplineRoutes);
  app.use('/api', surfaceRoutes);
  app.use('/api', formatRoutes);
  app.use('/api', drivingEnvRoutes);
  app.use('/api', entityLinkRoutes);
  app.use('/api', registrationRoutes);
  app.use('/api', championshipRoutes);
  app.use('/api', raceRoutes);
  app.use('/api', raceResultRoutes);
  app.use('/api', userEntityRoutes);
  app.use('/api', rolEntityRoutes);

  return app;
}

export default createApp();