# 🚀 Configuración de Supabase para CarRacesAPI

## Paso 1: Obtener Credenciales de Supabase

### 1.1 Acceder a Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto o crea uno nuevo

### 1.2 Obtener Datos de Conexión
1. En el panel izquierdo, ve a **Settings** → **Database**
2. Busca la sección **Connection string** o **Connection pooling**
3. Aparecerá algo como:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

### 1.3 Copiar Valores Individuales
Necesitas extraer estos valores:
```
DB_HOST = db.{tu-proyecto}.supabase.co
DB_PORT = 5432 (o 6543 para connection pooling)
DB_USER = postgres
DB_PASSWORD = {tu-contraseña-postgres}
DB_NAME = postgres
```

**⚠️ IMPORTANTE:** Guarda la contraseña de postgres del proyecto en lugar seguro.

---

## Paso 2: Configurar Variables de Entorno

### 2.1 Crear archivo .env
```bash
cd c:\MasterIA\ApiCarRaces
cp .env.example .env
```

### 2.2 Editar .env con datos de Supabase
```env
# Configuración del Servidor
NODE_ENV=development
PORT=3000

# Configuración de Supabase PostgreSQL
DB_HOST=db.{TU_PROYECTO_ID}.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD={TU_CONTRASEÑA_POSTGRES}
DB_NAME=postgres
DB_LOGGING=false

# Configuración de la Aplicación
APP_NAME=CarRacesAPI
APP_VERSION=1.0.0
```

**Reemplaza:**
- `{TU_PROYECTO_ID}` → ID de tu proyecto Supabase
- `{TU_CONTRASEÑA_POSTGRES}` → Contraseña de postgres

### 2.3 Verificar Conexión
```bash
npm run dev
```

**Esperado:**
```
✅ PostgreSQL connected successfully
🚀 Server listening on http://localhost:3000
```

---

## Paso 3: Crear Tablas Automáticamente

### 3.1 Opción A: Sincronización Automática (Recomendado)
La aplicación crea las tablas automáticamente al iniciar:

```typescript
// En src/database/data-source.ts
synchronize: process.env.NODE_ENV !== 'production'
```

✅ **Esto:**
- Crea todas las 18 tablas al primera ejecución
- Añade nuevas columnas si cambias las entities
- ❌ NO elimina datos (seguro para desarrollo)

### 3.2 Opción B: Migraciones Explícitas
Para mayor control:

```bash
npm run migration:run
```

*(Las migraciones son opcionales en desarrollo)*

---

## Paso 4: Verificar Tablas en Supabase

### 4.1 En Supabase Dashboard
1. Abre tu proyecto en Supabase
2. Ve a **SQL Editor** → **New Query**
3. Ejecuta:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Debes ver:
```
clubs
users
competitions
events
roles
specialities
divisions
disciplines
surfaces
formats
driving_environments
entity_links
registrations
championships
races
race_results
user_entities
rol_entities
```

### 4.2 Verificar Estructura de una Tabla
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clubs'
ORDER BY ordinal_position;
```

---

## Paso 5: Pruebas Iniciales

### 5.1 Crear un Club
```bash
curl -X POST http://localhost:3000/api/clubs \
  -H "Content-Type: application/json" \
  -d '{
    "Alias":"test-club",
    "TaxNombre":"Test Club",
    "TaxNumero":"123456789",
    "Descripcion":"Mi primer club",
    "FechaFundacion":"2026-02-23"
  }'
```

**Respuesta esperada:**
```json
{
  "ClubId": 1,
  "Alias": "test-club",
  "TaxNombre": "Test Club",
  ...
}
```

### 5.2 Listar Clubs
```bash
curl http://localhost:3000/api/clubs
```

**Respuesta esperada:**
```json
[
  {
    "ClubId": 1,
    "Alias": "test-club",
    ...
  }
]
```

### 5.3 Verificar en Supabase
En el SQL Editor:
```sql
SELECT * FROM clubs;
```

Debes ver el club que creaste.

---

## Paso 6: Environment por Salida

### 6.1 Para Desarrollo (Local)
```env
NODE_ENV=development
DB_LOGGING=true
synchronize=true
```

### 6.2 Para Producción (Remoto)
```env
NODE_ENV=production
DB_LOGGING=false
synchronize=false
```

---

## ⚠️ Troubleshooting

### Error: connect ECONNREFUSED
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Causas posibles:**
1. ❌ Datos de conexión incorrectos
2. ❌ Contraseña mal copiada
3. ❌ HOST incorrecto

**Solución:**
```bash
# Verifica que .env tenga valores correctos:
# 1. DB_HOST debe ser: db.{proyecto}.supabase.co
# 2. DB_USER debe ser: postgres
# 3. DB_PASSWORD debe ser la contraseña guardada
# 4. Reinicia: npm run dev
```

### Error: password authentication failed
```
Error: password authentication failed for user "postgres"
```

**Solución:**
1. Ve a Supabase → Settings → Database
2. Copia la contraseña de postgres de nuevo
3. Paste en .env
4. Asegúrate sin espacios extras

### Error: database "postgres" does not exist
```
Error: database "postgres" does not exist
```

**Solución:**
- En Supabase, el nombre de BD siempre es `postgres`
- Verifica: `DB_NAME=postgres` (no otro nombre)

### Conectado pero sin tablas
```
✅ PostgreSQL connected successfully
❌ Error: relation "clubs" does not exist
```

**Solución:**
```bash
# Las tablas no se crearon. Opciones:
# 1. Reinicia el servidor (npm run dev)
# 2. Verifica que synchronize: true en data-source.ts
# 3. Verifica que node_modules tenga 'typeorm' instalado
npm install
npm run dev
```

---

## 🔐 Seguridad

### 6.1 .env NO debe estar en Git
```bash
# Verificar que .gitignore incluya:
echo ".env" >> .gitignore
```

### 6.2 Usa .env.example para referencia
Nunca comitas `.env` real, solo el template:
```
.env.example  ← incluir en git (sin valores reales)
.env          ← NUNCA incluir (credenciales reales)
```

### 6.3 Protege Contraseñas
- Nunca compartas el contenido de `.env`
- Nunca subas a GitHub
- Usa variables de entorno en Vercel/Heroku/Railway

---

## 📊 Estructura de Datos Creada

Supabase crea 18 tablas con esta estructura:

```sql
-- Ejemplo: tabla clubs
CREATE TABLE clubs (
  club_id SERIAL PRIMARY KEY,
  alias VARCHAR(255) UNIQUE NOT NULL,
  tax_nombre VARCHAR(255) NOT NULL,
  tax_numero VARCHAR(255),
  descripcion TEXT,
  fecha_fundacion DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Otras 17 tablas siguiendo el mismo patrón
```

Todas las tablas tienen:
- ✅ Primary Key auto-incrementado
- ✅ Columnas en snake_case
- ✅ Timestamps (created_at, updated_at)
- ✅ Constraints (UNIQUE, NOT NULL donde aplica)

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Supabase creada
- [ ] Proyecto creado en Supabase
- [ ] Datos de conexión copiados
- [ ] Archivo `.env` creado con valores reales
- [ ] `npm run dev` ejecutado (sin errores)
- [ ] Tablas creadas automáticamente
- [ ] SQL query confirmó 18 tablas
- [ ] Test de POST /api/clubs funcionó
- [ ] Test de GET /api/clubs devolvió datos
- [ ] `.gitignore` incluye `.env`
- [ ] `.env.example` sin valores reales

---

## 🎯 Siguiente Paso

Una vez completado:
1. ✅ Desarrollar más endpoints
2. ✅ Agregar validaciones adicionales
3. ✅ Configurar autenticación JWT
4. ✅ Desplegar a producción

---

## 📞 Recursos Supabase

- **Dashboard:** https://supabase.com/dashboard
- **Documentación:** https://supabase.com/docs
- **SQL Editor:** En tu proyecto → SQL Editor
- **Logs:** En tu proyecto → Database → Logs

---

**⏱️ Tiempo estimado de setup: 10-15 minutos**
