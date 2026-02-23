# 📋 Plan de Migración a PostgreSQL

## ✅ Actualización 1: Configuración Inicial

### Paso 1: Instalación de Dependencias
Se han instalado las siguientes dependencias:
- **pg**: Driver nativo de PostgreSQL
- **typeorm**: ORM (Object-Relational Mapping) para TypeScript
- **reflect-metadata**: Soporte para decoradores de TypeORM

```bash
npm install pg typeorm reflect-metadata --save
```

### Paso 2: Archivos Creados

#### 1. `src/database/data-source.ts`
Configuración de conexión a PostgreSQL con variables de entorno:
- DB_HOST (por defecto: localhost)
- DB_PORT (por defecto: 5432)
- DB_USER (por defecto: postgres)
- DB_PASSWORD (por defecto: postgres)
- DB_NAME (por defecto: carracesapi)
- DB_LOGGING (para logs de SQL)

#### 2. `.env.example`
Archivo plantilla con variables de entorno necesarias

#### 3. `src/clubs/entities/club.entity.ts`
Entidad TypeORM para la tabla `clubs` en PostgreSQL con columnas:
- `club_id` (PK, auto-incremento)
- `alias` (varchar, único)
- `tax_nombre` (varchar)
- `tax_numero` (varchar, único)
- `descripcion` (text)
- `fecha_fundacion` (date)
- `default` (boolean)
- `created_at` (timestamp auto)
- `updated_at` (timestamp auto)

#### 4. `src/clubs/repository/club.repository.ts` (Refactorizado)
Actualizado con:
- Métodos async/await
- Integración con TypeORM
- Manejo de entidades -> DTOs
- Operaciones: getAll(), getById(), getByAlias(), create(), update(), delete()

---

## 📋 Próximos Pasos

### Fase 2: Migraciones TypeORM
1. Crear migraciones para todas las tablas
2. Archivo: `src/migrations/1706000000000-CreateTablesAndRelations.ts`

### Fase 3: Actualizar Use Cases
1. Hacer async todos los use cases
2. Manejar promesas en los métodos execute()

### Fase 4: Actualizar Routes
1. Hacer async los handlers de Express
2. Usar `async (req, res) => {}`
3. Manejar errores con try-catch async

### Fase 5: Integrar en app.ts
1. Inicializar AppDataSource antes de crear rutas
2. Verificar conexión a PostgreSQL

### Fase 6: Crear Entidades para Otros Endpoints
1. User -> UserEntity
2. Competition -> CompetitionEntity
3. Event -> EventEntity
(... para todas las 18 entities)

### Fase 7: Testing
1. Verificar que todos los tests pasen
2. Pruebas de integración con BD real

---

## 🚀 Cómo Usar PostgreSQL Localmente

Opción 1: Usando Docker (Recomendado)
```bash
docker run --name postgres-caraces -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=carracesapi -p 5432:5432 -d postgres:15
```

Opción 2: Instalación Local
- Descargar PostgreSQL desde https://www.postgresql.org/download/
- Crear BD: `createdb carracesapi`

Opción 3: Usar pgAdmin
- Interfaz web: http://localhost:5050

---

## 🔄 Transformación del Código

### Antes (En-Memoria):
```typescript
getAll(): Club[] {
  return this.clubs.slice();
}
```

### Después (PostgreSQL):
```typescript
async getAll(): Promise<Club[]> {
  const entities = await this.repository.find();
  return entities.map(e => this.entityToDto(e));
}
```

---

## 📊 Ventajas de PostgreSQL

✅ Datos persistentes entre reinicios
✅ Escalabilidad (soporta millones de registros)
✅ Relaciones entre tablas (foreign keys)
✅ Índices para búsquedas rápidas
✅ Transacciones ACID
✅ Backup y recovery
✅ Soporte multi-usuario

---

## 🔐 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=carracesapi
DB_LOGGING=true
```

