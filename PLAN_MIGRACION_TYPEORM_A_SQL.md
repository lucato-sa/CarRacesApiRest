# 🔄 PLAN DETALLADO: MIGRACIÓN DE TYPEORM A SQL NATIVO

## 📊 Estado Actual vs Target

```
ACTUAL (TypeORM)          →     TARGET (SQL Nativo + pg)
├─ @Entity decoradores       ├─ Interfaces TypeScript simples
├─ DataSource de TypeORM     ├─ Pool de conexiones con 'pg'
├─ Query builder de ORM      ├─ SQL puro en repositories
└─ Sincronización de BD      └─ Migraciones SQL manuales

MANTENER (Lo que funciona)
├─ ✅ database.config.ts (mapeos y config)
├─ ✅ IBackend interface (estrategia de backends)
├─ ✅ dtoToDb() / dbToDto() (transformaciones)
└─ ✅ SupabaseBackend (funciona con Supabase)
```

---

## 📝 CAMBIOS A REALIZAR

### 1️⃣ **Actualizar `package.json`**

```diff
  "dependencies": {
-   "@supabase/supabase-js": "^2.99.2",
+   "@supabase/supabase-js": "^2.99.2",    ← MANTENER
-   "express": "^4.18.2",
+   "express": "^4.18.2",                  ← MANTENER
-   "pg": "^8.18.0",                       ← YA EXISTE
+   "pg": "^8.18.0",                       ← USAR PARA SQL NATIVO
-   "reflect-metadata": "^0.2.2",          ← REMOVER
-   "typeorm": "^0.3.28",                  ← REMOVER
+   
    "dotenv": "^17.3.1",                   ← AGREGAR (si no existe)
```

**Comandos:**
```bash
npm uninstall typeorm reflect-metadata
npm install pg
```

---

### 2️⃣ **Crear sistema de conexión centralizado**

```
src/
└─ database/
   ├─ data-source.ts           ← NUEVO: Pool de conexiones con 'pg'
   ├─ query-builder.ts         ← NUEVO: Helpers para queries SQL
   └─ migrations/              ← NUEVO: SQL migrations manualmente
       └─ 001-init-schema.sql
```

---

### 3️⃣ **Eliminar entities con decoradores**

```diff
- src/clubs/entities/club.entity.ts
+ src/clubs/models/club.model.ts  (solo tipos TypeScript)
```

---

### 4️⃣ **Reescribir repositories con SQL puro**

Antes:
```typescript
// TypeORM
async create(club: Omit<Club, 'ClubId'>): Promise<Club> {
  const entity = this.getRepository().create(club);
  const saved = await this.getRepository().save(entity);
  return this.entityToDto(saved);
}
```

Después:
```typescript
// SQL Nativo
async create(club: Omit<Club, 'ClubId'>): Promise<Club> {
  const query = `
    INSERT INTO clubs (alias, tax_nombre, tax_numero, descripcion, fecha_fundacion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING club_id, alias, tax_nombre, tax_numero, descripcion, fecha_fundacion
  `;
  const result = await this.pool.query(query, [
    club.Alias, club.TaxNombre, club.TaxNumero, club.Descripcion, club.FechaFundacion
  ]);
  return dbToDto('clubs', result.rows[0]);
}
```

---

### 5️⃣ **Actualizar `app.ts`**

```diff
- import { AppDataSource } from './database/data-source'
+ import { initializeDB } from './database/data-source'

// Al iniciar la app:
- await AppDataSource.initialize()
+ await initializeDB()
```

---

### 6️⃣ **Actualizar `server.ts`**

```diff
- import { AppDataSource } from './database/data-source'
+ import { dbPool } from './database/data-source'

app.listen(PORT, async () => {
-  await AppDataSource.initialize()
+  await initializeDB()
   console.log(`✅ Servidor escuchando en puerto ${PORT}`)
})

// Al cerrar:
- await AppDataSource.destroy()
+ await dbPool.end()
```

---

## 📋 ARCHIVOS A CREAR / MODIFICAR / ELIMINAR

### ➕ CREAR

| Archivo | Propósito |
|---------|-----------|
| `src/database/data-source.ts` | Pool de conexiones con `pg` |
| `src/database/query-builder.ts` | Helpers para SQL (prepare, execute) |
| `src/database/migrations/001-init-schema.sql` | Schema inicial |
| `src/clubs/models/club.model.ts` | Tipos TypeScript (sin decoradores) |
| `src/users/models/user.model.ts` | Tipos TypeScript |
| ... (modelos para todas 18 entidades) | ... |

### 📝 MODIFICAR

| Archivo | Cambios |
|---------|---------|
| `package.json` | Remover typeorm, reflect-metadata; mantener pg |
| `src/clubs/repository/club.repository.ts` | SQL en lugar de TypeORM |
| `src/users/repository/user.repository.ts` | SQL en lugar de TypeORM |
| ... (todos los repositories) | ... |
| `src/app.ts` | Importar del nuevo data-source |
| `src/server.ts` | Importar del nuevo data-source |
| `.env.example` | Actualizar referencia a TypeORM |

### 🗑️ ELIMINAR

| Archivo | Por qué |
|---------|---------|
| `src/clubs/entities/club.entity.ts` | Reemplazado por `models/club.model.ts` |
| `src/*/entities/*.entity.ts` | (Todos los @Entity files) |
| `src/migrations/` | (Si existen migrations de TypeORM) |

---

## 🎯 VENTAJAS DE ESTA MIGRACIÓN

✅ **Control total** - SQL explícito, sin magia de ORM  
✅ **Flexibilidad** - Queries complejas fáciles  
✅ **Performance** - Menos overhead, queries optimizadas  
✅ **Simplicidad** - Menos dependencias  
✅ **Debugging** - SQL en plain text, fácil debuggear  
✅ **Mantiene lo bueno** - Config centralizada, mapeos, transformaciones

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### 1. Validaciones manuales
Con TypeORM tenías validaciones de schema automáticas. Ahora:
```typescript
// Debes validar manualmente
if (!club.Alias || !club.TaxNombre) {
  throw new Error('Missing required fields');
}
```

### 2. Type hints en queries
```typescript
// Usar tipos de retorno explícitos
const result = await this.pool.query(query);
const clubs: Club[] = result.rows.map(row => dbToDto('clubs', row));
```

### 3. Migraciones manuales
Crear `.sql` files en lugar de confiar en `synchronize`:
```sql
-- migrations/001-init-schema.sql
CREATE TABLE IF NOT EXISTS clubs (
  club_id SERIAL PRIMARY KEY,
  alias VARCHAR(100) NOT NULL UNIQUE,
  tax_nombre VARCHAR(255) NOT NULL,
  ...
);
```

---

## 🔧 HERRAMIENTAS RECOMENDADAS

```bash
# Para ejecutar migraciones manualmente
psql -h localhost -U postgres -d carracesapi -f migrations/001-init-schema.sql

# O crear un script Node.js
npm run migrate:up    # Custom script en package.json
```

---

## 📊 COMPARATIVA: ANTES vs DESPUÉS

| Aspecto | TypeORM | SQL Nativo |
|--------|---------|-----------|
| **Setup** | Complejo (decoradores, entidades) | Simple (pool + queries) |
| **Performance** | Bueno | Excelente |
| **Debugging** | Difícil (magic) | Fácil (SQL explícito) |
| **Curva aprendizaje** | Pronunciada | Suave |
| **Migraciones** | Automáticas (riesgoso) | Manuales (control) |
| **Queries complejas** | Complicadas | Simples |
| **Tamaño bundle** | Grande | Pequeño |

---

## 🚀 ORDEN DE IMPLEMENTACIÓN (RECOMENDADO)

1. **Crear rama nueva**
   ```bash
   git checkout -b feature/migrate-to-raw-sql
   ```

2. **Step 1**: Crear `data-source.ts` con pool de `pg`
3. **Step 2**: Crear tipos en `clubs/models/club.model.ts` (sin decoradores)
4. **Step 3**: Reescribir `clubs/repository/club.repository.ts` con SQL
5. **Step 4**: Probar `npm run test:postgres`
6. **Step 5**: Repetir steps 2-4 para todas las entidades
7. **Step 6**: Actualizar `app.ts` y `server.ts`
8. **Step 7**: Remover de `package.json`
9. **Step 8**: PR y merge a main

---

## ✅ TESTING

```bash
# Probar que todo sigue funcionando
npm run test:postgres -- -t Clubs

# Testing completo
npm run test:all
```

---

## 📌 NOTAS

- **Supabase seguirá funcionando** igual (no usa TypeORM)
- **Memory backend sigue igual** (no usa BD)
- **PostgreSQL local** ahora con SQL nativo (mejor performance)
- **Mantanes la flexibilidad** de cambiar backends

---

**Próximo paso:** ¿Empezamos con el código?
