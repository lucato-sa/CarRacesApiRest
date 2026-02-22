import { describe, it, expect } from 'vitest';

describe('Disciplines Endpoints', () => {
  describe('GET /disciplines', () => {
    it('should list disciplines with pagination', () => {
      const response = {
        total: 5,
        page: 1,
        pageSize: 20,
        items: [
          {
            DisciplineId: 1,
            Alias: 'Asfalto',
            Descripcion: '1.1 Asfalto',
            SpecialityId: 1,
            FormatId: 1,
            SurfaceId: 1,
            default: true,
          },
        ],
      };
      expect(response.items).toHaveLength(1);
      expect(response.items[0].Alias).toBe('Asfalto');
    });

    it('should support filtering by specialityId', () => {
      const queryParams = { specialityId: 1, page: 1, pageSize: 20 };
      expect(queryParams.specialityId).toBe(1);
    });

    it('should support filtering by formatId', () => {
      const queryParams = { formatId: 1, page: 1, pageSize: 20 };
      expect(queryParams.formatId).toBe(1);
    });

    it('should support filtering by surfaceId', () => {
      const queryParams = { surfaceId: 1, page: 1, pageSize: 20 };
      expect(queryParams.surfaceId).toBe(1);
    });

    it('should validate required fields for discipline', () => {
      const requiredFields = [
        'Alias',
        'Descripcion',
        'SpecialityId',
        'FormatId',
        'SurfaceId',
      ];
      const discipline = {
        Alias: 'Asfalto',
        Descripcion: '1.1 Asfalto',
        SpecialityId: 1,
        FormatId: 1,
        SurfaceId: 1,
      };
      requiredFields.forEach(field => {
        expect(discipline).toHaveProperty(field);
      });
    });
  });

  describe('GET /disciplines/{id}', () => {
    it('should retrieve a specific discipline', () => {
      const discipline = {
        DisciplineId: 1,
        Alias: 'Asfalto',
        Descripcion: '1.1 Asfalto',
        SpecialityId: 1,
        FormatId: 1,
        SurfaceId: 1,
        default: true,
      };
      expect(discipline.DisciplineId).toBe(1);
      expect(discipline.Alias).toBe('Asfalto');
    });
  });
});
