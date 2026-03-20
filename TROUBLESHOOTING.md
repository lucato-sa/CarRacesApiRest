# 🔧 TROUBLESHOOTING - Errores Comunes

## Error: "Could not find the 'Alias' column of 'clubs'"

### 🐛 Causa
El SupabaseBackend está enviando `Alias` pero la BD espera `alias` (snake_case).

### ✅ Solución (APLICADA)
- ✅ Crear mapeo centralizado en `src/config/database.config.ts`
- ✅ Usar `dtoToDb()` antes de insertar en la BD
- ✅ Usar `dbToDto()` después de leer de la BD

### 🧪 Verificar que funciona
```bash
npm run test:supabase -- -t "should create a club" --reporter=verbose
```

Deberías ver:
```
✅ Supabase Backend initialized
📝 Inserting clubs: { alias: "Carreras Madrid", tax_nombre: "...", ... }
✅ Club created: { Alias: "Carreras Madrid", TaxNombre: "...", ... }
```

---

## Error: "Supabase URL and Key are required"

### 🐛 Causa
No tienes SUPABASE_URL o SUPABASE_KEY en el .env

### ✅ Solución
```bash
# 1. Copiar .env.example
cp .env.example .env

# 2. Obtener credenciales de Supabase
# https://supabase.com/dashboard → Settings → API

# 3. Completar .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 4. Verificar
npm run test:supabase
```

---

## Error: "No test files found, exiting with code 1"

### 🐛 Causa
Sintaxis incorrecta en el comando de tests

### ✅ Soluciones

```bash
# ❌ INCORRECTO
npm run test:supabase -- --reporter=verbose Clubs

# ✅ CORRECTO
npm run test:supabase -- --reporter=verbose -t "Clubs"

# ❌ INCORRECTO  
npm run test:supabase -- --reporter=verbose -t 'should create a club'

# ✅ CORRECTO
npm run test:supabase -- -t "should create a club"
```

---

## Error: "ECONNREFUSED - Connection refused"

### 🐛 Causa
PostgreSQL/Supabase no accesible

### ✅ Soluciones

**Si usas PostgreSQL local:**
```bash
# Verificar que PostgreSQL está corriendo
sudo service postgresql start  # Linux
brew services start postgresql  # Mac

# Verificar credenciales en .env
psql -h localhost -U postgres -d carracesapi
```

**Si usas Supabase:**
```bash
# Verificar credenciales
echo $SUPABASE_URL
echo $SUPABASE_KEY

# Verificar conectividad
ping db.project.supabase.co

# Si tienes firewall, permitir conexiones
```

---

## Diferencias entre Ambientes

```
MEMORY (npm run test)
├─ Ventajas: Rápido, sin dependencias
├─ Desventajas: No persiste BD
└─ Uso: Tests unitarios

POSTGRESQL LOCAL (npm run test:postgres)
├─ Ventajas: Realista, persiste BD
├─ Desventajas: Requiere PostgreSQL instalado
└─ Uso: Tests de integración local

SUPABASE (npm run test:supabase)
├─ Ventajas: Cloud, igual a producción
├─ Desventajas: Lento, requiere internet, requiere credenciales
└─ Uso: Tests de integración cloud, pre-producción
```

---

## Verificar Configuración

```bash
# 1. Ver qué backend estás usando
echo $BACKEND

# 2. Cambiar backend para tests
BACKEND=supabase npm run test -- -t Clubs

# 3. Ver variables de BD
echo "HOST: $DB_HOST"
echo "PORT: $DB_PORT"
echo "USER: $DB_USER"
echo "DB: $DB_NAME"

# 4. Ver Supabase
echo "SUPABASE_URL: $SUPABASE_URL"
echo "SUPABASE_KEY: $(echo $SUPABASE_KEY | head -c 20)..." (partially masked)
```

---

## Logs Útiles

### Habilitar todos los logs

```bash
# En .env
NODE_ENV=development
DB_LOGGING=true        # Logs de SQL

# Ejecutar con verbose
npm run test:supabase -- --reporter=verbose
```

### Ver logs de SupabaseBackend

```typescript
// Ya están en el código:
console.log('☁️ Initializing Supabase Backend...')   // Init
console.log('✅ Supabase Backend initialized')       // Success
console.log('📝 Inserting clubs:', dbData)            // Datos
console.log('❌ Supabase error for clubs:', error)    // Error
```

---

## Más Ayuda

Si el problema persiste:

1. **Ver el archivo de log completo**
   ```bash
   npm run test:supabase 2>&1 | tee test.log
   cat test.log
   ```

2. **Ejecutar test con delays**
   ```bash
   npm run test:supabase -- -t Clubs --reporter=verbose --bail
   ```

3. **Limpiar caché y reinstalar**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run test:supabase
   ```

4. **Verificar que la tabla existe en Supabase**
   ```bash
   # Ir a Supabase Dashboard → SQL Editor
   SELECT * FROM clubs;
   ```
