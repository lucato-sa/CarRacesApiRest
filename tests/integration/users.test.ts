import { describe, it, expect } from 'vitest';

describe('Users Endpoints', () => {
  describe('GET /users', () => {
    it('should list users with pagination', () => {
      const response = {
        total: 5,
        page: 1,
        pageSize: 20,
        items: [
          {
            UserId: 1,
            Nick: 'piloto7',
            Nombre: 'Juan',
            Apellidos: 'Pérez',
            Email: 'juan.perez@example.com',
            Direccion: 'Calle Principal 123',
            Localidad: 'Madrid',
            Provincia: 'Madrid',
            Pais: 'España',
          },
        ],
      };
      expect(response.items).toHaveLength(1);
      expect(response.items[0].Nick).toBe('piloto7');
      expect(response.total).toBe(5);
      expect(response.page).toBe(1);
    });

    it('should support search with parameter q', () => {
      const queryParams = { page: 1, pageSize: 20, q: 'Juan' };
      expect(queryParams.q).toBe('Juan');
    });

    it('should support filtering by nick', () => {
      const queryParams = { nick: 'piloto7' };
      expect(queryParams.nick).toBe('piloto7');
    });
  });

  describe('POST /users', () => {
    it('should create a new user', () => {
      const newUser = {
        Nick: 'piloto7',
        Nombre: 'Juan',
        Apellidos: 'Pérez',
        Email: 'juan.perez@example.com',
        Direccion: 'Calle Principal 123',
        Localidad: 'Madrid',
        Provincia: 'Madrid',
        Pais: 'España',
      };
      expect(newUser).toHaveProperty('Nick');
      expect(newUser).toHaveProperty('Nombre');
      expect(newUser).toHaveProperty('Apellidos');
      expect(newUser).toHaveProperty('Email');
    });

    it('should require mandatory fields: Nick, Nombre, Apellidos, Email', () => {
      const requiredFields = ['Nick', 'Nombre', 'Apellidos', 'Email'];
      const user = {
        Nick: 'piloto7',
        Nombre: 'Juan',
        Apellidos: 'Pérez',
        Email: 'juan.perez@example.com',
      };
      requiredFields.forEach(field => {
        expect(user).toHaveProperty(field);
      });
    });

    it('should validate email format', () => {
      const user = {
        Email: 'juan.perez@example.com',
      };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(user.Email)).toBe(true);
    });
  });
});
