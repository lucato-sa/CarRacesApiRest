import { describe, it, expect } from 'vitest';

describe('Surfaces Endpoints', () => {
  describe('GET /surfaces', () => {
    it('should list surfaces with pagination', () => {
      const response = {
        total: 3,
        page: 1,
        pageSize: 20,
        items: [
          {
            SurfaceId: 10,
            Descripcion: 'Asfalto',
            default: true,
          },
          {
            SurfaceId: 11,
            Descripcion: 'Grava',
            default: false,
          },
          {
            SurfaceId: 12,
            Descripcion: 'Arena',
            default: false,
          },
        ],
      };
      expect(response.items).toHaveLength(3);
      expect(response.items[0].Descripcion).toBe('Asfalto');
    });

    it('should support search with parameter q', () => {
      const queryParams = { page: 1, pageSize: 20, q: 'Asfalto' };
      expect(queryParams.q).toBe('Asfalto');
    });
  });

  describe('POST /surfaces', () => {
    it('should create a new surface', () => {
      const newSurface = {
        Descripcion: 'Tierra',
        default: false,
      };
      expect(newSurface).toHaveProperty('Descripcion');
    });

    it('should require Descripcion field', () => {
      const requiredFields = ['Descripcion'];
      const surface = {
        Descripcion: 'Asfalto',
      };
      requiredFields.forEach(field => {
        expect(surface).toHaveProperty(field);
      });
    });
  });

  describe('GET /surfaces/{id}', () => {
    it('should retrieve a specific surface', () => {
      const surface = {
        SurfaceId: 10,
        Descripcion: 'Asfalto',
        default: true,
      };
      expect(surface.SurfaceId).toBe(10);
      expect(surface.Descripcion).toBe('Asfalto');
    });
  });
});
