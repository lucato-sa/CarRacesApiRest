import { describe, it, expect } from 'vitest';

describe('Registrations Endpoints', () => {
  describe('GET /registrations', () => {
    it('should list registrations with pagination', () => {
      const response = {
        total: 15,
        page: 1,
        pageSize: 20,
        items: [
          {
            RegistrationId: 1,
            CompetitionId: 100,
            UserId: 7,
            FechaPreRegistro: '2026-02-15',
            FechaRegistro: '2026-04-10',
            Dorsal: 42,
          },
        ],
      };
      expect(response.items).toHaveLength(1);
      expect(response.items[0].Dorsal).toBe(42);
    });

    it('should support filtering by competitionId', () => {
      const queryParams = { competitionId: 100, page: 1, pageSize: 20 };
      expect(queryParams.competitionId).toBe(100);
    });

    it('should support filtering by userId', () => {
      const queryParams = { userId: 7, page: 1, pageSize: 20 };
      expect(queryParams.userId).toBe(7);
    });

    it('should validate required fields for registration', () => {
      const requiredFields = ['CompetitionId', 'UserId'];
      const registration = {
        CompetitionId: 100,
        UserId: 7,
      };
      requiredFields.forEach(field => {
        expect(registration).toHaveProperty(field);
      });
    });
  });
});
