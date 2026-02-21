# CarRaces API - Especificación OpenAPI

Documentación completa de la API REST para gestión de campeonatos, clubes, circuitos y usuarios en el entorno del automovilismo.

## 📋 Contenido

- **openapi.yaml**: Especificación OpenAPI 3.0.3 con todos los endpoints, esquemas, ejemplos y parámetros de filtrado/paginación.
- **Validación**: El archivo ha sido validado con `swagger-cli` (exit code 0).

## 🚀 Cómo usar la especificación

### 1. Con Swagger UI (Online)

Accede a [Swagger Editor](https://editor.swagger.io) y carga el archivo `openapi.yaml`:
- Ve a **File** > **Import URL** y pega la URL de tu repositorio (si está público).
- O **File** > **Import File** y selecciona `openapi.yaml` localmente.

### 2. Con Swagger UI (Local)

Instala y ejecuta Swagger UI localmente:

```bash
npm install -g swagger-ui-express express
npx swagger-ui --help
# O descarga el archivo Docker:
docker run -p 80:8080 -e SWAGGER_JSON=/foo/openapi.yaml -v $(pwd):/foo swaggerapi/swagger-ui
```

### 3. Con Swagger CLI (Validación)

```bash
npm install -g @apidevtools/swagger-cli
swagger-cli validate openapi.yaml
```

Resultado esperado: ✅ **Valid** (sin errores).

### 4. Con herramientas IDE

- **VS Code**: Instala la extensión [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)
- **IntelliJ IDEA**: Soporte nativo para OpenAPI 3.0

---

## 📦 Estructura del OpenAPI

### Componentes principales

#### 1. **Esquemas (Schemas)**
Define todas las entidades del modelo de datos:
- Entidades CRUD: `DrivingEnviroment`, `Speciality`, `Format`, `Surface`, `Discipline`, `Division`, `Group`, `Level`, `Scoring`, `Championship`, `Rulebook`, `Rule`, `Season`, `Club`, `Venue`, `Circuit`, `Segment`, `Event`, `Competition`, `Registration`, `Race`, `RaceResult`.
- Entidades de configuración: `EntityLink`, `Rol`, `RolEntity`.
- Entidades de usuario: `User`, `UserEntity`.

Cada esquema incluye:
- Tipos de datos y validaciones.
- Campos requeridos.
- Ejemplos de datos.

#### 2. **Parámetros comunes**
Reutilizables en los endpoints:
- `page`: Número de página (1-based, default: 1).
- `pageSize`: Elementos por página (1-100, default: 20).
- `q`: Búsqueda de texto completo.
- `sort`: Expresión de ordenamiento (e.g. `Alias:asc`, `FechaDesde:desc`).
- `filterClubId`, `filterDisciplineId`: Filtros específicos.

#### 3. **Endpoints (Paths)**

**Estructura general:**
- `GET /resource`: Listar con paginación y filtros.
- `POST /resource`: Crear.
- `GET /resource/{id}`: Obtener por ID (donde aplica).
- `PUT /resource/{id}`: Actualizar (solo para Race y RaceResult).
- `DELETE /resource/{id}`: Eliminar (solo para entidades base).

**Respuestas paginadas:**
```json
{
  "total": 5,
  "page": 1,
  "pageSize": 20,
  "items": [...]
}
```

---

## 📝 Ejemplos de uso

### Crear un Club

**Request:**
```bash
curl -X POST http://localhost:3000/api/clubs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "Alias": "ClubRacing",
    "TaxNombre": "Racing SL",
    "TaxNumero": "B12345678",
    "Descripcion": "Club de pruebas",
    "FechaFundacion": "1995-06-15"
  }'
```

**Response (201 Created):**
```json
{
  "ClubId": 1,
  "Alias": "ClubRacing",
  "TaxNombre": "Racing SL",
  "TaxNumero": "B12345678",
  "Descripcion": "Club de pruebas",
  "FechaFundacion": "1995-06-15",
  "FechaRegistro": "2026-02-21"
}
```

### Listar Disciplinas (filtrar por especialidad)

**Request:**
```bash
curl "http://localhost:3000/api/disciplines?specialityId=1&page=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "total": 5,
  "page": 1,
  "pageSize": 10,
  "items": [
    {
      "DisciplineId": 1,
      "Alias": "Asfalto",
      "Descripcion": "1.1 Asfalto",
      "SpecialityId": 1,
      "FormatId": 1,
      "SurfaceId": 1,
      "default": true
    }
  ]
}
```

### Crear un Usuario

**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "Nick": "piloto7",
    "Nombre": "Juan",
    "Apellidos": "Pérez",
    "Email": "juan.perez@example.com"
  }'
```

**Response (201 Created):**
```json
{
  "UserId": 7,
  "Nick": "piloto7",
  "Nombre": "Juan",
  "Apellidos": "Pérez",
  "Email": "juan.perez@example.com",
  "FechaRegistro": "2026-02-21"
}
```

### Actualizar resultados de carrera

**Request:**
```bash
curl -X PUT http://localhost:3000/api/raceresults/50 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "RaceId": 200,
    "Posicion": 1,
    "UserId": 7,
    "Laps": 12,
    "Pole": false,
    "FastLap": true
  }'
```

**Response (200 OK):**
```json
{
  "RaceResultId": 50,
  "RaceId": 200,
  "Posicion": 1,
  "UserId": 7,
  "Laps": 12,
  "NumSegment": 0,
  "Pole": false,
  "FastLap": true
}
```

---

## 🔐 Autenticación

La API utiliza **Bearer Token (JWT)** en todos los endpoints (excepto configuración de solo lectura):

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Endpoints de lectura pura (sin autenticación requerida en desarrollo):
- `GET /entitylinks`
- `GET /roles`
- `GET /levels`

---

## 📊 Validaciones principales

Según los requisitos funcionales, la API valida:

### DrivingEnviroment / Speciality / Discipline
- Alias/Descripción únicos (case-insensitive).
- Registros con `default=true` no pueden editarse.

### Division / Group
- Descripción única por disciplina/división (excepto entre clubes diferentes).
- Alias único en circuitos del mismo club.

### Scoring
- Posiciones secuenciales (1 hasta `UltPosPuntos` sin saltos).
- Descripción única por club.

### Championship
- Todas las FK referenciadas deben existir.
- Filtros en cascada: `speciality` → `discipline` → `division` → `group`.

### Season
- Fechas no se pueden solapar en mismo campeonato.
- `FechaHasta > FechaDesde`.
- `PilotosMax >= PilotosMin >= 0`.

### Venue
- Solo una sede social (`SedeSocial=true`) por club.
- Coordenadas geográficas válidas (si no son 0).

### Event
- Fechas válidas (`FechaInicio < FechaFin`, `FechaInicio >= hoy`).

### Competition
- Responsable debe ser usuario registrado.
- `TotalRaces > 0`.
- Alias único por temporada.

### Circuit
- `TotSegments > 0`.
- Si es "Slot": `SlotTotLanes > 0` y al menos `SlotAnalogic` o `SlotDigital`.

---

## 🔗 Relaciones clave

```
DrivingEnviroment
├── Speciality
│   ├── Discipline
│   │   ├── Division
│   │   │   └── Group
│   │   │       └── Championship
│   │   │           └── Season
│   │   │               └── Competition
│   │   │                   ├── Registration (User)
│   │   │                   └── Race
│   │   │                       └── RaceResult (User)
│   │   └── Circuit (Venue)
│   │       └── Segment
│   └── Rulebook
│       └── Rule
├── Club
│   ├── Venue
│   │   └── Circuit
│   └── Scoring
└── UserEntity (User + Role + Entity)
```

---

## 🛠️ Desarrollo local

### 1. Validar el YAML

```bash
swagger-cli validate openapi.yaml
```

Resultado: ✅ **Valid** (Sin errores de sintaxis o estructura)

### 2. Generar stubs de servidor (Node.js/Express)

Usando [Swagger Codegen](https://swagger.io/tools/swagger-codegen/):

```bash
docker run --rm -v ${PWD}:/local swaggerapi/swagger-codegen-cli generate \
  -i /local/openapi.yaml \
  -l nodejs-express-server \
  -o /local/generated-server
```

### 3. Servir la documentación con Swagger UI

```bash
npx http-server . -p 8000
# Abre http://localhost:8000/swagger-ui.html
```

---

## 📋 Cambios realizados desde documentación de diseño

1. ✅ **Corregido typo**: `Rolebook` → `Rulebook` en modelo y requisitos.
2. ✅ **Entidad agregada**: `Venue` (ya en modelo y requisitos).
3. ✅ **Entidades de configuración**: `Rol`, `EntityLink`, `RolEntity` (documentadas).
4. ✅ **Parámetros de paginación**: Añadidos en endpoints GET principales.
5. ✅ **Ejemplos**: Incluidos en esquemas clave (`Club`, `User`, `Competition`, `RaceResult`).
6. ✅ **Filtros en cascada**: Soportados en `Discipline`, `Division`, `Championship`.

---

## 📞 Contacto / Soporte

- **Repositorio**: [lucato-sa/CarRacesApiRest](https://github.com/lucato-sa/CarRacesApiRest)
- **Rama**: `main`
- **Fecha de validación**: 2026-02-21
- **Versión OpenAPI**: 3.0.3

---

## 📄 Licencia

Especificación interna del proyecto CarRaces API. Derechos reservados.
