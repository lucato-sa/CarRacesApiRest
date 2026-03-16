# 🔧 CONFIGURACIÓN Y CAMBIOS NECESARIOS - __tests__/integration

## 📍 CAMBIOS EN ARCHIVOS EXISTENTES

### 1. `vitest.config.ts` - Actualizar configuración

**Cambio necesario:**

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    
    // Cargar setup global
    setupFiles: ['__tests__/setup.ts'],
    
    // Incluir todos los tests en __tests__
    include: ['__tests__/**/*.test.ts'],
    
    // Excluir directorios que no son tests
    exclude: ['node_modules', 'dist', '**/*.spec.ts'],
    
    // Configurar backend a usar
    env: {
      BACKEND: process.env.BACKEND || 'memory',
    },
    
    // Timeout aumentado para tests de DB
    testTimeout: 10000,
    
    // Coverage (opcional)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        'dist/',
      ]
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './__tests__'),
    }
  }
})
```

---

### 2. `package.json` - Agregar scripts

**Scripts a agregar:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    
    "test:memory": "BACKEND=memory vitest",
    "test:memory:watch": "BACKEND=memory vitest --watch",
    
    "test:file": "BACKEND=file vitest",
    "test:file:watch": "BACKEND=file vitest --watch",
    
    "test:postgres": "BACKEND=postgres vitest",
    "test:postgres:watch": "BACKEND=postgres vitest --watch",
    
    "test:supabase": "BACKEND=supabase vitest",
    "test:supabase:watch": "BACKEND=supabase vitest --watch",
    
    "test:oracle": "BACKEND=oracle vitest",
    "test:oracle:watch": "BACKEND=oracle vitest --watch",
    
    "test:all": "npm run test:memory && npm run test:file && npm run test:postgres && npm run test:supabase && npm run test:oracle",
    
    "test:coverage": "vitest --coverage",
    
    "test:ci": "vitest --run --reporter=json --outputFile=test-results.json"
  }
}
```

---

### 3. `__tests__/setup.ts` - Actualizar archivo de setup

**Contenido actualizado:**

```typescript
import 'reflect-metadata'
import { config } from 'dotenv'

/**
 * Setup global para todos los tests
 * - Cargar reflect-metadata para TypeORM
 * - Cargar variables de entorno según el backend
 * - Configurar timeouts globales
 */

// Detectar backend
const backend = process.env.BACKEND || 'memory'
const envFile = `.env.test.${backend}`

// Cargar .env específico del backend
config({ path: envFile })

console.log('═══════════════════════════════════════════')
console.log('✅ Test Environment Setup')
console.log('═══════════════════════════════════════════')
console.log(`📦 Backend: ${backend.toUpperCase()}`)
console.log(`📄 Config: ${envFile}`)
console.log(`🌍 Database: ${process.env.DB_HOST || 'memory'}`)
console.log('═══════════════════════════════════════════')

// Configurar timeout global para pruebas lentas
global.testTimeout = 10000

// Hook: Antes de todos los tests
beforeAll(async () => {
  console.log(`\n🚀 Starting ${backend} backend tests...\n`)
})

// Hook: Después de todos los tests
afterAll(async () => {
  console.log(`\n✅ ${backend} tests completed.\n`)
})
```

---

### 4. Crear archivos `.env.test.*` para cada backend

#### `.env.test.memory`

```env
# Memory Backend (Sin persistencia)
BACKEND=memory
NODE_ENV=test
LOG_LEVEL=warn
```

#### `.env.test.file`

```env
# File Backend (JSON files)
BACKEND=file
NODE_ENV=test
DATA_DIR=./test-data/file
LOG_LEVEL=warn
```

#### `.env.test.postgres`

```env
# PostgreSQL Backend
BACKEND=postgres
NODE_ENV=test
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=test_user
DB_PASSWORD=test_password
DB_NAME=apicarraces_test
DB_SYNCHRONIZE=true
DB_LOGGING=false
LOG_LEVEL=warn
```

#### `.env.test.supabase`

```env
# Supabase Backend
BACKEND=supabase
NODE_ENV=test
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY_ANON=your-anon-key
SUPABASE_KEY_SERVICE=your-service-key
LOG_LEVEL=warn
```

#### `.env.test.oracle`

```env
# Oracle Backend
BACKEND=oracle
NODE_ENV=test
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_USER=testuser
ORACLE_PASSWORD=testpass
ORACLE_SERVICE=orcl
LOG_LEVEL=warn
```

---

## 📁 ESTRUCTURA DE DIRECTORIOS FINAL

```bash
ApiCarRaces/
├── __tests__/                          ✨ NUEVO - Tests modulares
│   ├── cases/
│   │   ├── fixtures.ts                 💾 Datos de prueba
│   │   ├── setupApp.ts                 🏗️ Factory de app
│   │   └── testCases.ts                🧪 Casos reutilizables
│   │
│   ├── integration/
│   │   ├── api.memory.test.ts          📱 Tests Memory
│   │   ├── api.file.test.ts            📁 Tests File
│   │   ├── api.postgres.test.ts        🐘 Tests PostgreSQL
│   │   ├── api.supabase.test.ts        ☁️ Tests Supabase
│   │   └── api.oracle.test.ts          🦁 Tests Oracle
│   │
│   ├── unit/
│   │   └── repositories.test.ts        🔧 Tests unitarios
│   │
│   └── setup.ts                        ⚙️ Config global
│
├── src/                                (actual)
│   ├── backends/                       🆕 NUEVO - Abstracciones
│   │   ├── IBackend.ts                 🔌 Interfaz base
│   │   ├── MemoryBackend.ts            📱 Implementación Memory
│   │   ├── FileBackend.ts              📁 Implementación File
│   │   ├── PostgresBackend.ts          🐘 Implementación Postgres
│   │   ├── SupabaseBackend.ts          ☁️ Implementación Supabase
│   │   └── OracleBackend.ts            🦁 Implementación Oracle
│   │
│   ├── app.ts                          (actual)
│   ├── server.ts                       (actual)
│   └── ... (resto de módulos)
│
├── tests/                              (antiguo - deprecado)
│   └── integration/                    ⚠️ Mantener para referencia
│
├── vitest.config.ts                    ✅ ACTUALIZADO
├── package.json                        ✅ ACTUALIZADO
├── .env.test                           (general)
├── .env.test.memory                    ✨ NUEVO
├── .env.test.file                      ✨ NUEVO
├── .env.test.postgres                  ✨ NUEVO
├── .env.test.supabase                  ✨ NUEVO
├── .env.test.oracle                    ✨ NUEVO
├── tsconfig.json                       (actual)
└── PLAN_REFACTORIZACION_TESTS.md       📋 Este plan
```

---

## 🎯 IMPLEMENTACIÓN PASO A PASO

### FASE 1: Crear estructura modular (2-3 horas)

✅ **Paso 1:** Crear directorios
```bash
mkdir -p __tests__/cases
mkdir -p __tests__/integration
mkdir -p __tests__/unit
mkdir -p src/backends
```

✅ **Paso 2:** Crear `__tests__/cases/fixtures.ts`
- Copiar el contenido del archivo de ejemplo
- Ajustar tipos según tus entidades actuales
- Verificar que todos los modelos estén presentes

✅ **Paso 3:** Crear `__tests__/cases/setupApp.ts`
- Crear factory function
- Inyectar todos los repositorios
- Registrar todas las rutas

✅ **Paso 4:** Crear `__tests__/cases/testCases.ts`
- Crear casos reutilizables para cada entidad
- Todos los casos deben ser agnósticos del backend

---

### FASE 2: Crear backends (4-5 horas)

✅ **Paso 5:** Crear `src/backends/IBackend.ts`
```typescript
export interface IBackend {
  initialize(): Promise<void>
  clear(): Promise<void>
  close(): Promise<void>
}
```

✅ **Paso 6:** Crear `src/backends/MemoryBackend.ts`
- Almacenar datos en objetos en RAM
- Implementar CRUD para cada entidad
- Simular ID autoincremental

✅ **Paso 7:** Crear `src/backends/FileBackend.ts`
- Persistir datos en JSON files
- Usar `fs` para lectura/escritura

✅ **Paso 8:** Crear `src/backends/PostgresBackend.ts`
- Usar conexión existente
- Reutilizar repositorios actuales

✅ **Paso 9:** Crear `src/backends/SupabaseBackend.ts`
- Usar cliente Supabase
- Implementar interfaz común

✅ **Paso 10:** Crear `src/backends/OracleBackend.ts`
- Usar cliente Oracle
- Implementar interfaz común

---

### FASE 3: Crear tests de integración (2-3 horas)

✅ **Paso 11:** Crear `__tests__/integration/api.memory.test.ts`
- Usar `createTestApp()` con MemoryBackend
- Ejecutar todos los test cases

✅ **Paso 12:** Copiar patrón para otros backends
```bash
cp __tests__/integration/api.memory.test.ts __tests__/integration/api.file.test.ts
cp __tests__/integration/api.memory.test.ts __tests__/integration/api.postgres.test.ts
cp __tests__/integration/api.memory.test.ts __tests__/integration/api.supabase.test.ts
cp __tests__/integration/api.memory.test.ts __tests__/integration/api.oracle.test.ts
```

✅ **Paso 13:** Actualizar imports en cada archivo
- Cambiar imports de backend (MemoryBackend → FileBackend, etc.)
- Actualizar describe() con nombre del backend

---

### FASE 4: Configuración (1 hora)

✅ **Paso 14:** Actualizar `vitest.config.ts`
- Copiar configuración del ejemplo
- Ajustar paths según necesidad

✅ **Paso 15:** Actualizar `package.json`
- Agregar scripts de test para cada backend
- Agregar script `test:all`

✅ **Paso 16:** Crear archivos `.env.test.*`
- `.env.test.memory`
- `.env.test.file`
- `.env.test.postgres`
- `.env.test.supabase`
- `.env.test.oracle`

✅ **Paso 17:** Actualizar `__tests__/setup.ts`
- Copiar configuración del ejemplo

---

### FASE 5: Validación (1 hora)

✅ **Paso 18:** Ejecutar tests
```bash
npm run test:memory   # Memory backend
npm run test:file     # File backend
npm run test:postgres # PostgreSQL backend
npm run test:all      # Todos los backends
```

✅ **Paso 19:** Verificar cobertura
```bash
npm run test:coverage
```

✅ **Paso 20:** Deprecar tests antiguos
```bash
# Respaldar
mv tests tests_old

# O simplemente ignorar en git
echo "tests_old/" >> .gitignore
```

---

## 🧪 EJECUCIÓN DE TESTS

### Correr un test específico

```bash
# Memory backend
npm run test:memory

# PostgreSQL backend
npm run test:postgres

# Con watch mode
npm run test:postgres:watch

# UI interactivo
npm run test:ui

# Coverage
npm run test:coverage
```

### Correr todos los backends
```bash
npm run test:all
```

### Output esperado

```
═══════════════════════════════════════════
✅ Test Environment Setup
═══════════════════════════════════════════
📦 Backend: MEMORY
📄 Config: .env.test.memory
🌍 Database: memory
═══════════════════════════════════════════

🚀 Starting memory backend tests...

📱 API Integration Tests - Memory Backend
  👤 Users
    ✓ should create a user (45ms)
    ✓ should validate required fields (12ms)
    ✓ should list users with pagination (23ms)
    ✓ should get user by id (18ms)
  🏁 Clubs
    ✓ should create a club (38ms)
    ✓ should list clubs with pagination (20ms)
  🏎️ Races
    ✓ should create a race (42ms)
    ✓ should list races with pagination (25ms)

✅ memory tests completed.

Test Files  5 passed (5)
     Tests  111 passed (111)
  Duration  2.74s
```

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

| Métrica | Antes | Después |
|---------|-------|---------|
| **Archivos de test** | 18 | 5 |
| **Líneas de código** | ~2,000 | ~1,000 |
| **Duplicación** | 100% | 0% |
| **Backends soportados** | 1 (Postgres) | 5 |
| **Tests ejecutados** | 111 | 555 (5 backends × 111) |
| **Tiempo de ejecución** | 2.7s | ~13s (todos los backends) |
| **Mantenibilidad** | Baja | Alta |
| **Escalabilidad** | Difícil | Fácil |

---

## 🚨 CHECKLIST FINAL

### Creación de archivos
- [ ] `__tests__/cases/fixtures.ts` ✨ NUEVO
- [ ] `__tests__/cases/setupApp.ts` ✨ NUEVO
- [ ] `__tests__/cases/testCases.ts` ✨ NUEVO
- [ ] `__tests__/setup.ts` ✨ NUEVO
- [ ] `src/backends/IBackend.ts` ✨ NUEVO
- [ ] `src/backends/MemoryBackend.ts` ✨ NUEVO
- [ ] `src/backends/FileBackend.ts` ✨ NUEVO
- [ ] `src/backends/PostgresBackend.ts` ✨ NUEVO
- [ ] `src/backends/SupabaseBackend.ts` ✨ NUEVO
- [ ] `src/backends/OracleBackend.ts` ✨ NUEVO
- [ ] `__tests__/integration/api.memory.test.ts` ✨ NUEVO
- [ ] `__tests__/integration/api.file.test.ts` ✨ NUEVO
- [ ] `__tests__/integration/api.postgres.test.ts` ✨ NUEVO
- [ ] `__tests__/integration/api.supabase.test.ts` ✨ NUEVO
- [ ] `__tests__/integration/api.oracle.test.ts` ✨ NUEVO
- [ ] `.env.test.memory` ✨ NUEVO
- [ ] `.env.test.file` ✨ NUEVO
- [ ] `.env.test.postgres` ✨ NUEVO
- [ ] `.env.test.supabase` ✨ NUEVO
- [ ] `.env.test.oracle` ✨ NUEVO

### Actualización de archivos
- [ ] `vitest.config.ts` ✅ ACTUALIZAR
- [ ] `package.json` ✅ ACTUALIZAR
- [ ] `.gitignore` ✅ (agregar `test-data/`)

### Validación
- [ ] `npm run test:memory` ✓ Pasa
- [ ] `npm run test:file` ✓ Pasa
- [ ] `npm run test:postgres` ✓ Pasa
- [ ] `npm run test:supabase` ✓ Pasa
- [ ] `npm run test:oracle` ✓ Pasa
- [ ] `npm run test:coverage` ✓ > 80%

### Limpieza
- [ ] Respaldar carpeta `tests/` → `tests_old/`
- [ ] Actualizar `.gitignore`
- [ ] Documentar cambios en README.md

---

## 📚 REFERENCIAS Y DOCUMENTACIÓN

- **Plan completo:** [PLAN_REFACTORIZACION_TESTS.md](PLAN_REFACTORIZACION_TESTS.md)
- **Ejemplos de código:** 
  - Fixtures: `__tests__/cases/fixtures.ts`
  - Setup: `__tests__/cases/setupApp.ts`
  - Test cases: `__tests__/cases/testCases.ts`
- **Patrón TestApi1:** Referencia de arquitectura modular

---

## 🆘 TROUBLESHOOTING

### "Cannot find module" errors
✅ Verificar rutas en `__tests__/cases/setupApp.ts`
✅ Asegurar que `src/backends/` existe

### Tests fallan en PostgreSQL
✅ Verificar conexión a BD
✅ Ejecutar migraciones: `npm run migrate:test`

### Memory tests lentos
✅ Aumentar `testTimeout` en `vitest.config.ts`

### Coverage bajo
✅ Agregar más casos en `testCases.ts`
✅ Ejecutar: `npm run test:coverage`

---

**¿Dudas o preguntas?** Refiera al [PLAN_REFACTORIZACION_TESTS.md](PLAN_REFACTORIZACION_TESTS.md) completo.

