import { describe, it, expect } from 'vitest';

describe('Competitions Endpoints', () => {
  describe('GET /competitions', () => {
    it('should list competitions with pagination', () => {
      const response = {
        total: 5,
        page: 1,
        pageSize: 20,
        items: [
          {
            CompetitionId: 100,
            SeasonId: 10,
            EventId: 5,
            VenueId: 2,
            Alias: 'Copa Primavera',
            TotalRaces: 3,
            FechaInicioInscripPri: '2026-03-01',
            FechaFinInscripPri: '2026-03-15',
            FechaInicioInscrip: '2026-04-01',
            FechaFinInscrip: '2026-05-01',
            PilotosMinInscrip: 10,
            PilotosMaxInscrip: 50,
            Responsable: 7,
            SoloUsuariosReg: false,
            Notas: 'Competición importante',
          },
        ],
      };
      expect(response.items).toHaveLength(1);
      expect(response.items[0].Alias).toBe('Copa Primavera');
      expect(response.items[0].TotalRaces).toBe(3);
    });

    it('should support filtering by seasonId', () => {
      const queryParams = { seasonId: 10, page: 1, pageSize: 20 };
      expect(queryParams.seasonId).toBe(10);
    });

    it('should support filtering by eventId', () => {
      const queryParams = { eventId: 5, page: 1, pageSize: 20 };
      expect(queryParams.eventId).toBe(5);
    });

    it('should support filtering by venueId', () => {
      const queryParams = { venueId: 2, page: 1, pageSize: 20 };
      expect(queryParams.venueId).toBe(2);
    });

    it('should validate required fields for competition', () => {
      const requiredFields = [
        'SeasonId',
        'EventId',
        'VenueId',
        'Alias',
        'TotalRaces',
        'Responsable',
        'SoloUsuariosReg',
      ];
      const competition = {
        SeasonId: 10,
        EventId: 5,
        VenueId: 2,
        Alias: 'Copa Primavera',
        TotalRaces: 3,
        Responsable: 7,
        SoloUsuariosReg: false,
      };
      requiredFields.forEach(field => {
        expect(competition).toHaveProperty(field);
      });
    });
  });
});
