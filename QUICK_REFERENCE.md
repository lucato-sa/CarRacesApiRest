# ⚡ QUICK REFERENCE - Las 10 Nuevas Entidades

## 📌 Acceso Rápido a los Endpoints

```
POST   /levels              # Crear nivel
GET    /levels              # Listar niveles
GET    /levels/:id          # Obtener nivel
PUT    /levels/:id          # Actualizar nivel
DELETE /levels/:id          # Eliminar nivel

POST   /groups              # Crear grupo
GET    /groups              # Listar grupos
GET    /groups/:id          # Obtener grupo
PUT    /groups/:id          # Actualizar grupo
DELETE /groups/:id          # Eliminar grupo

POST   /scoring             # Crear sistema de puntuación
GET    /scoring             # Listar sistemas
GET    /scoring/:id         # Obtener sistema
PUT    /scoring/:id         # Actualizar sistema
DELETE /scoring/:id         # Eliminar sistema

POST   /scoring-det         # Crear puntos por posición
GET    /scoring-det         # Listar detalles
GET    /scoring-det/:id     # Obtener detalle
PUT    /scoring-det/:id     # Actualizar
DELETE /scoring-det/:id     # Eliminar

POST   /rulebooks           # Crear reglamento
GET    /rulebooks           # Listar reglamentos
GET    /rulebooks/:id       # Obtener reglamento
PUT    /rulebooks/:id       # Actualizar
DELETE /rulebooks/:id       # Eliminar

POST   /rules               # Crear regla
GET    /rules               # Listar reglas
GET    /rules/:id           # Obtener regla
PUT    /rules/:id           # Actualizar regla
DELETE /rules/:id           # Eliminar regla

POST   /seasons             # Crear temporada
GET    /seasons             # Listar temporadas
GET    /seasons/:id         # Obtener temporada
PUT    /seasons/:id         # Actualizar
DELETE /seasons/:id         # Eliminar

POST   /venues              # Crear sede
GET    /venues              # Listar sedes
GET    /venues/:id          # Obtener sede
PUT    /venues/:id          # Actualizar sede
DELETE /venues/:id          # Eliminar sede

POST   /circuits            # Crear circuito
GET    /circuits            # Listar circuitos
GET    /circuits/:id        # Obtener circuito
PUT    /circuits/:id        # Actualizar
DELETE /circuits/:id        # Eliminar

POST   /segments            # Crear tramo
GET    /segments            # Listar tramos
GET    /segments/:id        # Obtener tramo
PUT    /segments/:id        # Actualizar tramo
DELETE /segments/:id        # Eliminar tramo
```

---

## 📊 Ejemplo de Datos

### Level
```json
{
  "levelId": 1,
  "descripcion": "Principiante"
}
```

### Group
```json
{
  "groupId": 1,
  "divisionId": 2,
  "descripcion": "Grupo A - Slot Car Analogico",
  "clubId": 5,
  "default": false
}
```

### Scoring
```json
{
  "scoringId": 1,
  "descripcion": "Sistema Puntuación 2026",
  "clubId": 5,
  "ultPosPuntos": 15,
  "puntosDefecto": 0
}
```

### ScoringDet
```json
{
  "scoringDetId": 1,
  "scoringId": 1,
  "posicion": 1,
  "puntos": 25
}
```

### Rulebook
```json
{
  "rulebookId": 1,
  "descripcion": "Reglamento 2026",
  "fechaInicioValido": "2026-01-01",
  "fechaFinValido": "2026-12-31",
  "divisionId": 2,
  "groupId": 1,
  "clubId": null
}
```

### Rule
```json
{
  "ruleId": 1,
  "rulebookId": 1,
  "ruleCode": "REGLA-001",
  "descripcion": "Mínimo de pilotos para carrera: 3"
}
```

### Season
```json
{
  "seasonId": 1,
  "championshipId": 1,
  "descripcion": "Temporada 2026",
  "fechaDesde": "2026-05-15",
  "fechaHasta": "2026-09-30",
  "pilotosMin": 3,
  "pilotosMax": 20,
  "soloSocios": false,
  "rulebookId": 1
}
```

### Venue
```json
{
  "venueId": 1,
  "clubId": 5,
  "alias": "Sede Principal",
  "sedeSocial": true,
  "sedeCarreras": true,
  "direccion": "Calle 123",
  "localidad": "Madrid",
  "provincia": "Madrid",
  "pais": "España",
  "mapLatitud": "40.4168",
  "mapLongitud": "-3.7038"
}
```

### Circuit
```json
{
  "circuitId": 1,
  "venueId": 1,
  "surfaceId": 1,
  "drivingEnviromentId": 2,
  "alias": "Pista 1",
  "descripcion": "Analogo 4 carriles",
  "longitud": "15.50",
  "permanente": true,
  "totSegments": 3,
  "slotAnalogic": true,
  "slotDigital": false,
  "slotTotLanes": 4
}
```

### Segment
```json
{
  "segmentId": 1,
  "circuitId": 1,
  "alias": "Recta Principal",
  "numSegment": 1,
  "numLane": 1,
  "totSections": 5,
  "longitud": "5.50"
}
```

---

## 🔗 Relaciones

```
Levels          (tabla independiente)
Groups          → Divisions
Scoring         → Clubs
ScoringDet      → Scoring
Rulebooks       → Divisions, Groups, Clubs
Rules           → Rulebooks
Seasons         → Championships, Rulebooks
Venues          → Clubs
Circuits        → Venues, Surfaces, DrivingEnvironments
Segments        → Circuits
Competitions    → Seasons, Venues (ahora)
```

---

## 🧪 Ejecutar Tests

```bash
# Todos los tests de Supabase
npm run test:supabase

# Solo tests de nuevas entidades
npm run test:supabase -- -t "Levels|Groups|Scoring|Rulebooks|Seasons|Venues|Circuits|Segments"

# Tests detallados (con output completo)
npm run test:supabase -- --reporter=verbose

# Cobertura (si está configurada)
npm run test:supabase -- --coverage
```

---

## 🚀 Ejecutar Migraciones

```bash
# Migración específica
node run-migrations-supabase.js src/database/migrations/002-add-missing-entities.sql

# Con debug
node run-migrations-supabase.js src/database/migrations/002-add-missing-entities.sql --debug

# Desde npm (si quieres agregarlo a package.json)
npm run migrate:supabase
```

---

## 🔧 Verificaciones Rápidas en Supabase

**Ver todas las tablas:**
```sql
\dt
```

**Ver estructura de tabla:**
```sql
\d venues
```

**Ver índices:**
```sql
\di

Ver foreign keys:**
```sql
SELECT constraint_name, table_name, column_name, referenced_table_name, referenced_column_name
FROM information_schema.referential_constraints
WHERE constraint_schema = 'public';
```

**Contar registros:**
```sql
SELECT 'levels' as tabla, COUNT(*) FROM levels
UNION ALL SELECT 'groups', COUNT(*) FROM groups
UNION ALL SELECT 'venues', COUNT(*) FROM venues
UNION ALL SELECT 'circuits', COUNT(*) FROM circuits;
```

---

## 📝 Crear Datos de Prueba

```sql
-- Insertar nivel
INSERT INTO levels (descripcion) VALUES ('Principiante');

-- Insertar grupo (requiere division_id existente)
INSERT INTO groups (division_id, descripcion) VALUES (1, 'Grupo A');

-- Insertar sistema de puntuación
INSERT INTO scoring (descripcion) VALUES ('Sistema 2026');

-- Insertar puntos por posición
INSERT INTO scoring_det (scoring_id, posicion, puntos) VALUES (1, 1, 25), (1, 2, 18);

-- Insertar reglamento
INSERT INTO rulebooks (descripcion, fecha_inicio_valido) VALUES ('Reglamento 2026', '2026-01-01');

-- Insertar regla
INSERT INTO rules (rulebook_id, rule_code, descripcion) VALUES (1, 'REGLA-001', 'Mínimo 3 pilotos');

-- Insertar temporada (requiere championship_id)
INSERT INTO seasons (championship_id, descripcion, fecha_desde, fecha_hasta) VALUES (1, 'Temporada 2026', '2026-05-15', '2026-09-30');

-- Insertar sede (requiere club_id)
INSERT INTO venues (club_id, alias) VALUES (1, 'Sede Principal');

-- Insertar circuito (requiere venue_id)
INSERT INTO circuits (venue_id, alias) VALUES (1, 'Pista 1');

-- Insertar tramo (requiere circuit_id)
INSERT INTO segments (circuit_id, alias, num_segment) VALUES (1, 'Recta', 1);
```

---

## ⚠️ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `relation "X" does not exist` | Tabla no creada | Ejecutar migración |
| `foreign key constraint violation` | FK inválida | Verificar IDs existen |
| `duplicate key value` | Primary key duplicado | Usar serial/auto-increment |
| `syntax error at or near` | Error en SQL | Verificar palabras reservadas |
| `connection refused` | BD no disponible | Verificar credenciales |

---

## 📚 Archivos Importantes

```
src/database/migrations/
└── 002-add-missing-entities.sql      (40 sentencias SQL)

src/levels/, src/groups/, ... /
├── models/*.model.ts                 (10 modelos)
└── *.repository.ts                   (10 repositorios)

__tests__/
├── cases/testCases.ts                (8 suites)
└── integration/api.*.test.ts         (~90 tests)

Raíz del proyecto:
├── GUIA_MIGRACIONES_SUPABASE.md      (paso a paso)
├── MIGRACION_SUPABASE_COMPLETADA.md  (resumen técnico)
└── RESUMEN_MIGRACION_ENTIDADES.md    (descripción completa)

run-migrations-supabase.js             (automatización)
```

---

## 🎯 Checklist de Verificación

- [ ] ¿Se ejecutó la migración correctamente?
  ```bash
  node run-migrations-supabase.js src/database/migrations/002-add-missing-entities.sql
  ```

- [ ] ¿Existen las 10 tablas en Supabase?
  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_schema='public';
  ```

- [ ] ¿Se crean los índices?
  ```sql
  \di
  ```

- [ ] ¿Los tests pasan?
  ```bash
  npm run test:supabase
  ```

- [ ] ¿Puedo crear un registro?
  ```bash
  curl -X POST http://localhost:3000/levels -H "Content-Type: application/json" -d '{"descripcion":"Test"}'
  ```

---

## 💡 Tips

1. **Usar IF NOT EXISTS** - Permite ejecutar migraciones múltiples veces sin errores
2. **Índices en FK** - Acelera búsquedas por relaciones
3. **Cascadas** - ON DELETE CASCADE automáticamente elimina hijos
4. **Timestamps** - created_at y updated_at para auditoría
5. **Test primero** - Ejecuta tests después de cada cambio

---

## 🆘 Soporte

- **Migración falla:** Ver [GUIA_MIGRACIONES_SUPABASE.md](GUIA_MIGRACIONES_SUPABASE.md)
- **Test falla:** Verificar minúsculas en nombres (snake_case en BD)
- **Endpoint no existe:** Revisar carpeta src/ y server.ts
- **Datos no aparecen:** Verificar timestamps y transacciones

---

**Última actualización:** 21 Marzo 2026  
**Status:** ✅ Operacional  
**Versión:** 1.0

---

### 🎉 ¡Listo para usar! Prueba ahora:

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Ejecutar tests
npm run test:supabase

# Terminal 3: Crear datos
curl -X POST http://localhost:3000/levels -H "Content-Type: application/json" -d '{"descripcion":"Principiante"}'
```
