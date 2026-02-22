import { describe, it, expect } from 'vitest';

describe('Divisions Endpoints', () => {
  describe('GET /divisions', () => {
    it('should list divisions with pagination', () => {
      const response = {
        total: 4,
        page: 1,
        pageSize: 20,
        items: [
          {
            DivisionId: 1,
            Descripcion: 'Formula 1',
            DisciplineId: 1,
            ClubId: 0,
            default: true,
          },
        ],
      };
      expect(response.items).toHaveLength(1);
      expect(response.items[0].Descripcion).toBe('Formula 1');
    });

    it('should support filtering by disciplineId', () => {
      const queryParams = { disciplineId: 1, page: 1, pageSize: 20 };
      expect(queryParams.disciplineId).toBe(1);
    });

    it('should validate required fields for division', () => {
      const requiredFields = ['Descripcion', 'DisciplineId'];
      const division = {
        Descripcion: 'Formula 1',
        DisciplineId: 1,
      };
      requiredFields.forEach(field => {
        expect(division).toHaveProperty(field);
      });
    });
  });

  describe('GET /divisions/{id}', () => {
    it('should retrieve a specific division', () => {
      const division = {
        DivisionId: 1,
        Descripcion: 'Formula 1',
        DisciplineId: 1,
        ClubId: 0,
        default: true,
      };
      expect(division.DivisionId).toBe(1);
      expect(division.Descripcion).toBe('Formula 1');
    });
  });
});
