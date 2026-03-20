# 🚀 GUÍA DE CONFIGURACIÓN - PRODUCCIÓN Y AMBIENTES

## 📋 Resumen de Cambios

Se ha refactorizado la configuración de base de datos para:

✅ **Centralizar la configuración** en `src/config/database.config.ts`
✅ **Mapear campos** automáticamente entre DTO (PascalCase) y BD (snake_case)  
✅ **Soportar múltiples ambientes** (development, staging, production)  
✅ **Funcionar con cualquier backend** (memory, file, postgres, supabase)  
✅ **Listo para producción** con validaciones y logs

---

## 🏗️ Estructura de Configuración

```
src/
├── config/
│   ├── database.config.ts        ← 🆕 Configuración centralizada
│   └── ...
├── database/
│   └── data-source.ts             ← Actualizado: usa database.config.ts
├── backends/
│   ├── SupabaseBackend.ts          ← Actualizado: usa mapeo de campos
│   ├── PostgresBackend.ts
│   └── ...
└── app.ts
```

---

## 🔄 Flujo de Transformación de Datos

```
REQUEST HTTP (PascalCase)
    ↓
Repository / UseCase (DTO PascalCase)
    ↓
Backend.create() → dtoToDb()  ← 🔄 TRANSFORMA
    ↓
BD (snake_case)
    ↓
Backend.read() → dbToDto()   ← 🔄 TRANSFORMA
    ↓
Repository / UseCase (DTO PascalCase)
    ↓
RESPONSE HTTP (PascalCase)
```

---

## 🎯 AMBIENTE: DEVELOPMENT (Local)

### Opción A: Sin Base de Datos (Memory Backend) - Recomendado para tests rápidos

```bash
# .env
NODE_ENV=development
BACKEND=memory

# Ejecutar
npm run test -- -t Clubs
npm run dev
```

### Opción B: PostgreSQL Local

```bash
# Instalar PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# Iniciar servicio
sudo service postgresql start  # Linux
brew services start postgresql  # Mac

# Crear BD
createdb -U postgres carracesapi

# .env
NODE_ENV=development
BACKEND=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=carracesapi
DB_LOGGING=true          # Para ver queries SQL

# Ejecutar
npm run dev              # Servidor con TypeORM
npm run test            # Tests con memory
npm run test:postgres   # Tests con PostgreSQL
```

---

## 🌐 AMBIENTE: STAGING (Supabase Cloud)

### 1. Crear proyecto en Supabase

```
1. Ir a https://supabase.com
2. Crear nuevo proyecto
3. Ir a Settings → Database → Connection Info
4. Copiar URL y contraseña
```

### 2. Configurar variables de entorno

```bash
# .env (o CI/CD secrets)
NODE_ENV=staging
BACKEND=supabase

# De Supabase Dashboard
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Para acceso PSQL directo (si necesario)
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-postgres-password
DB_NAME=postgres
```

### 3. Verificar conexión

```bash
# Desde terminal
npm run test:supabase -- -t "should create a club"

# Deberías ver:
# ✅ Supabase Backend initialized
# ✅ Clubs test passed
```

### 4. Crear esquema en Supabase

```bash
# Opción A: Usar migrations de TypeORM (si las tienes)
npm run migration:run

# Opción B: Ejecutar SQL manualmente en Supabase SQL Editor
# Copiar las tablas de tu local:
psql -h db.your-project.supabase.co -U postgres -d postgres -f dump.sql
```

---

## 🔒 AMBIENTE: PRODUCTION

### 1. Configuración Recomendada

```bash
NODE_ENV=production
BACKEND=supabase

# NO guardar en .env - usar CI/CD secrets
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_KEY=eyjhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DB_LOGGING=false
```

### 2. GitHub Actions (para CI/CD)

```yaml
# .github/workflows/deploy.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      NODE_ENV: production
      BACKEND: supabase
      SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
      SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}

    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm run test:supabase

      - name: Build
        run: npm run build

      - name: Deploy
        run: npm start
```

### 3. Configuración de SSL

Supabase ya tiene SSL configurado automáticamente. En `database.config.ts`:

```typescript
// Producción: rejectUnauthorized = true (validar certificados)
ssl: {
  rejectUnauthorized: process.env.NODE_ENV === 'production',
}
```

### 4. Monitoreo

```bash
# Ver logs de base de datos
psql -h db.your-prod-project.supabase.co -U postgres -d postgres

# Ver logs de aplicación
pm2 logs
```

---

## 🧪 TESTING EN DIFERENTES AMBIENTES

### Tests en Memory (Rápidos)

```bash
npm run test -- -t Clubs
# Resultado: ~500ms, sin BD
```

### Tests en PostgreSQL Local

```bash
npm run test:postgres -- -t Clubs
# Resultado: ~2-3s, con BD local
```

### Tests en Supabase Cloud

```bash
npm run test:supabase -- -t Clubs
# Resultado: ~5-10s, con BD remota
# ⚠️ Requiere SUPABASE_URL y SUPABASE_KEY correctos
```

### Tests en todos los ambientes

```bash
npm run test:all
# Ejecuta: memory + file + postgres + supabase
```

---

## 📝 MAPEO DE CAMPOS

El archivo `database.config.ts` contiene un mapeo de todos los campos DTO ↔ BD:

```typescript
FIELD_MAPPINGS: {
  clubs: {
    'ClubId': 'club_id',          // DTO → BD
    'Alias': 'alias',
    'TaxNombre': 'tax_nombre',
    'TaxNumero': 'tax_numero',
    ...
  },
  users: {
    'UserId': 'user_id',
    'Nick': 'nick',
    ...
  },
  // Agregar más entidades según necesites
}
```

**Importante**: Si agregas nuevas entidades, añade el mapeo en `FIELD_MAPPINGS`.

---

## 🐛 DEBUGGING

### Activar logs SQL

```bash
# .env
DB_LOGGING=true
NODE_ENV=development

# Verás queries en consola
npm run dev
```

### Logs del SupabaseBackend

```bash
# El backend ya log todas las transformaciones:
📝 Inserting clubs: { alias: "...", tax_nombre: "..." }
✅ Club created: { Alias: "...", TaxNombre: "..." }
❌ Supabase error for clubs: "Could not find 'Alias' column"
```

### Test de conexión Supabase

```bash
npm run test:supabase -- --reporter=verbose -t "should create a club"
```

---

## ✅ CHECKLIST PRE-PRODUCCIÓN

- [ ] `NODE_ENV=production` en CI/CD
- [ ] Secrets guardados en GitHub Secrets (SUPABASE_URL, SUPABASE_KEY)
- [ ] Base de datos Supabase creada
- [ ] Tablas migradas a Supabase
- [ ] Tests pasando en `npm run test:supabase`
- [ ] `DB_LOGGING=false` en producción
- [ ] SSL verificado con certificados válidos
- [ ] Backups configurados en Supabase
- [ ] Monitoreo de logs activo
- [ ] `.env` y credenciales NO en git

---

## 🔗 Referencias

- **Supabase**: https://supabase.com/docs
- **TypeORM**: https://typeorm.io/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **GitHub Actions**: https://docs.github.com/en/actions
