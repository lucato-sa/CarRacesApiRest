# 📚 Guía Completa: Migración PostgreSQL de 16 Endpoints Restantes

## Status Actual
✅ **Completado:**
- Club: Entity + Repository async + Use Cases async + Routes async
- User: Entity + Repository async + Use Cases async + Routes async
- 16 Entity TypeORM classes creadas

⏳ **Pendiente:**
- 16 repositorios (convertir de en-memoria a async TypeORM)
- 16 use cases (hacer métodos execute async)
- 16 route handlers (hacer handlers async)
- Tests de validación

---

## 📋 Template de Conversión (Copiar & Adaptar)

### Patrón 1: Repository Async (Aplica a todos)

```typescript
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { {EntityName}Entity } from '../entities/{entity}.entity';

// DTO Type (COPIAR DEL ARCHIVO ACTUAL)
export type {EntityName} = {
  // COPIAR EXACTAMENTE COMO ESTÁ
};

export class {EntityName}Repository {
  private repository?: Repository<{EntityName}Entity>;

  private getRepository(): Repository<{EntityName}Entity> {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository({EntityName}Entity);
    }
    return this.repository;
  }

  // Para CADA método, cambiar:
  // - getAll()          → async getAll(): Promise<{EntityName}[]>
  // - getById(id)       → async getById(id): Promise<{EntityName} | undefined>
  // - create(data)      → async create(data): Promise<{EntityName}>
  // - update(id, data)  → async update(id, data): Promise<{EntityName} | undefined>
  // - delete(id)        → async delete(id): Promise<boolean>
  //
  // - Cambiar: this.{collection} → this.getRepository()
  // - Cambiar: .find()   → await .find()
  // - Cambiar: .save()   → await .save()
  // - Cambiar: .create(obj) → Mantener igual (TypeORM)
  // - Añadir entityToDto() converter privado
}
```

---

## 🔄 Flujo de Conversión Rápida (Por Endpoint)

### Para CADA uno de los 16 endpoints:

#### 1. Repository → src/{entity}/repository/{entity}.repository.ts

**Cambios necesarios:**
1. Importar TypeORM y entity: `import { {EntityName}Entity } from '../entities/{entity}.entity';`
2. Reemplazar toda la lógica de colección en-memoria con `getRepository()`
3. Hacer todos los métodos `async`
4. Añadir `await` a todas las operaciones de BD
5. Crear método privado `entityToDto()` para convertir entity → DTO
6. Cambiar tipos de retorno a `Promise<>`

**Ejemplo (ya hecho para Club/User):**
```
- this.clubs.find()  →  await this.getRepository().find()
- return clubs       →  return entities.map(e => this.entityToDto(e))
```

#### 2. Use Cases → src/{entity}/domain/{entity}.use-cases.ts

**Cambios necesarios:**
1. Cambiar `execute()` a `async execute()`
2. Cambiar tipos de retorno a `Promise<{Type}>`
3. Cambiar `this.repository.getAll()` a `await this.repository.getAll()`
4. Cambiar `this.repository.getById()` a `await this.repository.getById()`

**Ejemplo:**
```typescript
// ANTES
execute(request): ListUsersResponse {
  let users = this.repository.getAll();

// DESPUÉS
async execute(request): Promise<ListUsersResponse> {
  let users = await this.repository.getAll();
```

#### 3. Routes → src/{entity}/transport/{entity}.routes.ts

**Cambios necesarios:**
1. Cambiar todos los handlers a `async (req, res) => {`
2. Cambiar `const result = useCase.execute()` a `const result = await useCase.execute()`
3. Mantener try/catch igual

**Ejemplo:**
```typescript
// ANTES
router.get('/{entities}', (req, res) => {
  try {
    const result = listUseCase.execute({...});

// DESPUÉS  
router.get('/{entities}', async (req, res) => {
  try {
    const result = await listUseCase.execute({...});
```

---

## 📊 Lista de 16 Endpoints Pendientes

1. ✅ Competition (entity creada)
2. ✅ Event (entity creada)
3. ✅ Role (entity creada)
4. ✅ Speciality (entity creada)
5. ✅ Division (entity creada)
6. ✅ Discipline (entity creada)
7. ✅ Surface (entity creada)
8. ✅ Format (entity creada)
9. ✅ DrivingEnvironment (entity creada)
10. ✅ EntityLink (entity creada)
11. ✅ Registration (entity creada)
12. ✅ Championship (entity creada)
13. ✅ Race (entity creada)
14. ✅ RaceResult (entity creada)
15. ✅ UserentEntity (entity creada)
16. ✅ RolEntity (entity creada)

---

## 🚀 Ejecución Rápida (Opción A: Manual)

Para cada endpoint, ejecutar en orden:

```bash
# 1. Abrir: src/{entity}/repository/{entity}.repository.ts
# 2. Reemplazar TODO el contenido usando patrón arriba
# 3. Abrir: src/{entity}/domain/{entity}.use-cases.ts  
# 4. Cambiar execute() → async execute() y añadir await
# 5. Abrir: src/{entity}/transport/{entity}.routes.ts
# 6. Cambiar handlers a async y añadir await
# 7. Guardar archivos
# 8. npm test -- --run (verificar que pasen)
```

---

## 🔧 Opción B: Usar Agente (Recomendado)

Solicitar a agente que genere los 16 repositorios async listos para copiar-pegar.
Luego generar los 16 use-cases async.
Luego generar los 16 routes async.

Cada generación toma ~1-2 minutos y produce código ready-to-use.

---

## ✅ Verificación Final

Una vez actualizado todos los 16 endpoints:

```bash
npm test -- --run
# Debe mostrar: Test Files 18 passed (18), Tests 111 passed (111)
```

---

## 📝 Notas Importantes

- ⚠️ **NO** modificar DTOs (los tipos en repository) - usar exactamente como están
- ⚠️ **NO** cambiar nombres de columas en entidades - deben ser snake_case
- ⚠️ **SÍ** cambiar todos los métodos repository a async/await
- ⚠️ **SÍ** propagar async hasta rutas (no puede haber métodos sync esperando async repo)
- ✅ TypeScript compilará errores si falta un `await` (usa eso como guía)
- ✅ TypeORM generará automáticamente las tablas con `synchronize: true`

---

## 🎯 Resultado Esperado

Después de la migración completa:
- ✅ Toda persistencia será PostgreSQL (no en-memoria)
- ✅ Todos los métodos serán async/await (sin bloqueos)
- ✅ TypeORM manejará todas las operaciones de BD
- ✅ 111 tests pasarán sin cambios (solo actualizar repos/routes)
- ✅ Base de datos automáticamente creada al iniciar

---

## 🗄️ Siguiente Paso: Database Setup

Una vez que todos los código esté actualizado, será necesario:

1. **Instalar PostgreSQL** (Docker recomendado):
   ```bash
   docker run -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=carracesapi -p 5432:5432 -d postgres:15
   ```

2. **Crear .env** desde .env.example:
   ```
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=carracesapi
   ```

3. **Correr servidor**:
   ```bash
   npm run dev
   # Verá: ✅ PostgreSQL connected successfully
   #        🚀 Server listening on http://localhost:3000
   ```

4. **Validar**: 
   ```bash
   curl http://localhost:3000/api/clubs
   # Retornará datos de PostgreSQL
   ```

