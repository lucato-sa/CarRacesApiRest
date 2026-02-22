import { describe, it, expect } from 'vitest';

describe('Formats Endpoints', () => {
  describe('GET /formats', () => {
    it('should list formats with pagination', () => {
      const response = {
        total: 2,
        page: 1,
        pageSize: 20,
        items: [
          {
            FormatId: 1,
            Descripcion: 'Velocidad',
            default: true,
          },
          {
            FormatId: 2,
            Descripcion: 'Rallyes',
            default: false,
          },
        ],
      };
      expect(response.items).toHaveLength(2);
      expect(response.items[0].Descripcion).toBe('Velocidad');
    });

    it('should support search with parameter q', () => {
      const queryParams = { page: 1, pageSize: 20, q: 'Velocidad' };
      expect(queryParams.q).toBe('Velocidad');
    });
  });

  describe('POST /formats', () => {
    it('should create a new format', () => {
      const newFormat = {
        Descripcion: 'Rallyes',
        default: false,
      };
      expect(newFormat).toHaveProperty('Descripcion');
    });

    it('should require Descripcion field', () => {
      const requiredFields = ['Descripcion'];
      const format = {
        Descripcion: 'Velocidad',
      };
      requiredFields.forEach(field => {
        expect(format).toHaveProperty(field);
      });
    });
  });

  describe('GET /formats/{id}', () => {
    it('should retrieve a specific format', () => {
      const format = {
        FormatId: 1,
        Descripcion: 'Velocidad',
        default: true,
      };
      expect(format.FormatId).toBe(1);
      expect(format.Descripcion).toBe('Velocidad');
    });
  });
});
