# ⚡ QUICK START - Supabase en 5 Minutos

## 🚀 Setup Automático

```bash
# 1. Entrar a carpeta
cd C:\MasterIA\ApiCarRaces

# 2. Instalar dependencias
npm install

# 3. Setup interactivo (RECOMENDADO)
node setup-supabase.js

# 4. Iniciar servidor
npm run dev
```

That's it! 🎉

---

## 🔑 Valores que Necesitas de Supabase

Ve a: **https://supabase.com/dashboard → Settings → Database → Connection String**

```
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
```

Extrae:
- `DB_HOST` = `db.[PROJECT_ID].supabase.co`
- `DB_PORT` = `5432`
- `DB_USER` = `postgres`
- `DB_PASSWORD` = `[PASSWORD]` (la que está entre `:` y `@`)
- `DB_NAME` = `postgres`

---

## 📝 Opción Manual (Sin Script)

```bash
# 1. Crear .env
cp .env.example .env

# 2. Editar .env con tus valores
# 3. Guardar
# 4. npm run dev
```

---

## ✅ Verificación

```bash
# Ver si está configurado
node verify-supabase.js

# Test de conexión
node test-connection.js

# Debes ver:
# ✅ PostgreSQL/Supabase conectado exitosamente
# 🚀 Servidor escuchando en http://localhost:3000
```

---

## 🧪 Test API

```bash
# Listar clubs (vacío al inicio)
curl http://localhost:3000/api/clubs

# Crear club
curl -X POST http://localhost:3000/api/clubs \
  -H "Content-Type: application/json" \
  -d '{"Alias":"test","TaxNombre":"Test","TaxNumero":"123","Descripcion":"Test","FechaFundacion":"2026-02-23"}'

# Ver clubs de nuevo
curl http://localhost:3000/api/clubs
```

---

## 📊 Verificar Tablas en Supabase

Dashboard → SQL Editor → Ejecuta:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Debes ver 18 tablas.

---

## ❌ Errores Comunes

| Error | Solución |
|-------|----------|
| ECONNREFUSED | Verificar .env valores corretos |
| password authentication failed | Contraseña incorrecta en .env |
| relation "clubs" does not exist | Reiniciar npm run dev |
| 121 Connection reset | Reiniciar Supabase en dashboard |

---

## 🔐 Seguridad

```bash
# .env NUNCA en git
cat .gitignore | grep ".env"  # Debe mostrar .env

# Credenciales solo en .env (no en .env.example)
```

---

## 📚 Documentos Completos

- **SUPABASE_SETUP.md** - Guía detallada
- **SUPABASE_CHECKLIST.md** - Paso a paso con checkboxes
- **README_SUPABASE.md** - Documentación completa

---

## 🎯 Endpoints

18 endpoints disponibles:

```
/api/clubs
/api/users
/api/competitions
/api/events
/api/roles
/api/specialities
/api/divisions
/api/disciplines
/api/surfaces
/api/formats
/api/driving-environments
/api/entity-links
/api/registrations
/api/championships
/api/races
/api/race-results
/api/user-entities
/api/rol-entities
```

Cada uno con: GET, POST (create), GET/:id, PUT/:id, DELETE/:id

---

## `⏱️ Tiempo Estimado`

- Setup automático: **2-3 min**
- Setup manual: **5-10 min**
- Verificación: **2 min**
- Tests: **2 min**

**Total: 10-15 minutos**

---

## 📞 Ayuda

- Guía: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Checklist: [SUPABASE_CHECKLIST.md](./SUPABASE_CHECKLIST.md)
- Docs: https://supabase.com/docs
