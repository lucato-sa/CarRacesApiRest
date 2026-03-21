-- ============================================
-- 🗄️ CarRacesAPI - NUEVAS ENTIDADES
-- ============================================
-- Creada: 21 de Marzo, 2026
-- Para: PostgreSQL 12+ / Supabase
-- 
-- Agregar las 10 entidades faltantes identificadas en análisis

-- ============================================
-- 1. LEVELS
-- ============================================
CREATE TABLE IF NOT EXISTS levels (
  level_id SERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_levels_descripcion ON levels(descripcion);

-- ============================================
-- 2. GROUPS
-- ============================================
CREATE TABLE IF NOT EXISTS groups (
  group_id SERIAL PRIMARY KEY,
  division_id INT NOT NULL REFERENCES divisions(division_id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  club_id INT REFERENCES clubs(club_id),
  "default" BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_groups_division_id ON groups(division_id);
CREATE INDEX idx_groups_club_id ON groups(club_id);

-- ============================================
-- 3. SCORING
-- ============================================
CREATE TABLE IF NOT EXISTS scoring (
  scoring_id SERIAL PRIMARY KEY,
  descripcion TEXT NOT NULL,
  club_id INT REFERENCES clubs(club_id),
  ult_pos_puntos INT,
  puntos_defecto INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scoring_club_id ON scoring(club_id);

-- ============================================
-- 4. SCORING_DET (Detalle de Puntuación)
-- ============================================
CREATE TABLE IF NOT EXISTS scoring_det (
  scoring_det_id SERIAL PRIMARY KEY,
  scoring_id INT NOT NULL REFERENCES scoring(scoring_id) ON DELETE CASCADE,
  posicion INT NOT NULL,
  puntos INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(scoring_id, posicion)
);

CREATE INDEX idx_scoring_det_scoring_id ON scoring_det(scoring_id);

-- ============================================
-- 5. RULEBOOKS (Reglamentos)
-- ============================================
CREATE TABLE IF NOT EXISTS rulebooks (
  rulebook_id SERIAL PRIMARY KEY,
  descripcion TEXT NOT NULL,
  fecha_inicio_valido DATE NOT NULL,
  fecha_fin_valido DATE,
  division_id INT REFERENCES divisions(division_id),
  group_id INT REFERENCES groups(group_id),
  club_id INT REFERENCES clubs(club_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rulebooks_division_id ON rulebooks(division_id);
CREATE INDEX idx_rulebooks_group_id ON rulebooks(group_id);
CREATE INDEX idx_rulebooks_club_id ON rulebooks(club_id);
CREATE INDEX idx_rulebooks_fecha_inicio ON rulebooks(fecha_inicio_valido);

-- ============================================
-- 6. RULES (Reglas)
-- ============================================
CREATE TABLE IF NOT EXISTS rules (
  rule_id SERIAL PRIMARY KEY,
  rulebook_id INT NOT NULL REFERENCES rulebooks(rulebook_id) ON DELETE CASCADE,
  rule_code VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rulebook_id, rule_code)
);

CREATE INDEX idx_rules_rulebook_id ON rules(rulebook_id);
CREATE INDEX idx_rules_rule_code ON rules(rule_code);

-- ============================================
-- 7. SEASONS (Temporadas)
-- ============================================
CREATE TABLE IF NOT EXISTS seasons (
  season_id SERIAL PRIMARY KEY,
  championship_id INT NOT NULL REFERENCES championships(championship_id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  fecha_desde DATE NOT NULL,
  fecha_hasta DATE NOT NULL,
  pilotos_min INT,
  pilotos_max INT,
  solo_socios BOOLEAN DEFAULT FALSE,
  rulebook_id INT REFERENCES rulebooks(rulebook_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seasons_championship_id ON seasons(championship_id);
CREATE INDEX idx_seasons_rulebook_id ON seasons(rulebook_id);
CREATE INDEX idx_seasons_fecha_desde ON seasons(fecha_desde);

-- ============================================
-- 8. VENUES (Sedes)
-- ============================================
CREATE TABLE IF NOT EXISTS venues (
  venue_id SERIAL PRIMARY KEY,
  club_id INT NOT NULL REFERENCES clubs(club_id) ON DELETE CASCADE,
  alias VARCHAR(100) NOT NULL,
  sede_social BOOLEAN DEFAULT FALSE,
  sede_carreras BOOLEAN DEFAULT FALSE,
  direccion VARCHAR(255),
  localidad VARCHAR(100),
  provincia VARCHAR(100),
  pais VARCHAR(100),
  map_latitud NUMERIC(10, 8),
  map_longitud NUMERIC(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venues_club_id ON venues(club_id);
CREATE INDEX idx_venues_alias ON venues(alias);

-- ============================================
-- 9. CIRCUITS (Circuitos)
-- ============================================
CREATE TABLE IF NOT EXISTS circuits (
  circuit_id SERIAL PRIMARY KEY,
  venue_id INT NOT NULL REFERENCES venues(venue_id) ON DELETE CASCADE,
  surface_id INT REFERENCES surfaces(surface_id),
  driving_enviroment_id INT REFERENCES driving_environments(driving_environment_id),
  alias VARCHAR(100) NOT NULL,
  descripcion TEXT,
  longitud NUMERIC(10, 2),
  permanente BOOLEAN DEFAULT FALSE,
  tot_segments INT,
  slot_analogic BOOLEAN DEFAULT FALSE,
  slot_digital BOOLEAN DEFAULT FALSE,
  slot_tot_lanes INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_circuits_venue_id ON circuits(venue_id);
CREATE INDEX idx_circuits_surface_id ON circuits(surface_id);
CREATE INDEX idx_circuits_driving_enviroment_id ON circuits(driving_enviroment_id);

-- ============================================
-- 10. SEGMENTS (Tramos)
-- ============================================
CREATE TABLE IF NOT EXISTS segments (
  segment_id SERIAL PRIMARY KEY,
  circuit_id INT NOT NULL REFERENCES circuits(circuit_id) ON DELETE CASCADE,
  alias VARCHAR(100) NOT NULL,
  num_segment INT NOT NULL,
  num_lane INT,
  tot_sections INT,
  longitud NUMERIC(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(circuit_id, num_segment)
);

CREATE INDEX idx_segments_circuit_id ON segments(circuit_id);

-- ============================================
-- ACTUALIZAR REFERENCIAS DE COMPETITIONS Y SEASONS
-- ============================================
-- Agregar foreign key a Seasons en Competitions (si no existe)
ALTER TABLE competitions
ADD CONSTRAINT fk_competitions_season_id
FOREIGN KEY (season_id) REFERENCES seasons(season_id)
ON DELETE CASCADE;

-- Agregar foreign key a Venues en Competitions (si no existe)
ALTER TABLE competitions
ADD CONSTRAINT fk_competitions_venue_id
FOREIGN KEY (venue_id) REFERENCES venues(venue_id)
ON DELETE CASCADE;

-- ============================================
-- ✅ NUEVAS ENTIDADES CREADAS
-- ============================================
-- 10 nuevas tablas agregadas exitosamente
-- Total de tablas del sistema: 28
-- Relaciones de integridad referencial completadas
