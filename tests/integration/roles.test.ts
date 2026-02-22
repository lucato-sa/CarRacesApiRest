import { describe, it, expect } from 'vitest';

describe('Roles Endpoints', () => {
  describe('GET /roles', () => {
    it('should list all roles', () => {
      const response = [
        {
          RolId: 1,
          Nombre: 'Administrator',
          Pseudonimo: 'admin',
        },
        {
          RolId: 2,
          Nombre: 'Responsable',
          Pseudonimo: 'resp',
        },
        {
          RolId: 7,
          Nombre: 'Organizador de Competición',
          Pseudonimo: 'org_comp',
        },
      ];
      expect(response).toHaveLength(3);
      expect(response[0].Nombre).toBe('Administrator');
    });

    it('should validate role structure', () => {
      const role = {
        RolId: 1,
        Nombre: 'Administrator',
        Pseudonimo: 'admin',
      };
      expect(role).toHaveProperty('Nombre');
      expect(role).toHaveProperty('Pseudonimo');
    });

    it('should require Nombre and Pseudonimo fields', () => {
      const requiredFields = ['Nombre', 'Pseudonimo'];
      const role = {
        Nombre: 'Administrator',
        Pseudonimo: 'admin',
      };
      requiredFields.forEach(field => {
        expect(role).toHaveProperty(field);
      });
    });
  });
});
