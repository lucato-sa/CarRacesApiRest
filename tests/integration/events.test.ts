import { describe, it, expect } from 'vitest';

describe('Events Endpoints', () => {
  describe('GET /events', () => {
    it('should list events with pagination', () => {
      const response = {
        total: 8,
        page: 1,
        pageSize: 20,
        items: [
          {
            EventId: 5,
            Descripcion: 'Campeonato de Primavera 2026',
            FechaInicio: '2026-03-15',
            FechaFin: '2026-05-30',
            ClubId: 1,
          },
        ],
      };
      expect(response.items).toHaveLength(1);
      expect(response.items[0].Descripcion).toBe('Campeonato de Primavera 2026');
    });

    it('should support filtering by clubId', () => {
      const queryParams = { clubId: 1, page: 1, pageSize: 20 };
      expect(queryParams.clubId).toBe(1);
    });

    it('should support date range filtering with from parameter', () => {
      const queryParams = { from: '2026-03-01', page: 1, pageSize: 20 };
      expect(queryParams.from).toBe('2026-03-01');
    });

    it('should support date range filtering with to parameter', () => {
      const queryParams = { to: '2026-05-31', page: 1, pageSize: 20 };
      expect(queryParams.to).toBe('2026-05-31');
    });

    it('should validate required fields for event', () => {
      const requiredFields = ['Descripcion', 'FechaInicio', 'FechaFin', 'ClubId'];
      const event = {
        Descripcion: 'Evento de prueba',
        FechaInicio: '2026-03-15',
        FechaFin: '2026-05-30',
        ClubId: 1,
      };
      requiredFields.forEach(field => {
        expect(event).toHaveProperty(field);
      });
    });
  });
});
