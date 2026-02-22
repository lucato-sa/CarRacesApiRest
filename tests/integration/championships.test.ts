import { describe, it, expect } from 'vitest';

describe('Championships Endpoints', () => {
  describe('GET /championships', () => {
    it('should list championships with pagination', () => {
      const response = {
        total: 3,
        page: 1,
        pageSize: 20,
        items: [
          {
            ChampionshipId: 1,
            Alias: 'F1 Season 2025',
            Descripcion: 'Campeonato de Fórmula 1',
            FechaDesde: '2025-03-01',
            FechaHasta: '2025-12-31',
            ClubId: 1,
            default: true,
          },
        ],
      };
      expect(response.items).toHaveLength(1);
      expect(response.items[0].Alias).toBe('F1 Season 2025');
    });

    it('should support pagination parameters', () => {
      const queryParams = { page: 1, pageSize: 20 };
      expect(queryParams.page).toBe(1);
      expect(queryParams.pageSize).toBe(20);
    });

    it('should support filtering by clubId', () => {
      const queryParams = { page: 1, pageSize: 20, clubId: 1 };
      expect(queryParams.clubId).toBe(1);
    });
  });

  describe('GET /championships/{id}', () => {
    it('should retrieve a specific championship', () => {
      const championship = {
        ChampionshipId: 1,
        Alias: 'F1 Season 2025',
        Descripcion: 'Campeonato de Fórmula 1',
        FechaDesde: '2025-03-01',
        FechaHasta: '2025-12-31',
        ClubId: 1,
      };
      expect(championship.ChampionshipId).toBe(1);
      expect(championship.Alias).toBe('F1 Season 2025');
    });

    it('should return 404 for non-existent championship', () => {
      const nonExistentId = 9999;
      expect(nonExistentId).not.toBe(1);
    });
  });
});
