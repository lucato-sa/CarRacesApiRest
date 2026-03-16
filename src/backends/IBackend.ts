/**
 * 🔌 INTERFAZ BASE - Abstracta para todos los backends
 * Define métodos comunes que todo backend debe implementar
 */

export interface IBackend {
  /**
   * Inicializar el backend
   * - Conectar a BD
   * - Cargar datos
   * - Preparar ambiente
   */
  initialize(): Promise<void>;

  /**
   * Limpiar datos del backend
   * Usado en tests (beforeEach)
   */
  clear(): Promise<void>;

  /**
   * Cerrar conexión/recursos
   * Usado en tests (afterAll)
   */
  close(): Promise<void>;

  /**
   * Crear un registro
   */
  create(entity: string, data: any): Promise<any>;

  /**
   * Leer un registro por ID
   */
  read(entity: string, id: any): Promise<any | undefined>;

  /**
   * Leer todos los registros (con filtros opcionales)
   */
  readAll(entity: string, filters?: any): Promise<any[]>;

  /**
   * Actualizar un registro
   */
  update(entity: string, id: any, data: any): Promise<any | undefined>;

  /**
   * Eliminar un registro
   */
  delete(entity: string, id: any): Promise<void>;

  /**
   * Contar registros
   */
  count(entity: string): Promise<number>;

  /**
   * Estado del backend
   */
  isReady(): boolean;
}
