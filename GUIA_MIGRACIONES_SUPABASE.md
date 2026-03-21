# 📚 GUÍA PASO A PASO: Aplicar Migraciones SQL en Supabase

## 🎯 Objetivos
- Entender cómo funcionan las migraciones
- Aprender a aplicar cambios de BD manualmente
- Dominar el SQL editor de Supabase
- Realizar la migración sin errores

---

## 📋 PARTE 1: PREPARACIÓN

### Paso 1.1 - Obtener credenciales de Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu proyecto
3. En el menú izquierdo, ve a **Settings** → **Database**
4. Copia la **Connection String** (URI de conexión)

**Deberías ver algo como:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

✅ **Componentes importantes:**
- `postgres` = usuario por defecto
- `[PASSWORD]` = contraseña de superbuser
- `db.[PROJECT-ID].supabase.co` = host de Supabase
- `5432` = puerto PostgreSQL estándar
- `postgres` = base de datos por defecto

### Paso 1.2 - Verificar archivo de migración

**Abre:** `src/database/migrations/002-add-missing-entities.sql`

Este archivo contiene 10 sentencias CREATE TABLE para:
- levels
- groups
- scoring
- scoring_det
- rulebooks
- rules
- seasons
- venues
- circuits
- segments

✅ **Características del archivo:**
- Comentarios explicativos
- Índices de performance
- Foreign keys con ON DELETE CASCADE
- Restricciones UNIQUE
- Timestamps automáticos

---

## 📊 PARTE 2: OPCIÓN A - USANDO SQL EDITOR DE SUPABASE (RECOMENDADO)

### Paso 2.1 - Acceder al SQL Editor

1. En Supabase Dashboard, ve a **SQL Editor** (menú izquierdo)
2. Haz clic en **+ New Query** o **New SQL Snippet**
3. Dale un nombre: `Migration 002 - Add Missing Entities`

### Paso 2.2 - Copiar el SQL

1. Abre `src/database/migrations/002-add-missing-entities.sql`
2. **Selecciona TODO el contenido** (Ctrl+A)
3. **Cópialo** (Ctrl+C)
4. En el SQL Editor de Supabase, **pégalo** (Ctrl+V)

**Tu editor debería verse así:**
```sql
-- ============================================
-- 🗄️ CarRacesAPI - NUEVAS ENTIDADES
-- ============================================
-- Creada: 21 de Marzo, 2026
-- Para: PostgreSQL 12+ / Supabase

-- ============================================
-- 1. LEVELS
-- ============================================
CREATE TABLE IF NOT EXISTS levels (
  level_id SERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ... (más tablas) ...
```

### Paso 2.3 - Ejecutar la Migración

**IMPORTANTE: Hazlo por partes**

#### Opción A: Ejecutar todo de una vez (Riesgoso)

1. Selecciona **TODO el código** (Ctrl+A)
2. Haz clic en **"Run"** (botón azul ▶️)
3. Mira la salida en el panel inferior

⚠️ **Riesgo:** Si hay error a mitad, podrías tener tablas parcialmente creadas

#### Opción B: Ejecutar por bloques (RECOMENDADO)

1. **Selecciona el bloque 1** (tabla `levels`):
```sql
CREATE TABLE IF NOT EXISTS levels (
  level_id SERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_levels_descripcion ON levels(descripcion);
```

2. Haz clic en **Run** (o Ctrl+Enter)
3. Espera a ver ✅ o ❌
4. Repite para cada tabla

📊 **Orden recomendado** (para evitar errores de FK):
- ✅ levels (sin dependencias)
- ✅ groups (depende de divisions)
- ✅ scoring (depende de clubs)
- ✅ scoring_det (depende de scoring)
- ✅ rulebooks (depende de divisions, groups, clubs)
- ✅ rules (depende de rulebooks)
- ✅ seasons (depende de championships, rulebooks)
- ✅ venues (depende de clubs)
- ✅ circuits (depende de venues, surfaces, driving_environments)
- ✅ segments (depende de circuits)

### Paso 2.4 - Verificar Tablas Creadas

En el SQL Editor, ejecuta:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver estas nuevas tablas:
```
levels
groups
scoring
scoring_det
rulebooks
rules
seasons
venues
circuits
segments
```

✅ **¡Éxito!** Si ves todas las nuevas táblas

---

## 🖥️ PARTE 3: OPCIÓN B - USANDO PSQL (LÍNEA DE COMANDOS)

### Paso 3.1 - Instalar psql (si no lo tienes)

**En Windows:**
```powershell
# Descargar PostgreSQL Client Tools desde
# https://www.postgresql.org/download/windows/

# O usando Chocolatey:
choco install postgresql
```

**En macOS:**
```bash
brew install libpq
brew link --force libpq  # Para usar psql directamente
```

**En Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql-client
```

### Paso 3.2 - Verificar Conexión

```bash
# Reemplaza [HOST], [USER], [PASSWORD] con tus valores
psql -h db.zpjtezlpqipgozgdgyla.supabase.co \
     -U postgres \
     -d postgres \
     -c "SELECT version();"
```

**Esperado:**
```
version
─────────────────────────────────────
PostgreSQL 14.6 on x86_64-pc-linux-gnu, compiled by gcc (GCC) 9.4.0...
```

✅ **Si ves la versión:** Conexión exitosa

### Paso 3.3 - Ejecutar Migración

**Opción 1: Ejecutar archivo SQL directamente**
```bash
psql -h db.zpjtezlpqipgozgdgyla.supabase.co \
     -U postgres \
     -d postgres \
     -f src/database/migrations/002-add-missing-entities.sql
```

**Opción 2: Ejecutar desde el directorio del proyecto**
```bash
# Windows (PowerShell)
$env:PGPASSWORD="tu_contraseña"
psql -h db.zpjtezlpqipgozgdgyla.supabase.co -U postgres -d postgres -f src/database/migrations/002-add-missing-entities.sql

# macOS/Linux
PGPASSWORD="tu_contraseña" psql -h db.zpjtezlpqipgozgdgyla.supabase.co -U postgres -d postgres -f src/database/migrations/002-add-missing-entities.sql
```

### Paso 3.4 - Verificar Tablas desde psql

```bash
psql -h db.zpjtezlpqipgozgdgyla.supabase.co \
     -U postgres \
     -d postgres \
     -c "\dt public.*"
```

**Esperado:**
```
                List of relations
 Schema |      Name       | Type  |  Owner   
────────────────────────────────────────────
 public | championships  | table | postgres
 public | circuits       | table | postgres
 public | clubs          | table | postgres
 ... (más tablas) ...
 public | venues         | table | postgres
```

---

## 🔧 PARTE 4: OPCIÓN C - USANDO npm SCRIPT (AUTOMÁTICO)

### Paso 4.1 - Asegurar variables de entorno

**Verifica que `.env.test.supabase` tiene:**
```bash
BACKEND=supabase
SUPABASE_URL=https://zpjtezlpqipgozgdgyla.supabase.co
SUPABASE_KEY=sb_publishable_...
DB_HOST=zpjtezlpqipgozgdgyla.supabase.co
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=postgres
```

### Paso 4.2 - Ejecutar script

```bash
# Ejecutar archivo de migración específico
node run-migrations-supabase.js src/database/migrations/002-add-missing-entities.sql

# O ejecutar todas las migraciones
node run-migrations-supabase.js all

# O desde npm (si lo agregas a package.json)
npm run migrate:supabase
```

**Output esperado:**
```
📝 Leyendo migración: 002-add-missing-entities.sql
📏 Tamaño: 8 KB

🔗 Conectando a Supabase...
   Host: zpjtezlpqipgozgdgyla.supabase.co
   Usuario: postgres
   Base de datos: postgres
✅ Conexión exitosa a Supabase

📊 Total de statements SQL: 45

[1/45] Ejecutando...
   SQL: CREATE TABLE IF NOT EXISTS levels (...
   ✅ OK

[2/45] Ejecutando...
   SQL: CREATE INDEX idx_levels_descripcion ON levels(descripcion);
   ✅ OK

... (más statements) ...

========================================================
📊 RESUMEN DE MIGRACIÓN
========================================================
✅ Exitosos: 45
⚠️  Ignorados: 0
❌ Errores: 0
========================================================

✅ Migración completada exitosamente
```

---

## ✅ PARTE 5: VERIFICACIÓN Y VALIDACIÓN

### Paso 5.1 - Verificar Estructura

En Supabase SQL Editor, ejecuta:

```sql
-- Ver todas las nuevas tablas
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'levels', 'groups', 'scoring', 'scoring_det',
  'rulebooks', 'rules', 'seasons', 'venues',
  'circuits', 'segments'
)
ORDER BY table_name;
```

✅ **Resultado esperado:** 10 filas

### Paso 5.2 - Verificar Columnas

```sql
-- Verificar tabla 'seasons' como ejemplo
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'seasons'
ORDER BY ordinal_position;
```

✅ **Deberías ver columnas:**
- season_id (serial)
- championship_id (integer)
- descripcion (text)
- fecha_desde (date)
- fecha_hasta (date)
- pilotos_min (integer, NULL)
- pilotos_max (integer, NULL)
- solo_socios (boolean, default false)
- rulebook_id (integer, NULL)
- created_at (timestamp, default now)
- updated_at (timestamp, default now)

### Paso 5.3 - Verificar Índices

```sql
-- Ver índices creados
SELECT 
  indexname, 
  tablename,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
  'levels', 'groups', 'scoring', 'scoring_det',
  'rulebooks', 'rules', 'seasons', 'venues',
  'circuits', 'segments'
)
ORDER BY tablename, indexname;
```

✅ **Deberías ver:**
```
idx_levels_descripcion          | levels
idx_groups_division_id          | groups
idx_groups_club_id              | groups
idx_scoring_club_id             | scoring
... (más índices) ...
```

### Paso 5.4 - Verificar Foreign Keys

```sql
-- Ver constraints de Foreign Key
SELECT
  constraint_name,
  table_name,
  column_name,
  referenced_table_name,
  referenced_column_name
FROM information_schema.referential_constraints
WHERE constraint_schema = 'public'
ORDER BY table_name;
```

✅ **Deberías ver relaciones entre tablas**

---

## 🧪 PARTE 6: EJECUTAR TESTS

### Paso 6.1 - Asegurar env de Supabase

```bash
# Copia el archivo si no existe
cp .env.test.supabase .env.local
```

### Paso 6.2 - Ejecutar tests

```bash
# Tests de Supabase
npm run test:supabase

# Tests específicos de nuevas entidades
npm run test:supabase -- -t "Levels|Groups|Scoring|Rulebooks|Seasons|Venues|Circuits|Segments"
```

**Output esperado:**
```
✓ API Integration - Supabase Backend (45 tests)
  ✓ Health Check
  ✓ Levels
    ✓ should create a level
    ✓ should list levels
    ✓ should get level by id
    ✓ should update a level
    ✓ should delete a level
  ✓ Groups
    ✓ should create a group
    ... (más tests) ...

PASS  45 passed
```

✅ **¡Todos los tests pasan!**

---

## 🔄 PARTE 7: ROLLBACK (si algo sale mal)

### Opción 1: Eliminar tablas individuales

```sql
-- En Supabase SQL Editor, ejecuta:
DROP TABLE IF EXISTS segments CASCADE;
DROP TABLE IF EXISTS circuits CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS rules CASCADE;
DROP TABLE IF EXISTS rulebooks CASCADE;
DROP TABLE IF EXISTS scoring_det CASCADE;
DROP TABLE IF EXISTS scoring CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS levels CASCADE;
```

**IMPORTANTE:** El orden importa (dependencias inversa)

### Opción 2: Usar backup

Si tu Supabase tiene backups (versión PRO):
1. Ve a **Backups** en Supabase Dashboard
2. Haz clic en **Restore** en una versión anterior
3. Confirma el rollback

---

## 📚 RECURSOS Y REFERENCIAS

### Links útiles
- [Documentación de Supabase SQL Editor](https://supabase.com/docs/guides/database/tables)
- [PostgreSQL CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/sql-createindex.html)
- [Foreign Keys en PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)

### Comandos psql útiles

```bash
# Conectar a Supabase
psql postgresql://postgres:PASSWORD@HOST:5432/postgres

# Listar todas las tablas
\dt

# Ver estructura de tabla
\d table_name

# Ver índices
\di

# Ejecutar comando y salir
psql ... -c "SELECT * FROM users;"

# Ejecutar archivo SQL
psql ... -f archivo.sql
```

---

## 🎓 CONCEPTOS APRENDIDOS

### 1. **MIGRACIONES SQL**
- Archivos SQL versionados que cambian la BD
- Ejecutables múltiples veces sin errores (IF NOT EXISTS)
- Componibles y reversibles

### 2. **ÍNDICES**
- Aceleran búsquedas en columnas
- `CREATE INDEX idx_name ON table(column);`
- Reducen performance de INSERT pero mejoran SELECT

### 3. **FOREIGN KEYS**
- Relacionan tablas manteniendo integridad
- ON DELETE CASCADE elimina registros relacionados
- Previenen datos huérfanos

### 4. **CONSTRAINTS**
- UNIQUE: evita duplicados
- NOT NULL: obliga valores
- DEFAULT: valor automático

### 5. **TIMESTAMPS**
- created_at: cuándo se creó registro
- updated_at: última modificación
- Auditoría y debugging

---

## ⚡ TROUBLESHOOTING

### Error: "relation already exists"
```
Causa: La tabla ya existe
Solución: Usar CREATE TABLE IF NOT EXISTS (ya está en el archivo)
```

### Error: "Referential integrity constraint violation"
```
Causa: Foreign key apunta a tabla inexistente
Solución: Crear tablas en orden correcto (sin FK primero)
```

### Error: "Permission denied"
```
Causa: Usuario sin permisos
Solución: Usar user 'postgres' (superuser) o verificar credenciales
```

### Error: "Connection timeout"
```
Causa: Red lenta o host incorrecto
Solución: Verificar HOST, activar VPN si es necesario
```

---

## ✨ CONCLUSIÓN

¡Felicidades! Ahora dominas:
- ✅ Migraciones SQL en Supabase
- ✅ SQL Editor de Supabase
- ✅ Línea de comandos psql
- ✅ Scripts de automatización
- ✅ Verificación y validación
- ✅ Rollback y recuperación

**Próximos pasos:**
1. Ejecutar las migraciones en tu Supabase
2. Verificar que los tests pasan
3. Documentar cualquier cambio específico de tu proyecto

---

**Creado:** 21 de Marzo, 2026  
**Versión:** 1.0  
**Autor:** GitHub Copilot
