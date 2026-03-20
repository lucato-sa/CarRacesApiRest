/**
 * 📋 User Model - Tipos TypeScript (sin decoradores de ORM)
 * 
 * Define la estructura del usuario para:
 * ✅ Type safety en TypeScript
 * ✅ Validación de datos
 * ✅ Comunicación entre capas
 */

// DTOs - Lo que viaja en requests/responses (PascalCase)
export interface User {
  UserId?: number;
  Nick: string;
  Nombre: string;
  Apellidos: string;
  Email: string;
  Direccion?: string;
  Localidad?: string;
  Provincia?: string;
  Pais?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

// Tipos de entrada (para crear/actualizar)
export type CreateUserInput = Omit<User, 'UserId' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'UserId' | 'CreatedAt' | 'UpdatedAt'>>;

// Tipo de fila en BD (snake_case)
export interface UserRow {
  user_id: number;
  nick: string;
  nombre: string;
  apellidos: string;
  email: string;
  direccion?: string;
  localidad?: string;
  provincia?: string;
  pais?: string;
  created_at?: Date;
  updated_at?: Date;
}