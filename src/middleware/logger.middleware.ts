import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para registrar logs de las peticiones HTTP.
 * Captura: método, ruta, status code, duración y timestamp.
 */
export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const method = req.method;
  const path = req.path;
  const timestamp = new Date().toISOString();

  // Interceptar el método send() de Response para capturar el status code
  const originalSend = res.send;
  res.send = function (data: unknown) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusColor = getStatusColor(statusCode);

    // Formato del log
    const logMessage = `[${timestamp}] ${method.padEnd(6)} ${path.padEnd(30)} ${statusColor}${statusCode}${'\x1b[0m'} - ${duration}ms`;
    
    // eslint-disable-next-line no-console
    console.log(logMessage);

    // Llamar al método original
    return originalSend.call(this, data);
  };

  next();
}

/**
 * Retorna color ANSI basado en el status code para mejor visualización en consola.
 */
function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return '\x1b[31m'; // Rojo (error 5xx)
  if (statusCode >= 400) return '\x1b[33m'; // Amarillo (error 4xx)
  if (statusCode >= 300) return '\x1b[36m'; // Cyan (redirect 3xx)
  if (statusCode >= 200) return '\x1b[32m'; // Verde (éxito 2xx)
  return '\x1b[0m'; // Sin color (default)
}
