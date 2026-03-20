-- ============================================
-- 🗄️ CarRacesAPI - SCHEMA INICIAL
-- ============================================
-- Creada: 19 de Marzo, 2026
-- Para: PostgreSQL 12+ / Supabase
-- 
-- Crear todas las tablas del sistema

-- ============================================
-- 1. CLUBS
-- ============================================
CREATE TABLE IF NOT EXISTS clubs (
  club_id SERIAL PRIMARY KEY,
  alias VARCHAR(100) NOT NULL UNIQUE,
  tax_nombre VARCHAR(255) NOT NULL,
  tax_numero VARCHAR(20) NOT NULL UNIQUE,
  descripcion TEXT NOT NULL,
  fecha_fundacion DATE NOT NULL,
  default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clubs_alias ON clubs(alias);

-- ============================================
-- 2. USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  nick VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(50) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  direccion VARCHAR(255),
  localidad VARCHAR(100),
  provincia VARCHAR(100),
  pais VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nick ON users(nick);

-- ============================================
-- 3. SPECIALITIES
-- ============================================
CREATE TABLE IF NOT EXISTS specialities (
  speciality_id SERIAL PRIMARY KEY,
  alias VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. FORMATS
-- ============================================
CREATE TABLE IF NOT EXISTS formats (
  format_id SERIAL PRIMARY KEY,
  alias VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. SURFACES
-- ============================================
CREATE TABLE IF NOT EXISTS surfaces (
  surface_id SERIAL PRIMARY KEY,
  alias VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. DISCIPLINES
-- ============================================
CREATE TABLE IF NOT EXISTS disciplines (
  discipline_id SERIAL PRIMARY KEY,
  speciality_id INT REFERENCES specialities(speciality_id),
  format_id INT REFERENCES formats(format_id),
  surface_id INT REFERENCES surfaces(surface_id),
  alias VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. DIVISIONS
-- ============================================
CREATE TABLE IF NOT EXISTS divisions (
  division_id SERIAL PRIMARY KEY,
  discipline_id INT REFERENCES disciplines(discipline_id),
  alias VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. DRIVING_ENVIRONMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS driving_environments (
  driving_environment_id SERIAL PRIMARY KEY,
  alias VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. CHAMPIONSHIPS
-- ============================================
CREATE TABLE IF NOT EXISTS championships (
  championship_id SERIAL PRIMARY KEY,
  alias VARCHAR(100) NOT NULL,
  descripcion TEXT,
  club_id INT REFERENCES clubs(club_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_championships_club_id ON championships(club_id);

-- ============================================
-- 10. EVENTS
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  event_id SERIAL PRIMARY KEY,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  club_id INT REFERENCES clubs(club_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_club_id ON events(club_id);

-- ============================================
-- 11. COMPETITIONS
-- ============================================
CREATE TABLE IF NOT EXISTS competitions (
  competition_id SERIAL PRIMARY KEY,
  season_id INT,
  event_id INT REFERENCES events(event_id),
  venue_id INT,
  alias VARCHAR(100),
  total_races INT,
  fecha_inicio_inscrip_pri DATE,
  fecha_fin_inscrip_pri DATE,
  fecha_inicio_inscrip DATE,
  fecha_fin_inscrip DATE,
  pilotos_min_inscrip INT,
  pilotos_max_inscrip INT,
  responsable VARCHAR(255),
  solo_usuarios_reg BOOLEAN,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_competitions_event_id ON competitions(event_id);

-- ============================================
-- 12. RACES
-- ============================================
CREATE TABLE IF NOT EXISTS races (
  race_id SERIAL PRIMARY KEY,
  competition_id INT REFERENCES competitions(competition_id),
  num_race INT,
  fecha DATE NOT NULL,
  hora TIME,
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_races_competition_id ON races(competition_id);

-- ============================================
-- 13. RACE_RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS race_results (
  result_id SERIAL PRIMARY KEY,
  race_id INT REFERENCES races(race_id),
  user_id INT REFERENCES users(user_id),
  posicion INT,
  vueltas INT,
  primera_linea BOOLEAN,
  vuelta_rapida BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_race_results_race_id ON race_results(race_id);
CREATE INDEX idx_race_results_user_id ON race_results(user_id);

-- ============================================
-- 14. REGISTRATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS registrations (
  registration_id SERIAL PRIMARY KEY,
  competition_id INT REFERENCES competitions(competition_id),
  user_id INT REFERENCES users(user_id),
  fecha_registro DATE DEFAULT CURRENT_DATE,
  estado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registrations_competition_id ON registrations(competition_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);

-- ============================================
-- 15. ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  rol_id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  pseudonimo VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 16. ENTITY_LINKS
-- ============================================
CREATE TABLE IF NOT EXISTS entity_links (
  entity_link_id SERIAL PRIMARY KEY,
  entity_name VARCHAR(100),
  entity_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 17. ROL_ENTITIES
-- ============================================
CREATE TABLE IF NOT EXISTS rol_entities (
  rol_entity_id SERIAL PRIMARY KEY,
  entity_link_id INT REFERENCES entity_links(entity_link_id),
  rol_id INT REFERENCES roles(rol_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 18. USER_ENTITIES
-- ============================================
CREATE TABLE IF NOT EXISTS user_entities (
  user_entity_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  entity_link_id INT REFERENCES entity_links(entity_link_id),
  rol_id INT REFERENCES roles(rol_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ✅ SCHEMA CREATION COMPLETE
-- ============================================
-- 18 tablas creadas exitosamente
