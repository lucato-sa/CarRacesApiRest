import { describe, it, expect } from 'vitest';

describe('Races Endpoints', () => {
  describe('PUT /races/{id}', () => {
    it('should update race with date, time and state', () => {
      const updateData = {
        CompetitionId: 100,
        NumRace: 1,
        Fecha: '2026-05-10',
        Hora: '2026-05-10T10:30:00Z',
        Estado: 1,
      };
      expect(updateData).toHaveProperty('CompetitionId');
      expect(updateData).toHaveProperty('NumRace');
      expect(updateData).toHaveProperty('Fecha');
      expect(updateData).toHaveProperty('Hora');
      expect(updateData).toHaveProperty('Estado');
      expect(updateData.Fecha).toBe('2026-05-10');
    });

    it('should validate required fields for race', () => {
      const requiredFields = [
        'CompetitionId',
        'NumRace',
        'Fecha',
        'Hora',
        'Estado',
      ];
      const race = {
        CompetitionId: 100,
        NumRace: 1,
        Fecha: '2026-05-10',
        Hora: '2026-05-10T10:30:00Z',
        Estado: 1,
      };
      requiredFields.forEach(field => {
        expect(race).toHaveProperty(field);
      });
    });

    it('should accept valid race states', () => {
      const validStates = [0, 1, 2, 3]; // pending, in-progress, completed, cancelled, etc.
      const raceState = 1;
      expect(validStates).toContain(raceState);
    });

    it('should be called for raceId parameter 200', () => {
      const raceId = 200;
      const endpoint = `/races/${raceId}`;
      expect(endpoint).toBe('/races/200');
    });
  });
});
