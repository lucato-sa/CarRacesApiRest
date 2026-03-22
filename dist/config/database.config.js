"use strict";
/**
 * 📋 Configuración centralizada de base de datos
 * Agnóstica del backend (TypeORM, Supabase, PostgreSQL, etc.)
 *
 * USO:
 * - Importar en app.ts, server.ts y tests
 * - Define qué backend usar según variable de entorno
 * - Define mapeo de campos DTO ↔ BD
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_CONFIG = void 0;
exports.dtoToDb = dtoToDb;
exports.dbToDto = dbToDto;
exports.DATABASE_CONFIG = {
    // ============ ENTORNOS ============
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_TEST: process.env.NODE_ENV === 'test',
    // ============ BACKEND SELECTION ============
    BACKEND_TYPE: (process.env.BACKEND || 'memory'),
    // ============ CONEXIÓN A BD ============
    DB: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'carracesapi',
        // SSL para Supabase
        isSupabase: process.env.DB_HOST?.includes('supabase.co') || process.env.BACKEND === 'supabase',
        ssl: {
            rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
    },
    // ============ SUPABASE ============
    SUPABASE: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || process.env.SUPABASE_KEY_ANON || '',
    },
    // ============ TYPEORM ============
    TYPEORM: {
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.DB_LOGGING === 'true',
        dropSchema: process.env.NODE_ENV === 'test', // Resetear esquema en tests
    },
    // ============ MAPEO DE CAMPOS (DTO ↔ BD) ============
    FIELD_MAPPINGS: {
        // Mapeo PascalCase (DTO) → snake_case (BD)
        // 18 entidades del sistema
        // 1. CLUBS
        clubs: {
            'ClubId': 'club_id',
            'Alias': 'alias',
            'TaxNombre': 'tax_nombre',
            'TaxNumero': 'tax_numero',
            'Descripcion': 'descripcion',
            'FechaFundacion': 'fecha_fundacion',
            'Default': 'default',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 2. USERS
        users: {
            'UserId': 'user_id',
            'Nick': 'nick',
            'Nombre': 'nombre',
            'Apellidos': 'apellidos',
            'Email': 'email',
            'Direccion': 'direccion',
            'Localidad': 'localidad',
            'Provincia': 'provincia',
            'Pais': 'pais',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 3. RACES
        races: {
            'RaceId': 'race_id',
            'CompetitionId': 'competition_id',
            'NumRace': 'num_race',
            'Fecha': 'fecha',
            'Hora': 'hora',
            'Estado': 'estado',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 4. COMPETITIONS
        competitions: {
            'CompetitionId': 'competition_id',
            'SeasonId': 'season_id',
            'EventId': 'event_id',
            'VenueId': 'venue_id',
            'Alias': 'alias',
            'TotalRaces': 'total_races',
            'FechaInicioInscripPri': 'fecha_inicio_inscrip_pri',
            'FechaFinInscripPri': 'fecha_fin_inscrip_pri',
            'FechaInicioInscrip': 'fecha_inicio_inscrip',
            'FechaFinInscrip': 'fecha_fin_inscrip',
            'PilotosMinInscrip': 'pilotos_min_inscrip',
            'PilotosMaxInscrip': 'pilotos_max_inscrip',
            'Responsable': 'responsable',
            'SoloUsuariosReg': 'solo_usuarios_reg',
            'Notas': 'notas',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 5. CHAMPIONSHIPS
        championships: {
            'ChampionshipId': 'championship_id',
            'Alias': 'alias',
            'Descripcion': 'descripcion',
            'ClubId': 'club_id',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 6. EVENTS
        events: {
            'EventId': 'event_id',
            'Descripcion': 'descripcion',
            'FechaInicio': 'fecha_inicio',
            'FechaFin': 'fecha_fin',
            'ClubId': 'club_id',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 7. REGISTRATIONS
        registrations: {
            'RegistrationId': 'registration_id',
            'CompetitionId': 'competition_id',
            'UserId': 'user_id',
            'FechaRegistro': 'fecha_registro',
            'Estado': 'estado',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 8. DISCIPLINES
        disciplines: {
            'DisciplineId': 'discipline_id',
            'SpecialityId': 'speciality_id',
            'FormatId': 'format_id',
            'SurfaceId': 'surface_id',
            'Alias': 'alias',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 9. FORMATS
        formats: {
            'FormatId': 'format_id',
            'Alias': 'alias',
            'Descripcion': 'descripcion',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 10. SURFACES
        surfaces: {
            'SurfaceId': 'surface_id',
            'Alias': 'alias',
            'Descripcion': 'descripcion',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 11. DIVISIONS
        divisions: {
            'DivisionId': 'division_id',
            'DisciplineId': 'discipline_id',
            'Alias': 'alias',
            'Descripcion': 'descripcion',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 12. ROLES
        roles: {
            'RolId': 'rol_id',
            'Nombre': 'nombre',
            'Pseudonimo': 'pseudonimo',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 13. ROL_ENTITIES
        rolentities: {
            'RolEntityId': 'rol_entity_id',
            'EntityLinkId': 'entity_link_id',
            'RolId': 'rol_id',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 14. USER_ENTITIES
        userentities: {
            'UserEntityId': 'user_entity_id',
            'UserId': 'user_id',
            'EntityLinkId': 'entity_link_id',
            'RolId': 'rol_id',
            'EntityLinkIdDat': 'entity_link_id_dat',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 15. RACE_RESULTS
        raceresults: {
            'ResultId': 'result_id',
            'RaceId': 'race_id',
            'UserId': 'user_id',
            'Posicion': 'posicion',
            'Vueltas': 'vueltas',
            'PrimeraLinea': 'primera_linea',
            'VueltaRapida': 'vuelta_rapida',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 16. ENTITY_LINKS
        entitylinks: {
            'EntityLinkId': 'entity_link_id',
            'EntityName': 'entity_name',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 17. SPECIALITIES
        specialities: {
            'SpecialityId': 'speciality_id',
            'Alias': 'alias',
            'Descripcion': 'descripcion',
            'Default': 'default',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 18. DRIVING_ENVIRONMENTS
        drivingenvironments: {
            'DrivingEnvironmentId': 'driving_environment_id',
            'Alias': 'alias',
            'Descripcion': 'descripcion',
            'Default': 'default',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 19. LEVELS
        levels: {
            'LevelId': 'level_id',
            'Descripcion': 'descripcion',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 20. GROUPS
        groups: {
            'GroupId': 'group_id',
            'DivisionId': 'division_id',
            'Descripcion': 'descripcion',
            'ClubId': 'club_id',
            'Default': 'default',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 21. SCORING
        scoring: {
            'ScoringId': 'scoring_id',
            'Descripcion': 'descripcion',
            'ClubId': 'club_id',
            'UltPosPuntos': 'ult_pos_puntos',
            'PuntosDefecto': 'puntos_defecto',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 22. SCORING_DET (Detalle de Scoring)
        scoringdet: {
            'ScoringDetId': 'scoring_det_id',
            'ScoringId': 'scoring_id',
            'Posicion': 'posicion',
            'Puntos': 'puntos',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 23. RULEBOOKS
        rulebooks: {
            'RulebookId': 'rulebook_id',
            'Descripcion': 'descripcion',
            'FechaInicioValido': 'fecha_inicio_valido',
            'FechaFinValido': 'fecha_fin_valido',
            'DivisionId': 'division_id',
            'GroupId': 'group_id',
            'ClubId': 'club_id',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 24. RULES
        rules: {
            'RuleId': 'rule_id',
            'RulebookId': 'rulebook_id',
            'RuleCode': 'rule_code',
            'Descripcion': 'descripcion',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 25. SEASONS
        seasons: {
            'SeasonId': 'season_id',
            'ChampionshipId': 'championship_id',
            'Descripcion': 'descripcion',
            'FechaDesde': 'fecha_desde',
            'FechaHasta': 'fecha_hasta',
            'PilotosMin': 'pilotos_min',
            'PilotosMax': 'pilotos_max',
            'SoloSocios': 'solo_socios',
            'RulebookId': 'rulebook_id',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 26. VENUES
        venues: {
            'VenueId': 'venue_id',
            'ClubId': 'club_id',
            'Alias': 'alias',
            'SedeSocial': 'sede_social',
            'SedeCarreras': 'sede_carreras',
            'Direccion': 'direccion',
            'Localidad': 'localidad',
            'Provincia': 'provincia',
            'Pais': 'pais',
            'MapLatitud': 'map_latitud',
            'MapLongitud': 'map_longitud',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 27. CIRCUITS
        circuits: {
            'CircuitId': 'circuit_id',
            'VenueId': 'venue_id',
            'SurfaceId': 'surface_id',
            'DrivingEnviromentId': 'driving_enviroment_id',
            'Alias': 'alias',
            'Descripcion': 'descripcion',
            'Longitud': 'longitud',
            'Permanente': 'permanente',
            'TotSegments': 'tot_segments',
            'SlotAnalogic': 'slot_analogic',
            'SlotDigital': 'slot_digital',
            'SlotTotLanes': 'slot_tot_lanes',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
        // 28. SEGMENTS
        segments: {
            'SegmentId': 'segment_id',
            'CircuitId': 'circuit_id',
            'Alias': 'alias',
            'NumSegment': 'num_segment',
            'NumLane': 'num_lane',
            'TotSections': 'tot_sections',
            'Longitud': 'longitud',
            'CreatedAt': 'created_at',
            'UpdatedAt': 'updated_at',
        },
    },
    // ============ MAPEO DE COLUMNAS ID POR TABLA ============
    // Cada tabla tiene su propia columna ID (no 'id' genérica)
    ID_COLUMNS: {
        'clubs': 'club_id',
        'users': 'user_id',
        'races': 'race_id',
        'competitions': 'competition_id',
        'championships': 'championship_id',
        'events': 'event_id',
        'registrations': 'registration_id',
        'disciplines': 'discipline_id',
        'formats': 'format_id',
        'surfaces': 'surface_id',
        'divisions': 'division_id',
        'roles': 'rol_id',
        'rolentities': 'rol_entity_id',
        'userentities': 'user_entity_id',
        'raceresults': 'result_id',
        'entitylinks': 'entity_link_id',
        'specialities': 'speciality_id',
        'drivingenvironments': 'driving_environment_id',
        'levels': 'level_id',
        'groups': 'group_id',
        'scoring': 'scoring_id',
        'scoringdet': 'scoring_det_id',
        'rulebooks': 'rulebook_id',
        'rules': 'rule_id',
        'seasons': 'season_id',
        'venues': 'venue_id',
        'circuits': 'circuit_id',
        'segments': 'segment_id',
    },
};
/**
 * Transforma un objeto DTO (PascalCase) a BD (snake_case)
 * @param entity Nombre de la entidad
 * @param data Objeto con propiedades en PascalCase
 * @returns Objeto con propiedades en snake_case
 */
function dtoToDb(entity, data) {
    const mapping = exports.DATABASE_CONFIG.FIELD_MAPPINGS[entity];
    if (!mapping)
        return data; // Sin mapeo, retornar datos sin cambios
    const transformed = {};
    Object.entries(data).forEach(([key, value]) => {
        const dbKey = mapping[key] || key;
        transformed[dbKey] = value;
    });
    return transformed;
}
/**
 * Transforma un objeto BD (snake_case) a DTO (PascalCase)
 * @param entity Nombre de la entidad
 * @param data Objeto con propiedades en snake_case
 * @returns Objeto con propiedades en PascalCase
 */
function dbToDto(entity, data) {
    const mapping = exports.DATABASE_CONFIG.FIELD_MAPPINGS[entity];
    if (!mapping)
        return data;
    const reverseMapping = {};
    Object.entries(mapping).forEach(([dtoKey, dbKey]) => {
        reverseMapping[dbKey] = dtoKey;
    });
    const transformed = {};
    Object.entries(data).forEach(([key, value]) => {
        const dtoKey = reverseMapping[key] || key;
        transformed[dtoKey] = value;
    });
    return transformed;
}
exports.default = exports.DATABASE_CONFIG;
