# ✅ CHECKLIST: Configuración de Supabase Paso a Paso

## 📋 ANTES DE EMPEZAR

- [ ] Tienes una cuenta en [Supabase.com](https://supabase.com)
- [ ] Has creado un proyecto en Supabase
- [ ] Tienes Node.js v16+ instalado
- [ ] Estás en la carpeta `C:\MasterIA\ApiCarRaces`

---

## 🎯 PASO 1: OBTENER CREDENCIALES SUPABASE

### 1.1 Acceder a tu proyecto
- [ ] Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] Selecciona tu proyecto

### 1.2 Obtener Connection String
- [ ] En el menú izquierdo → **Settings**
- [ ] Luego → **Database**
- [ ] Busca **Connection Pooling** (o Connection String)
- [ ] Selecciona **Transaction mode** si ves opciones
- [ ] Copia el string que dice:
```
postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

### 1.3 Extraer valores individuales
De la connection string anterior, extrae:
- [ ] **DB_HOST** = `db.xxxxx.supabase.co` (la parte del dominio)
- [ ] **DB_PORT** = `5432` (siempre igual)
- [ ] **DB_USER** = `postgres` (siempre igual)
- [ ] **DB_PASSWORD** = la contraseña (la que vemos entre `:` y `@`)
- [ ] **DB_NAME** = `postgres` (siempre igual)

**Escribe aquí tus valores para referencia:**
```
DB_HOST: db.zpjtezlpqipgozgdgyla.supabase.co
DB_PORT: 5432
DB_USER: postgres
DB_PASSWORD: ______________
DB_NAME: postgres
```

---

## 🔧 PASO 2: CONFIGURAR ARCHIVO .env

### Opción A: AUTOMÁTICO (Recomendado)
```bash
cd C:\MasterIA\ApiCarRaces
node setup-supabase.js
```

El script te hará preguntas interactivas. ✅ Más fácil.

### Opción B: MANUAL

#### 2.1 Crear archivo .env
```bash
cd C:\MasterIA\ApiCarRaces
cp .env.example .env
```

#### 2.2 Editar el archivo
- [ ] Abre `C:\MasterIA\ApiCarRaces\.env` en tu editor
- [ ] Busca estas líneas:
```env
DB_HOST=db.XXXXXXXXXXXX.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres_supabase
DB_NAME=postgres
```

#### 2.3 Reemplazar valores
- [ ] Reemplaza `XXXXXXXXXXXX` con tu ID de proyecto (ej: `abc123xyz`)
- [ ] Reemplaza `tu_contraseña_postgres_supabase` con tu contraseña real
- [ ] Guarda el archivo (Ctrl+S)

**Resultado esperado:**
```env
DB_HOST=db.abc123xyz.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=mySuperSecretPassword123
DB_NAME=postgres
```

**⚠️ IMPORTANTE:** No dejes caracteres especiales sin escapar en la contraseña.

---

## 🧪 PASO 3: VERIFICAR CONFIGURACIÓN

### 3.1 Ver archivo generado
```bash
# Mostrar contenido de .env (sin mostrar valores sensibles)
type .env | findstr "^DB_"
```

Debes ver:
```
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=****
DB_NAME=postgres
```

### 3.2 Verificar que está completo
```bash
node verify-supabase.js
```

- [ ] Debe decir "✅ Archivo .env encontrado"
- [ ] Debe mostrar todos los valores configurados (con ✅)
- [ ] Si hay ❌, edita .env y rellena los valores

---

## 🚀 PASO 4: INICIAR EL SERVIDOR

### 4.1 Instalar dependencias
```bash
npm install
```

- [ ] Debe completarse sin errores
- [ ] Verifica que veas `npm notice`

### 4.2 Iniciar servidor
```bash
npm run dev
```

### 4.3 Verificar que funciona
Debes ver en la consola:
```
📡 Conectando a base de datos...
   Host: db.xxxxx.supabase.co
   Puerto: 5432
   BD: postgres
✅ PostgreSQL/Supabase conectado exitosamente
🚀 Servidor escuchando en http://localhost:3000
📊 18 tablas disponibles desde la base de datos
```

- [ ] Si ves ✅ → ¡Conexión exitosa!
- [ ] Si ves ❌ → Ver sección Troubleshooting abajo

---

## 📊 PASO 5: VERIFICAR TABLAS EN SUPABASE

### 5.1 En Supabase Dashboard
- [ ] Ve a [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Selecciona tu proyecto
- [ ] En el menú izquierdo → **SQL Editor** (o **Browser**)
- [ ] Debes ver las 18 tablas listadas

**Tablas esperadas:**
```
✅ clubs
✅ users
✅ competitions
✅ events
✅ roles
✅ specialities
✅ divisions
✅ disciplines
✅ surfaces
✅ formats
✅ driving_environments
✅ entity_links
✅ registrations
✅ championships
✅ races
✅ race_results
✅ user_entities
✅ rol_entities
```

### 5.2 Verificar estructura de una tabla
En SQL Editor, ejecuta:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clubs'
ORDER BY ordinal_position;
```

Debes ver columnas como:
```
club_id         | integer  | NO
alias           | character | NO
tax_nombre      | character | NO
tax_numero      | character | YES
...
```

- [ ] Confirma que la tabla tiene columnas

---

## 🧪 PASO 6: PROBAR API

### 6.1 Test 1: Listar clubs (GET)
```bash
curl http://localhost:3000/api/clubs
```

Esperado (array vacío al inicio):
```json
[]
```

- [ ] Debes recibir `[]` o error 200 OK

### 6.2 Test 2: Crear un club (POST)
```bash
curl -X POST http://localhost:3000/api/clubs \
  -H "Content-Type: application/json" \
  -d "{\"Alias\":\"test-club\",\"TaxNombre\":\"Test Club\",\"TaxNumero\":\"12345\",\"Descripcion\":\"Test\",\"FechaFundacion\":\"2026-02-23\"}"
```

Esperado (respuesta con ID):
```json
{
  "ClubId": 1,
  "Alias": "test-club",
  "TaxNombre": "Test Club",
  ...
}
```

- [ ] Debes recibir status 201 Created con el club creado

### 6.3 Test 3: Verificar en Supabase
En SQL Editor, ejecuta:
```sql
SELECT * FROM clubs;
```

- [ ] Debes ver el club que acabas de crear

### 6.4 Test 4: Listar clubs de nuevo (GET)
```bash
curl http://localhost:3000/api/clubs
```

Esperado (ahora con datos):
```json
[
  {
    "ClubId": 1,
    "Alias": "test-club",
    "TaxNombre": "Test Club",
    ...
  }
]
```

- [ ] Debes ver el club en la lista

---

## ✅ PASO 7: VALIDACIÓN FINAL

- [ ] ✅ Servidor inicia sin errores
- [ ] ✅ 18 tablas existen en Supabase
- [ ] ✅ POST /api/clubs crea datos
- [ ] ✅ GET /api/clubs devuelve datos
- [ ] ✅ Datos persisten en Supabase

---

## 🎉 ¡COMPLETADO!

Tu API está configurada y funcionando con Supabase. 

**Ahora puedes:**
- Desarrollar nuevos endpoints
- Agregar más funcionalidades
- Desplegar a producción
- Invitar otros desarrolladores

---

## 🚨 TROUBLESHOOTING

### Problema: "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Causas:**
- Valores incorrectos en .env
- Contraseña mal copiada
- Host incorrecto

**Soluciones:**
```bash
# 1. Verificar valores en .env
type .env | findstr "^DB_"

# 2. Copiar credenciales nuevamente de Supabase Dashboard
# 3. Ejecutar nuevamente
npm run dev
```

### Problema: "Error: password authentication failed"

**Causa:** Contraseña incorrecta

**Solución:**
```bash
# 1. Ve a Supabase Dashboard → Settings → Database
# 2. Si necesitas reset: Reset Password
# 3. Copia la contraseña nueva
# 4. Actualiza .env
# 5. npm run dev
```

### Problema: "Error: database 'postgres' does not exist"

**Verificar:**
- DB_NAME debe ser exactamente: `postgres`
- No otro nombre de base de datos

**Solución:**
```env
DB_NAME=postgres   # ← Siempre "postgres" en Supabase
```

### Problema: "Tablas no se crearon"

**Verificar:**
```bash
# 1. node verify-supabase.js
# 2. Reinicia: npm run dev
# 3. Espera 5-10 segundos
# 4. Revisa Supabase Dashboard → SQL Editor
```

### Problema: "121 Connection reset"

**Causa:** Posible timeout o problema de red

**Soluciones:**
```bash
# 1. Reinicia el servidor:
npm run dev

# 2. Si persiste, reinicia Supabase:
# Ve a Supabase Dashboard → Settings → Restart Database

# 3. Espera 2-3 minutos
```

---

## 📞 Recursos

- **Guía Completa:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Documentación Supabase:** https://supabase.com/docs
- **Dashboard:** https://supabase.com/dashboard
- **Issues:** https://github.com/lucato-sa/CarRacesApiRest/issues

---

**Última actualización:** Feb 23, 2026  
**Tiempo estimado:** 15-20 minutos  
**Status:** ✅ Ready
