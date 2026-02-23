# 🏎️ CarRaces API - Configuración con Supabase

Una API REST completa para gestión de carreras de autos, migrada a **PostgreSQL en Supabase** con TypeORM async.

## ✨ Características

- ✅ **18 Endpoints** completamente funcionales
- ✅ **PostgreSQL Supabase** para datos persistentes
- ✅ **TypeORM** ORM tipado con TypeScript
- ✅ **Async/Await** en todas las capas (Controllers → Services → Repositories)
- ✅ **111 Tests** integración (100% pasando)
- ✅ **Clean Architecture** 3 capas (Transport/Domain/Persistence)
- ✅ **Autoconfiguración** de esquema de base de datos

## 📋 Requisitos

- **Node.js** v16+ (recomendado v18+)
- **npm** o yarn
- **Supabase** account (gratuito en https://supabase.com)
- **PostgreSQL** en Supabase (incluido)

## 🚀 Setup Rápido (5 minutos)

### 1. Clonar y install

```bash
git clone https://github.com/lucato-sa/CarRacesApiRest.git
cd CarRacesApiRest
npm install
```

### 2. Configurar Supabase

**Opción A: Setup Interactivo (Recomendado)**

```bash
node setup-supabase.js
```

El asistente te guiará por todo.

**Opción B: Manual**

```bash
cp .env.example .env
```

Edita `.env` y reemplaza:
```env
DB_HOST=db.XXXXX.supabase.co          # Tu ID de proyecto Supabase
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres    # De Supabase Settings → Database
DB_NAME=postgres
```

### 3. Verificar Conexión

```bash
npm run dev
```

Expected output:
```
📡 Conectando a base de datos...
   Host: db.xxxxx.supabase.co
   Puerto: 5432
   BD: postgres
✅ PostgreSQL/Supabase conectado exitosamente
🚀 Servidor escuchando en http://localhost:3000
📊 18 tablas disponibles desde la base de datos
```

### 4. Test API

```bash
# Listar clubs
curl http://localhost:3000/api/clubs

# Crear club
curl -X POST http://localhost:3000/api/clubs \
  -H "Content-Type: application/json" \
  -d '{
    "Alias":"mi-club",
    "TaxNombre":"Mi Club",
    "TaxNumero":"12345678",
    "Descripcion":"Mi primer club",
    "FechaFundacion":"2026-02-23"
  }'
```

## 📊 Endpoints Disponibles

### Gestión de Clubes
- `GET /api/clubs` - Listar todos
- `POST /api/clubs` - Crear nuevo
- `GET /api/clubs/:id` - Obtener por ID
- `PUT /api/clubs/:id` - Actualizar
- `DELETE /api/clubs/:id` - Eliminar

### Gestión de Usuarios
- `GET /api/users` - Listar
- `POST /api/users` - Crear
- `GET /api/users/:id` - Obtener
- `PUT /api/users/:id` - Actualizar
- `DELETE /api/users/:id` - Eliminar

### + 16 Endpoints Más
- Competiciones, Eventos, Roles, Especialidades
- Divisiones, Disciplinas, Superficies, Formatos
- Ambientes, Links, Registros, Campeonatos
- Carreras, Resultados, Entidades de Usuario/Rol

*(ver ENDPOINTS.md para lista completa)*

## 🗄️ Base de Datos

### 18 Tablas Automáticas

Las tablas se crean automáticamente al iniciar:

```
clubs                      race_results
users                      user_entities
competitions               rol_entities
events                     entity_links
roles                      divisions
specialities               surfaces
disciplines                formats
driving_environments       championships
registrations              races
```

### Auto-Sincronización

En **desarrollo** (`NODE_ENV=development`):
- ✅ Crea tablas automáticamente
- ✅ Agrega columnas nuevas
- ❌ NO elimina datos

En **producción** (`NODE_ENV=production`):
- ❌ No sincroniza (manual migrations)

## 🧪 Tests

```bash
# Ejecutar todos
npm test

# Watch mode
npm test -- --watch

# Con coverage
npm test -- --coverage
```

**Resultado esperado:** 111/111 tests passing ✅

## 📁 Estructura de Código

```
src/
├── database/
│   └── data-source.ts          # Config TypeORM
├── (entities)/
│   ├── entities/
│   │   └── {entity}.entity.ts  # TypeORM decorators
│   ├── repository/
│   │   └── {entity}.repository.ts # Async CRUD
│   ├── domain/
│   │   └── {entity}.use-cases.ts  # Business logic
│   └── transport/
│       └── {entity}.routes.ts     # HTTP handlers
├── app.ts                         # Express app
└── server.ts                      # Entry point

tests/
├── integration/
│   └── {entity}.test.ts        # Integration tests
└── setup.ts                    # Vitest config
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Iniciar servidor (dev mode)
npm test             # Ejecutar tests
npm test -- --run    # Tests una sola vez
npm run build        # Compilar TypeScript
npm run lint         # ESLint checks
```

## 🔐 Seguridad

### Environment Variables

**✅ Seguro:**
- Credenciales en `.env` (ignorado por git)
- Diferentes por ambiente
- Nunca en repositorio

**❌ Inseguro:**
- Credenciales en código
- `.env` commiteado a git
- Valores de producción en desarrollo

### Configuración

```bash
# Verificar que .env NO está en git
cat .gitignore | grep ".env"

# Debe mostrar:
# .env
# .env.*.local
```

## 📚 Documentación Adicional

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Guía detallada Supabase
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Resumen migrations
- **[README_OPENAPI.md](./README_OPENAPI.md)** - Spec OpenAPI
- **[docs/](./docs/)** - Requisitos y modelos

## 🚨 Troubleshooting

### Error: "connect ECONNREFUSED"

```
❌ Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solución:**
1. Verifica que `.env` tiene valores correctos (ver paso 2)
2. Verifica que `DB_HOST` termina en `.supabase.co`
3. Ejecuta: `npm run dev` de nuevo

### Error: "password authentication failed"

```
❌ Error: password authentication failed for user "postgres"
```

**Solución:**
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Settings → Database → Reset Password (si es necesario)
3. Copia tu contraseña postgresql
4. Actualiza `.env`

### Error: "relation does not exist"

```
❌ Error: relation "clubs" does not exist
```

**Solución:**
1. Las tablas no se crearon. Opciones:
   - Reinicia: `npm run dev`
   - Verifica que `synchronize: true` en data-source.ts
   - Instala deps: `npm install`

### Verificar Conexión

```bash
node test-connection.js
```

Mostrará status de conexión y listará todas las tablas.

## 🎯 Próximos Pasos

- [ ] Agregar autenticación JWT
- [ ] Validaciones adicionales
- [ ] Rate limiting
- [ ] Swagger documentation
- [ ] Deployment a Vercel/Railway

## 📞 Soporte

- 📖 [Documentación Supabase](https://supabase.com/docs)
- 🐛 [Reportar issues](https://github.com/lucato-sa/CarRacesApiRest/issues)
- 💬 [Discussions](https://github.com/lucato-sa/CarRacesApiRest/discussions)

## 📄 Licencia

MIT

---

**Última actualización:** Feb 23, 2026  
**Status:** ✅ Production Ready
