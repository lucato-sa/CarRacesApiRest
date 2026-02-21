Servidor Express en TypeScript

Instrucciones para ejecutar el servidor localmente:

1. Instala dependencias:

```bash
npm install
```

2. Desarrollo (hot-reload):

```bash
npm run dev
```

Esto usa `ts-node-dev` y sirve `src/server.ts` con reinicio automático al guardar.

3. Compilar y ejecutar:

```bash
npm run build
npm start
```

4. Probar:

Abre en el navegador o usa curl:

```bash
curl http://localhost:3000/
# Debe devolver: Hello Word
```
