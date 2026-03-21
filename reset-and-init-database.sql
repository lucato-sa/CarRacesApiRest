-- ============================================
-- 🔄 SCRIPT DE LIMPIEZA Y CARGA DE DATOS INICIALES
-- ============================================
-- Propósito: Borra todos los datos de las tablas y recarga los valores iniciales
-- Creada: 21 de Marzo, 2026
-- Base de datos: PostgreSQL 12+ / Supabase
-- 
-- ADVERTENCIA: Este script eliminará TODOS los datos de las tablas
-- ============================================

-- ============================================
-- PASO 1: DESACTIVAR CONSTRAINTS
-- ============================================
ALTER TABLE user_entities DISABLE TRIGGER ALL;
ALTER TABLE rol_entities DISABLE TRIGGER ALL;
ALTER TABLE registrations DISABLE TRIGGER ALL;
ALTER TABLE race_results DISABLE TRIGGER ALL;
ALTER TABLE races DISABLE TRIGGER ALL;
ALTER TABLE competitions DISABLE TRIGGER ALL;
ALTER TABLE events DISABLE TRIGGER ALL;
ALTER TABLE championships DISABLE TRIGGER ALL;
ALTER TABLE divisions DISABLE TRIGGER ALL;
ALTER TABLE disciplines DISABLE TRIGGER ALL;
ALTER TABLE groups DISABLE TRIGGER ALL;
ALTER TABLE rulebooks DISABLE TRIGGER ALL;
ALTER TABLE rules DISABLE TRIGGER ALL;
ALTER TABLE seasons DISABLE TRIGGER ALL;
ALTER TABLE venues DISABLE TRIGGER ALL;
ALTER TABLE circuits DISABLE TRIGGER ALL;
ALTER TABLE segments DISABLE TRIGGER ALL;
ALTER TABLE scoring_det DISABLE TRIGGER ALL;
ALTER TABLE scoring DISABLE TRIGGER ALL;

-- ============================================
-- PASO 2: TRUNCATE CON CASCADE
-- ============================================
TRUNCATE TABLE user_entities CASCADE;
TRUNCATE TABLE rol_entities CASCADE;
TRUNCATE TABLE registrations CASCADE;
TRUNCATE TABLE race_results CASCADE;
TRUNCATE TABLE races CASCADE;
TRUNCATE TABLE competitions CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE championships CASCADE;
TRUNCATE TABLE seasons CASCADE;
TRUNCATE TABLE rulebooks CASCADE;
TRUNCATE TABLE rules CASCADE;
TRUNCATE TABLE scoring_det CASCADE;
TRUNCATE TABLE scoring CASCADE;
TRUNCATE TABLE segments CASCADE;
TRUNCATE TABLE circuits CASCADE;
TRUNCATE TABLE venues CASCADE;
TRUNCATE TABLE groups CASCADE;
TRUNCATE TABLE divisions CASCADE;
TRUNCATE TABLE disciplines CASCADE;
TRUNCATE TABLE entity_links CASCADE;
TRUNCATE TABLE roles CASCADE;
TRUNCATE TABLE clubs CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE specialities CASCADE;
TRUNCATE TABLE formats CASCADE;
TRUNCATE TABLE surfaces CASCADE;
TRUNCATE TABLE driving_environments CASCADE;
TRUNCATE TABLE levels CASCADE;

-- ============================================
-- PASO 3: RESETEAR SECUENCIAS
-- ============================================
ALTER SEQUENCE user_entities_user_entity_id_seq RESTART WITH 1;
ALTER SEQUENCE rol_entities_rol_entity_id_seq RESTART WITH 1;
ALTER SEQUENCE registrations_registration_id_seq RESTART WITH 1;
ALTER SEQUENCE race_results_result_id_seq RESTART WITH 1;
ALTER SEQUENCE races_race_id_seq RESTART WITH 1;
ALTER SEQUENCE competitions_competition_id_seq RESTART WITH 1;
ALTER SEQUENCE events_event_id_seq RESTART WITH 1;
ALTER SEQUENCE championships_championship_id_seq RESTART WITH 1;
ALTER SEQUENCE seasons_season_id_seq RESTART WITH 1;
ALTER SEQUENCE rulebooks_rulebook_id_seq RESTART WITH 1;
ALTER SEQUENCE rules_rule_id_seq RESTART WITH 1;
ALTER SEQUENCE scoring_det_scoring_det_id_seq RESTART WITH 1;
ALTER SEQUENCE scoring_scoring_id_seq RESTART WITH 1;
ALTER SEQUENCE segments_segment_id_seq RESTART WITH 1;
ALTER SEQUENCE circuits_circuit_id_seq RESTART WITH 1;
ALTER SEQUENCE venues_venue_id_seq RESTART WITH 1;
ALTER SEQUENCE groups_group_id_seq RESTART WITH 1;
ALTER SEQUENCE divisions_division_id_seq RESTART WITH 1;
ALTER SEQUENCE disciplines_discipline_id_seq RESTART WITH 1;
ALTER SEQUENCE entity_links_entity_link_id_seq RESTART WITH 1;
ALTER SEQUENCE roles_rol_id_seq RESTART WITH 1;
ALTER SEQUENCE clubs_club_id_seq RESTART WITH 1;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE specialities_speciality_id_seq RESTART WITH 1;
ALTER SEQUENCE formats_format_id_seq RESTART WITH 1;
ALTER SEQUENCE surfaces_surface_id_seq RESTART WITH 1;
ALTER SEQUENCE driving_environments_driving_environment_id_seq RESTART WITH 1;
ALTER SEQUENCE levels_level_id_seq RESTART WITH 1;

-- ============================================
-- PASO 4: INSERTAR DATOS INICIALES
-- ============================================

-- 4.1 DRIVING ENVIRONMENTS
-- ============================================
INSERT INTO driving_environments (driving_environment_id, alias, descripcion, "default", created_at, updated_at) VALUES
(1, 'Real', 'Coches con vehículos reales', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Virtual', 'SimRacing. Coches en software de simulación', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'RC/Modelismo', 'Coches de radio control', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Slot', 'Coches en pista eléctrica', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Formación', 'Seguridad vial y enseñanza', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('driving_environments_driving_environment_id_seq', 5);

-- 4.2 SPECIALITIES (Especialidades)
-- ============================================
INSERT INTO specialities (speciality_id, alias, descripcion, "default", created_at, updated_at) VALUES
(1, 'Circuito', 'Circuito cerrado', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Carreteras', 'Carreteras y caminos de tramos abierto / semi-abierto', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Habilidad', 'Slalom, Drifting, Trial', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Larga Distancia', 'Larga Distancia', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Records', 'Records', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('specialities_speciality_id_seq', 5);

-- 4.3 FORMATS
-- ============================================
INSERT INTO formats (format_id, alias, descripcion, created_at, updated_at) VALUES
(1, 'Velocidad', 'Velocidad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Velocidad/Cruce', 'Velocidad/Cruce', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Precisión/Tiempo', 'Precisión/Tiempo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Enlace/Velocidad', 'Enlace/Velocidad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Velocidad pura', 'Velocidad pura', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Navegación', 'Navegación', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Agilidad/Conos', 'Agilidad/Conos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Estilo/Control', 'Estilo/Control', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Superación', 'Superación', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('formats_format_id_seq', 9);

-- 4.4 SURFACES
-- ============================================
INSERT INTO surfaces (surface_id, alias, descripcion, created_at, updated_at) VALUES
(1, 'Pista cerrada', 'Pista cerrada', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Pista cerrada (Tierra)', 'Pista cerrada (Tierra)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Pista cerrada (Kartódromo)', 'Pista cerrada (Kartódromo)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Mixto (Asfalto/Tierra)', 'Mixto (Asfalto/Tierra)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Asfalto (Tramos)', 'Asfalto (Tramos)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Asfalto (Ascensión)', 'Asfalto (Ascensión)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Tierra (Tramos)', 'Tierra (Tramos)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Raid/Campo abierto', 'Raid/Campo abierto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Mixto', 'Mixto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Asfalto', 'Asfalto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'Obstáculos', 'Obstáculos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('surfaces_surface_id_seq', 11);

-- 4.5 DISCIPLINES
-- ============================================
INSERT INTO disciplines (discipline_id, speciality_id, format_id, surface_id, alias, created_at, updated_at) VALUES
(1, 1, 1, 1, 'Asfalto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 1, 2, 'Autocross', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 1, 3, 'Karting', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 2, 4, 'Rallye Cross', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, 3, 1, 'Regularidad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 2, 4, 5, 'Rallye', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 2, 5, 6, 'Montaña', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 2, 4, 7, 'Rallye Tierra', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 2, 6, 8, 'Todo Terreno', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 3, 7, 9, 'Slalom', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 3, 8, 10, 'Drifting', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 3, 9, 11, 'Trial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('disciplines_discipline_id_seq', 12);

-- 4.6 DIVISIONS
-- ============================================
INSERT INTO divisions (division_id, discipline_id, alias, descripcion, created_at, updated_at) VALUES
(1, 1, 'Formula 1', 'Formula 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'Formula 2', 'Formula 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 'Formula E', 'Formula E', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'GT', 'GT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, 'GT2', 'GT2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 1, 'GT3', 'GT3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 1, 'Gr.5', 'Gr.5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 1, 'Gr.C', 'Gr.C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 1, 'DTM', 'DTM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 1, 'Hipercar', 'Hipercar', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('divisions_division_id_seq', 10);

-- 4.7 LEVELS
-- ============================================
INSERT INTO levels (level_id, descripcion, created_at, updated_at) VALUES
(1, 'Mundial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Continental', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Nacional', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Regional', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Provincial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Club', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('levels_level_id_seq', 6);

-- 4.8 GROUPS
-- ============================================
INSERT INTO groups (group_id, division_id, descripcion, club_id, "default", created_at, updated_at) VALUES
(1, 9, 'DTM Classic 90-2000', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 9, 'DTM 2010->', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('groups_group_id_seq', 2);

-- 4.9 ENTITY_LINKS
-- ============================================
INSERT INTO entity_links (entity_link_id, entity_name, created_at, updated_at) VALUES
(1, 'Club', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Event', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Competition', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('entity_links_entity_link_id_seq', 3);

-- 4.10 ROLES
-- ============================================
INSERT INTO roles (rol_id, nombre, pseudonimo, created_at, updated_at) VALUES
(1, 'Administrador Club', 'ClubAdmin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Tesorero', 'Treasurer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Socio', 'Member', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Contacto', 'Contact', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Invitado', 'Guest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Responsable Evento', 'EventResp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Responsable Prueba', 'CompetitionResp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('roles_rol_id_seq', 7);

-- 4.11 ROL_ENTITIES
-- ============================================
INSERT INTO rol_entities (rol_entity_id, entity_link_id, rol_id, created_at, updated_at) VALUES
(1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 2, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 3, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('rol_entities_rol_entity_id_seq', 7);

-- ============================================
-- PASO 5: REACTIVAR TRIGGERS
-- ============================================
ALTER TABLE user_entities ENABLE TRIGGER ALL;
ALTER TABLE rol_entities ENABLE TRIGGER ALL;
ALTER TABLE registrations ENABLE TRIGGER ALL;
ALTER TABLE race_results ENABLE TRIGGER ALL;
ALTER TABLE races ENABLE TRIGGER ALL;
ALTER TABLE competitions ENABLE TRIGGER ALL;
ALTER TABLE events ENABLE TRIGGER ALL;
ALTER TABLE championships ENABLE TRIGGER ALL;
ALTER TABLE divisions ENABLE TRIGGER ALL;
ALTER TABLE disciplines ENABLE TRIGGER ALL;
ALTER TABLE groups ENABLE TRIGGER ALL;
ALTER TABLE rulebooks ENABLE TRIGGER ALL;
ALTER TABLE rules ENABLE TRIGGER ALL;
ALTER TABLE seasons ENABLE TRIGGER ALL;
ALTER TABLE venues ENABLE TRIGGER ALL;
ALTER TABLE circuits ENABLE TRIGGER ALL;
ALTER TABLE segments ENABLE TRIGGER ALL;
ALTER TABLE scoring_det ENABLE TRIGGER ALL;
ALTER TABLE scoring ENABLE TRIGGER ALL;

-- ============================================
-- ✅ SCRIPT COMPLETADO
-- ============================================
-- Base de datos limpiada y datos iniciales cargados exitosamente
-- 
-- Resumen de datos cargados:
-- ✓ Driving Environments: 5 registros
-- ✓ Specialities: 5 registros
-- ✓ Formats: 9 registros
-- ✓ Surfaces: 11 registros
-- ✓ Disciplines: 12 registros
-- ✓ Divisions: 10 registros
-- ✓ Levels: 6 registros
-- ✓ Groups: 2 registros
-- ✓ Entity Links: 3 registros
-- ✓ Roles: 7 registros
-- ✓ Rol Entities: 7 registros
--
-- Total: 77 registros de datos iniciales
-- ============================================
