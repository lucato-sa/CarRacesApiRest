# Entidades

## DrivingEnviroment

    Define “what” is being driven.

| Columna             | Tipo        |
| ------------------- | ----------- |
| DrivingEnviromentId | PrimaryKey  |
| Alias               | string      |
| Descripcion         | string      |
| default             | boolean     |

## Speciality

    Speciality Where it is driven and the main infrastructure.

| Columna      | Tipo        |
| ------------ | ----------- |
| SpecialityId | PrimaryKey  |
| Alias        | string      |
| Descripcion  | string      |
| default      | boolean     |

## Format

    The format of the test or race

| Columna     | Tipo        |
| ----------- | ----------- |
| FormatId    | PrimaryKey  |
| Descripcion | string      |
| default     | boolean     |

## Surface

    The surface where the test or race takes place

| Columna     | Tipo        |
| ----------- | ----------- |
| SurfaceId   | PrimaryKey  |
| Descripcion | string      |
| default     | boolean     |

## Discipline

    Discipline is a subclassification of the specialty where the format and surface are assigned.

| Columna      | Tipo        |
| ------------ | ----------- |
| DisciplineId | PrimaryKey  |
| Alias        | string      |
| Descripcion  | string      |
| SpecialityId | ForeignKey  |
| FormatId     | ForeignKey  |
| SurfaceId    | ForeignKey  |
| default      | boolean     |

## Division

    Define a division or category of a discipline and you can also define a club

| Columna      | Tipo        |
| ------------ | ----------- |
| DivisionId   | PrimaryKey  |
| Descripcion  | string      |
| DisciplineId | ForeignKey  |
| ClubId       | ForeignKey  |
| default      | boolean     |


## Group

    The Group is a subclassification of the division and you can also define a club.

| Columna     | Tipo        |
| ----------- | ----------- |
| GroupId     | PrimaryKey  |
| Descripcion | string      |
| DivisionId  | ForeignKey  |
| ClubId      | ForeignKey  |
| default     | boolean     |

## Level

| Columna     | Tipo        |
| ----------- | ----------- |
| LevelId     | PrimaryKey  |
| Descripcion | string      |



## Scoring

| Columna       | Tipo             |
| ------------- | ---------------- |
| ScoringId     | PrimaryKey       |
| Descripcion   | texto libre      |
| ClubId        | ForeignKey       |
| UltPosPuntos  | number           |
| PuntosDefecto | number           |

## ScoringDet

| Columna      | Tipo        |
| ------------ | ----------- |
| ScoringDetId | PrimaryKey  |
| ScoringId    | ForeignKey  |
| Posicion     | number      |
| Puntos       | number      |

## Championship

    Definición del campeonato 

| Columna             | Tipo         |
| ------------------- | ------------ |
| ChampionshipId      | PrimaryKey   |
| Descripcion         | string       |
| DrivingEnviromentId | ForeignKey   |
| SpecialityId        | ForeignKey   |
| DisciplineId        | ForeignKey   |
| DivisionId          | ForeignKey   |
| GroupId             | ForeignKey   |
| LevelId             | ForeignKey   |
| ClubId              | ForeignKey   |
| ScoringId           | ForeignKey   |

## Rulebook

    Regulation or set of rules

| Descripcion       | Tipo                    |
| ----------------- | ----------------------- |
| RulebookId        | PrimaryKey              |
| Descripcion       | string                  |
| FechaInicioValido | date                    |
| FechaFinValido    | date                    |
| DivisiónId        | ForeignKey              |
| GroupId           | ForeignKey              |
| ClubId            | ForeignKey              |

## Rule

| Descripcion | Tipo                    |
| ----------- | ----------------------- |
| RuleId      | PrimaryKey              |
| RulebookId  | ForeignKey              |
| RuleCode    | string                  |
| Descripcion | string                  |

## Season

    It is the definition of planning a championship within a limited period of dates in order to subsequently assign events and races. 

| Columna        | Tipo                          | Descripción                      |
| -------------- | ----------------------------- | -------------------------------- |
| SeasonId       | PrimaryKey                    |                                  |
| ChampionshipId | ForeignKey                    |                                  |
| Descripcion    | string			 |                                  |
| FechaDesde     | date                          | Fecha de inicio                  |
| FechaHasta     | date                          | Fecha de finalización            |
| PilotosMin     | number		 | Pilotos minimos por carrera      |
| PilotosMax     | number                        | Pilotos máximo por carrera       |
| SoloSocios     | boolean                       |                                  |
| RulebookId     | ForeignKey                    |                                  |

## Club

    It is an organisation with a head office and one or more venues.

| Columna        | Tipo                             |
| -------------- | -------------------------------- |
| ClubId         | PrimaryKey                       |
| Alias          | string                           |
| TaxNombre      | string                           |
| TaxNumero      | string                           |
| Descripcion    | string                           |
| FechaFundacion | date                             |
| FechaRegistro  | date								|

## Venue

    Are the club's venues.

| Columna      | Tipo          |
| ------------ | ----------- |
| VenueId      | PrimaryKey  |
| ClubId       | ForeignKey  |
| Alias        | string      |
| SedeSocial   | boolean     |
| SedeCarreras | boolean     |
| Direccion    | string      |
| Localidad    | string      |
| Provincia    | string      |
| Pais         | string      |
| MapLatitud   | decimal     |
| MapLongitud  | decimal     |

## Circuit

  The circuits that a Venue has

| Columna             | Tipo                                                                   |
| ------------------- | -------------------------------------------------------------------- |
| CircuitId           | PrimaryKey                                                           |
| VenueId             | ForeignKey                                                           |
| SurfaceId           | ForeignKey                                                           |
| DrivingEnviromentId | ForeignKey                                                           |
| Alias               | texto libre                                                          |
| Descripcion         | texto libre                                                          |
| Longitud            | decimal en metros                                                    |
| Permanente          | booleano                                                             |
| TotSegments         | integer                                                              |
| SlotAnalogic        | boolean,si ha elegido el "Slot" de DrivingEnviroment,  por defecto 0 |
| SlotDigital         | boolean,si ha elegido el "Slot" de DrivingEnviroment,  por defecto 0 |
| SlotTotLanes        | number, si ha elegido el "Slot" de DrivingEnviroment,  por defecto 1 |

## Segment

Set of sections or subcircuits of a circuit.

| Columna     | Tipo                |
| ----------- | ----------------- |
| SegmentId   | PrimaryKey        |
| CircuitId   | ForeignKey        |
| Alias       | Nombre del tramo  |
| NumSegment  | Número de tramo   |
| NumLane     | Número de carril  |
| TotSections | integer           |
| Longitud    | decimal en metros |

## Event

An event is a series of competitions in one or more championships held at one or more club venues.

| Columna     | Tipo                           |
| ----------- | ---------------------------- |
| EventId     | PrimaryKey                   |
| Descripcion | texto libre                  |
| FechaInicio | date                         |
| FechaFin    | date                         |
| ClubId      | ForeignKey, club organizador |

## Competition

It is the definition of races to be held for each championship at a venue; the championship is assigned by season.

| Columna               | Tipo        | Descripcion                                                                          |                                                                            
| --------------------- | ----------- | ------------------------------------------------------------------------------------ |                                                                           
| CompetitionId         | PrimaryKey  |                                                                                      |                                                                            
| SeasonId              | ForeignKey  |                                                                                      |                                                                           
| EventId               | ForeignKey  |                                                                                      |                                                                            
| VenueId               | ForeignKey  |                                                                                      |                                                                            
| Alias                 | string      |                                                                                      |                                                                            
| TotalRaces            | number      | por defecto 1                                                                        |                                                                            
| FechaInicioInscripPri | date        | Fecha inicio de inscripción para los pilotos prioritarios (Inscritos a la temporada) |
| FechaFinInscripPri    | date        | Fecha fin de inscripción para los pilotos prioritarios (Inscritos a la temporada)    |
| FechaInicioInscrip    | date        | Fecha inicio de inscripción                                                          |
| FechaFinInscrip       | date        | Fecha fin de inscripción                                                             |
| PilotosMinInscrip     | number      | Pilotos mínimo inscritos                                                             |
| PilotosMaxInscrip     | number      | Pilotos máximo inscritos                                                             |
| Responsable           | ForeignKey  | Usuario responsable de la prueba                                                     |
| SoloUsuariosReg       | boolean     | Indica que se solo se pueden inscribir usuarios registrados                          |
| Notas                 | string      |                                                                                      |                                                                            

## Registration

Pilots pre-registered or registered for a Competition.

| Columna          | Tipo        |
| ---------------- | ----------- |
| RegistrationId   | PrimaryKey  |
| CompetitionId    | ForeignKey  |
| UserId           | ForeignKey  |
| FechaPreRegistro | date        |
| FechaRegistro    | date        |
| Dorsal           | Number      |

## Race

    The races listed defined in the competition.

| Columna       | Tipo         |
| ------------- | ------------ |
| RaceId        | PrimaryKey   |
| CompetitionId | ForeignKey   |
| NumRace       | number       |
| Fecha         | date         |
| Hora          | datetime     |
| Estado        | number       |

## RaceResult

	Race result registration
	
| Columna      | Tipo        |
| ------------ | ----------- |
| RaceResultId | PrimaryKey  |
| RaceId       | ForeignKey  |
| Posicion     | Posicion    |
| UserId       | ForeignKey  |
| Laps         | integer     |
| NumSegment   | integer     |
| Pole         | boolean     |
| FastLap      | boolean     |
  
  
## EntityLink

	Table that allows you to identify the Entities with the tables in the solution.

| Columna      | Tipo        |
| ------------ | ----------- |
| EntityLinkId | PrimaryKey  |
| EntityName   | string      |  

## Rol

	User role, the Pseudonym field cannot be modified; it is used to associate it in the software flows.

| Columna    | Tipo        |
| ---------- | ----------- |
| RolId      | PrimaryKey  |
| Nombre     | string      |
| Pseudonimo | string      |

## RolEntity

	Validate relationships that can be defined as user role associations for each entity.

| Columna       | Tipo        |
| ------------- | ----------- |
| RolEntityId   | PrimaryKey  |
| EntityLinkId  | ForeignKey  |
| RolId         | ForeignKey  |


## User

	API users

| Columna       | Tipo           |
| ------------- | -------------- |
| UserId        | PrimaryKey     |
| Nick          | string         |
| Nombre        | string         |
| Apellidos     | string         |
| Direccion     | string         |
| Localidad     | string         |
| Provincia     | string         |
| Pais          | string         |
| Telefono      | string         |
| Email         | string         |
| FechaRegistro | date           |

KeyUnique: Nick


## UserEntity

	Allows you to associate a user with an entity and a specific role.

| Columna       | Tipo                  |
| ------------- | --------------------- |
| UserEntityId  | PrimaryKey            |
| UserId        | ForeignKey            |
| EntityLinkId  | ForeignKey            |
| RolId         | ForeignKey            |
| EntityId      | number                |
| FechaRegistro | date                  |
| Activo        | boolean               |

	UniqueKey: UserId, RolId, EntityLinkId, EntityId  
