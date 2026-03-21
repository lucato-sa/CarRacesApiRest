# 📋 Propuesta de Cambios: Entidades Faltantes

## Resumen
Se han identificado **10 entidades** pendientes de agregar al proyecto según la documentación inicial. Se han creado las estructuras siguiendo el patrón de `clubs` con:
- ✅ Modelos TypeScript (interfaces DTO + tipos BD)
- ✅ Repositorios con CRUD SQL nativo

---

## 📊 Entidades Agregadas

### 1. **Groups** (Grupos)
**Descripción:** Subclasificación de divisiones con relación a clubs.

| Campo | Tipo | Relación |
|-------|------|----------|
| GroupId | PrimaryKey | - |
| Descripcion | string | Requerido |
| DivisionId | ForeignKey | ➜ divisions |
| ClubId | ForeignKey | ➜ clubs (opcional) |
| Default | boolean | Opcional |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByDivisionId()`, `getByClubId()`
- `create()`, `update()`, `delete()`

---

### 2. **Levels** (Niveles)
**Descripción:** Clasificación de niveles de competencia.

| Campo | Tipo | Relación |
|-------|------|----------|
| LevelId | PrimaryKey | - |
| Descripcion | string | Requerido |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `create()`, `update()`, `delete()`

---

### 3. **Scoring** (Puntuaciones)
**Descripción:** Define sistemas de puntuación para competencias.

| Campo | Tipo | Relación |
|-------|------|----------|
| ScoringId | PrimaryKey | - |
| Descripcion | string | Requerido |
| ClubId | ForeignKey | ➜ clubs (opcional) |
| UltPosPuntos | number | Puntos última posición |
| PuntosDefecto | number | Puntos por defecto |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByClubId()`
- `create()`, `update()`, `delete()`

---

### 4. **ScoringDet** (Detalles de Puntuación)
**Descripción:** Detalle de puntos por posición en cada sistema de puntuación.

| Campo | Tipo | Relación |
|-------|------|----------|
| ScoringDetId | PrimaryKey | - |
| ScoringId | ForeignKey | ➜ scoring |
| Posicion | number | Requerido |
| Puntos | number | Requerido |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByScoringId()`
- `create()`, `update()`, `delete()`

---

### 5. **Rulebooks** (Reglamentos)
**Descripción:** Conjunto de reglas para divisiones, grupos o clubs.

| Campo | Tipo | Relación |
|-------|------|----------|
| RulebookId | PrimaryKey | - |
| Descripcion | string | Requerido |
| FechaInicioValido | date | Requerido |
| FechaFinValido | date | Opcional |
| DivisionId | ForeignKey | ➜ divisions (opcional) |
| GroupId | ForeignKey | ➜ groups (opcional) |
| ClubId | ForeignKey | ➜ clubs (opcional) |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByClubId()`
- `create()`, `update()`, `delete()`

---

### 6. **Rules** (Reglas)
**Descripción:** Reglas individuales dentro de un reglamento.

| Campo | Tipo | Relación |
|-------|------|----------|
| RuleId | PrimaryKey | - |
| RulebookId | ForeignKey | ➜ rulebooks |
| RuleCode | string | Código único |
| Descripcion | string | Requerido |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByRulebookId()`
- `create()`, `update()`, `delete()`

---

### 7. **Seasons** (Temporadas)
**Descripción:** Planificación de campeonatos dentro de períodos de fechas.

| Campo | Tipo | Relación |
|-------|------|----------|
| SeasonId | PrimaryKey | - |
| ChampionshipId | ForeignKey | ➜ championships |
| Descripcion | string | Requerido |
| FechaDesde | date | Requerido |
| FechaHasta | date | Requerido |
| PilotosMin | number | Opcional |
| PilotosMax | number | Opcional |
| SoloSocios | boolean | Opcional |
| RulebookId | ForeignKey | ➜ rulebooks (opcional) |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByChampionshipId()`
- `create()`, `update()`, `delete()`

---

### 8. **Venues** (Sedes)
**Descripción:** Sedes o ubicaciones de los clubs donde se celebran carreras.

| Campo | Tipo | Relación |
|-------|------|----------|
| VenueId | PrimaryKey | - |
| ClubId | ForeignKey | ➜ clubs |
| Alias | string | Requerido |
| SedeSocial | boolean | Opcional |
| SedeCarreras | boolean | Opcional |
| Direccion | string | Opcional |
| Localidad | string | Opcional |
| Provincia | string | Opcional |
| Pais | string | Opcional |
| MapLatitud | decimal | Opcional |
| MapLongitud | decimal | Opcional |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByClubId()`
- `create()`, `update()`, `delete()`

---

### 9. **Circuits** (Circuitos)
**Descripción:** Circuitos dentro de cada sede de club.

| Campo | Tipo | Relación |
|-------|------|----------|
| CircuitId | PrimaryKey | - |
| VenueId | ForeignKey | ➜ venues |
| SurfaceId | ForeignKey | ➜ surfaces (opcional) |
| DrivingEnviromentId | ForeignKey | ➜ drivingenviroments (opcional) |
| Alias | string | Requerido |
| Descripcion | string | Opcional |
| Longitud | decimal | Metros |
| Permanente | boolean | Es permanente |
| TotSegments | number | Total de tramos |
| SlotAnalogic | boolean | Slot analógico |
| SlotDigital | boolean | Slot digital |
| SlotTotLanes | number | Cariles totales |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByVenueId()`
- `create()`, `update()`, `delete()`

---

### 10. **Segments** (Tramos)
**Descripción:** Secciones o subcircuitos dentro de un circuito.

| Campo | Tipo | Relación |
|-------|------|----------|
| SegmentId | PrimaryKey | - |
| CircuitId | ForeignKey | ➜ circuits |
| Alias | string | Nombre del tramo |
| NumSegment | number | Número de tramo |
| NumLane | number | Número de carril (opcional) |
| TotSections | number | Total de secciones |
| Longitud | decimal | Metros |
| CreatedAt/UpdatedAt | Timestamps | Auditoría |

**Métodos Repository:**
- `getAll()`, `getById()`, `getByCircuitId()`
- `create()`, `update()`, `delete()`

---

## 📁 Estructura de Carpetas Creadas

```
src/
├── groups/
│   ├── models/
│   │   └── group.model.ts
│   └── repository/
│       └── group.repository.ts
├── levels/
│   ├── models/
│   │   └── level.model.ts
│   └── repository/
│       └── level.repository.ts
├── scoring/
│   ├── models/
│   │   └── scoring.model.ts
│   └── repository/
│       └── scoring.repository.ts
├── scoringdet/
│   ├── models/
│   │   └── scoringdet.model.ts
│   └── repository/
│       └── scoringdet.repository.ts
├── rulebooks/
│   ├── models/
│   │   └── rulebook.model.ts
│   └── repository/
│       └── rulebook.repository.ts
├── rules/
│   ├── models/
│   │   └── rule.model.ts
│   └── repository/
│       └── rule.repository.ts
├── seasons/
│   ├── models/
│   │   └── season.model.ts
│   └── repository/
│       └── season.repository.ts
├── venues/
│   ├── models/
│   │   └── venue.model.ts
│   └── repository/
│       └── venue.repository.ts
├── circuits/
│   ├── models/
│   │   └── circuit.model.ts
│   └── repository/
│       └── circuit.repository.ts
└── segments/
    ├── models/
    │   └── segment.model.ts
    └── repository/
        └── segment.repository.ts
```

---

## ✨ Características de Implementación

### Modelos TypeScript
- ✅ Interfaces DTOs con PascalCase (comunicación API)
- ✅ Interfaces Row con snake_case (datos de BD)
- ✅ Tipos `Create*Input` (omiten ID y timestamps)
- ✅ Tipos `Update*Input` (parciales, sin ID ni timestamps)

### Repositorios
- ✅ Métodos CRUD completos (getAll, getById, create, update, delete)
- ✅ Métodos de búsqueda específicos (getByForeignKey)
- ✅ Mapeo automático con `dbToDto` entre snake_case y PascalCase
- ✅ Validación de campos requeridos
- ✅ Parámetrizados SQL para prevenir inyecciones
- ✅ Timestamps de auditoría (created_at, updated_at)

---

## 📌 Próximos Pasos Necesarios

### 1. **Crear Migraciones de BD SQL**
   - Crear tablas en PostgreSQL con columnas según especificación
   - Establecer relaciones (ForeignKeys)
   - Crear índices necesarios

### 2. **Implementar Controladores (Controllers)**
   - REST endpoints para cada entidad
   - Validación de entrada
   - Manejo de errores

### 3. **Actualizar IBackend Interface**
   - Agregar métodos para las nuevas entidades
   - Adaptadores para FileBackend si es necesario

### 4. **Crear Test Cases**
   - Tests de repositorios
   - Tests de integración API
   - Fixtures de datos

### 5. **Documentación OpenAPI**
   - Esquemas para cada entidad
   - Endpoints REST
   - Ejemplos de request/response

---

## 🔗 Relaciones de Integridad Referencial

```
Championships
    ├── Season (∞)
    │   ├── Rulebook
    │   └── Competition
    │       └── Race
    │           └── RaceResult
    │
    └── Club
        ├── Venue
        │   └── Circuit
        │       └── Segment (∞)
        ├── Group
        ├── Scoring
        │   └── ScoringDet (∞)
        └── Rulebook
            └── Rule (∞)

Division
    └── Group (∞)
        ├── Club (opcional)
        └── Rulebook
```

---

## ✅ Validación y Testing

**Campos Requeridos por Entidad:**

| Entidad | Campos Requeridos |
|---------|------------------|
| Group | Descripcion, DivisionId |
| Level | Descripcion |
| Scoring | Descripcion |
| ScoringDet | ScoringId, Posicion, Puntos |
| Rulebook | Descripcion, FechaInicioValido |
| Rule | RulebookId, RuleCode, Descripcion |
| Season | ChampionshipId, Descripcion, FechaDesde, FechaHasta |
| Venue | ClubId, Alias |
| Circuit | VenueId, Alias |
| Segment | CircuitId, Alias, NumSegment |

---

## 📝 Notas Importantes

1. **Mapeo de Campos:** Se usa la función `dbToDto()` para convertir automáticamente entre snake_case (BD) y PascalCase (API).

2. **Timestamps:** Todas las entidades incluyen `created_at` y `updated_at` para auditoría.

3. **Valores por Defecto:**
   - `Default` campos: defaults a `false`
   - `boolean` campos: defaults a `false`
   - `number` campos: defaults a `null`
   - Relaciones opcionales: defaults a `null`

4. **Parámetros Dinámicos:** Los repositorios usan parámetros nombrados ($1, $2, etc.) para seguridad SQL.

5. **Consistencia:** Todos siguen el patrón de `clubs` para facilitar mantenimiento.

---

**Estado:** ✅ Propuesta lista para review  
**Fecha:** 2026-03-21  
**Próximo paso:** Crear migraciones de BD SQL
