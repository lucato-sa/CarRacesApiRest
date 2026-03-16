# 🏗️ BACKENDS - Arquitectura Multi-Entorno

## 📊 Estructura Creada

```
src/backends/
├── IBackend.ts              🔌 Interfaz base (abstracta)
├── MemoryBackend.ts         📱 En RAM (rápido)
├── FileBackend.ts           📁 JSON files (local)
├── PostgresBackend.ts       🐘 PostgreSQL (real)
├── SupabaseBackend.ts       ☁️ Cloud Supabase
└── index.ts                 📦 Exportador de todo
```

---

## 🔌 INTERFAZ BASE - IBackend

Todos los backends implementan estos métodos:

```typescript
interface IBackend {
  initialize(): Promise<void>      // Iniciar backend
  clear(): Promise<void>           // Limpiar datos
  close(): Promise<void>           // Cerrar recursos
  create(entity, data)             // CREATE
  read(entity, id)                 // READ by ID
  readAll(entity, filters?)        // READ all
  update(entity, id, data)         // UPDATE
  delete(entity, id)               // DELETE
  count(entity)                    // COUNT
  isReady(): boolean               // Estado
}
```

---

## 📝 CÓMO USAR LOS BACKENDS

### 1️⃣ Memory Backend (En RAM)

**Mejor para:** Tests rápidos, unitarios, TDD

```typescript
import { MemoryBackend } from './src/backends';

const backend = new MemoryBackend();
await backend.initialize();

// Crear usuario
const user = await backend.create('users', {
  Nick: 'piloto_juan',
  Nombre: 'Juan'
});
console.log(user); // { UserId: 1, Nick: 'piloto_juan', ... }

// Leer todos los usuarios
const users = await backend.readAll('users');

// Actualizar
await backend.update('users', 1, { Nombre: 'Juan Carlos' });

// Eliminar
await backend.delete('users', 1);

// Limpiar (en tests)
await backend.clear();

// Cerrar
await backend.close();
```

**Ventajas:**
- ⚡ Super rápido (2-3s para 111 tests)
- 🔄 Reutilizable
- 🎯 Perfecto para TDD

**Desventajas:**
- ❌ Sin persistencia
- ❌ Solo en memoria

---

### 2️⃣ File Backend (JSON Files)

**Mejor para:** Tests locales, desarrollo

```typescript
import { FileBackend } from './src/backends';

const backend = new FileBackend('./test-data');
await backend.initialize();
// → Crea: ./test-data/users.json, ./test-data/clubs.json, ...

// Las operaciones son idénticas a Memory
const user = await backend.create('users', { Nick: 'juan' });

// Diferencia: los datos persisten en archivos JSON
// Perfectos para inspeccionar en desarrollo

await backend.close(); // Guarda todo
```

**Estructura de archivos:**
```
test-data/
├── users.json
├── clubs.json
├── races.json
├── competitions.json
├── championships.json
├── events.json
├── registrations.json
├── disciplines.json
├── formats.json
├── surfaces.json
├── divisions.json
├── roles.json
├── rolEntities.json
├── userEntities.json
├── raceResults.json
├── entityLinks.json
├── specialities.json
└── drivingEnvironments.json
```

**Ventajas:**
- 💾 Persistencia local
- 📁 Fácil inspeccionar datos
- 🔍 Debugging visual

**Desventajas:**
- 🐢 Más lento que Memory (2× más)
- 📊 No es SQL real

---

### 3️⃣ PostgreSQL Backend (Base de Datos Real)

**Mejor para:** Tests de integración realistas

```typescript
import { PostgresBackend } from './src/backends';
import { AppDataSource } from './src/database/data-source';

// Usar conexión existente de TypeORM
const backend = new PostgresBackend(AppDataSource);
await backend.initialize();

// Las operaciones son idénticas
const user = await backend.create('users', {
  Nick: 'juan',
  Nombre: 'Juan'
});

// DIFERENCIA: Usa SQL real contra PostgreSQL
// Valida constraints, foreign keys, etc.

await backend.clear(); // TRUNCATE tables
await backend.close();
```

**Ventajas:**
- ✅ SQL real
- ✅ Constraints validados
- ✅ Igual a producción

**Desventajas:**
- 🐢 Más lento (3-5s)
- 🔧 Requiere BD disponible
- 🗄️ Setup DB_TEST requerido

**Setup necesario:**
```bash
# Crear BD de test
createdb apicarraces_test

# Variables de entorno (.env.test.postgres)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=apicarraces_test
DB_SYNCHRONIZE=true  # Auto create tables
```

---

### 4️⃣ Supabase Backend (Cloud)

**Mejor para:** Testing en staging, cloud

```typescript
import { SupabaseBackend } from './src/backends';

const backend = new SupabaseBackend(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY_ANON
);
await backend.initialize();

// Nota: Actual implementación es draft
// Requiere: npm install @supabase/supabase-js

// Próxima versión completa operaciones CRUD
```

**Setup necesario:**
```bash
# .env.test.supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY_ANON=your-anon-key
```

**Estado:** 🔨 En construcción (draft implementation)

---

## 🚀 USANDO EN TESTS

### Patrón Completo

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MemoryBackend } from '../src/backends'

describe('Tests con Backend', () => {
  let backend: MemoryBackend;

  // Setup: Inicializar antes de todos los tests
  beforeAll(async () => {
    backend = new MemoryBackend();
    await backend.initialize();
  });

  // Cleanup: Cerrar después de todos los tests
  afterAll(async () => {
    await backend.close();
  });

  // Reset: Limpiar datos antes de cada test
  beforeEach(async () => {
    await backend.clear();
  });

  it('should create users', async () => {
    const user = await backend.create('users', {
      Nick: 'juan',
      Nombre: 'Juan'
    });

    expect(user).toHaveProperty('UserId');
    expect(user.Nick).toBe('juan');
  });

  it('should list users', async () => {
    await backend.create('users', { Nick: 'juan', Nombre: 'Juan' });
    await backend.create('users', { Nick: 'maria', Nombre: 'Maria' });

    const users = await backend.readAll('users');
    expect(users).toHaveLength(2);
  });

  it('should update user', async () => {
    const created = await backend.create('users', { Nick: 'juan', Nombre: 'Juan' });
    
    const updated = await backend.update('users', created.UserId, {
      Nombre: 'Juan Carlos'
    });

    expect(updated.Nombre).toBe('Juan Carlos');
  });

  it('should delete user', async () => {
    const created = await backend.create('users', { Nick: 'juan', Nombre: 'Juan' });
    await backend.delete('users', created.UserId);

    const found = await backend.read('users', created.UserId);
    expect(found).toBeUndefined();
  });

  it('should count users', async () => {
    await backend.create('users', { Nick: 'juan', Nombre: 'Juan' });
    await backend.create('users', { Nick: 'maria', Nombre: 'Maria' });

    const count = await backend.count('users');
    expect(count).toBe(2);
  });

  it('should filter users', async () => {
    await backend.create('users', { Nick: 'juan', Nombre: 'Juan', Email: 'juan@example.com' });
    await backend.create('users', { Nick: 'maria', Nombre: 'Maria', Email: 'maria@example.com' });

    const filtered = await backend.readAll('users', { Nick: 'juan' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].Nick).toBe('juan');
  });
});
```

---

## 📊 COMPARATIVA DE BACKENDS

| Aspecto | Memory | File | PostgreSQL | Supabase |
|--------|--------|------|------------|----------|
| **Velocidad** | ⚡⚡⚡ Muy rápido | ⚡⚡ Rápido | ⚡ Lento | 🐢 Muy lento |
| **Persistencia** | ❌ No | ✅ Sí (JSON) | ✅ Sí (SQL) | ✅ Sí (Cloud) |
| **Setup** | ✅ Ninguno | ✅ Simple | ⚠️ Requiere BD | ⚠️ Requiere cuenta |
| **Realismo** | ❌ Bajo | ⚠️ Medio | ✅ Alto | ✅ Muy alto |
| **Tests unitarios** | ✅ Perfecto | ⚠️ Bueno | ❌ No | ❌ No |
| **Tests integración** | ❌ No | ⚠️ Bueno | ✅ Perfecto | ✅ Perfecto |
| **CI/CD** | ✅ Sí | ✅ Sí | ⚠️ Requiere servicio | ⚠️ Network needed |
| **Debugging** | ❌ Difícil | ✅ Fácil (JSON) | ⚠️ Medio | ❌ Remoto |
| **Costo** | Gratis | Gratis | ~$10-50/mes | $25-100/mes |

---

## 🎯 RECOMENDACIONES DE USO

### Para **Tests Unitarios**
```bash
npm run test:memory
```
→ Memory Backend (rápido, simple)

### Para **Tests de Desarrollo Local**
```bash
npm run test:file
```
→ File Backend (inspecciono JSON)

### Para **Tests de Integración**
```bash
npm run test:postgres
```
→ PostgreSQL Backend (realista)

### Para **Tests en CI/CD**
```bash
npm run test:memory  # Fase rápida
npm run test:postgres  # Fase realista
```

### Para **Staging/Pre-prod**
```bash
npm run test:supabase
```
→ Supabase Backend (cloud)

---

## 🔧 CONFIGURACIÓN POR ENTORNO

### Development
```bash
BACKEND=memory  # Rápido para development
```

### Testing Local
```bash
BACKEND=file    # Persistencia local
```

### Testing CI
```bash
BACKEND=postgres  # Realista en CI
```

### Staging
```bash
BACKEND=supabase  # Cloud
```

---

## 📝 PRÓXIMOS PASOS

1. ✅ Descargar fixtures.ts actualizado
2. ✅ Descargar setupApp.ts (factory de app)
3. ✅ Descargar testCases.ts (casos reutilizables)
4. ⏳ Crear `__tests__/integration/api.*.test.ts` (para cada backend)
5. ⏳ Ejecutar `npm run test:all`

---

**¿Questions?** Consulta [PLAN_REFACTORIZACION_TESTS.md](../PLAN_REFACTORIZACION_TESTS.md)

