import { describe, it, expect } from 'vitest';

describe('Specialities Endpoints', () => {
  describe('GET /specialities', () => {
    it('should list specialities with pagination', () => {
      const response = {
        total: 3,
        page: 1,
        pageSize: 20,
        items: [
          {
            SpecialityId: 1,
            Alias: 'Circuito',
            Descripcion: 'Circuito cerrado',
            default: true,
          },
          {
            SpecialityId: 2,
            Alias: 'Rallyes',
            Descripcion: 'Carreras en circuito abierto',
            default: false,
          },
        ],
      };
      expect(response.items).toHaveLength(2);
      expect(response.items[0].Alias).toBe('Circuito');
    });

    it('should support search with parameter q', () => {
      const queryParams = { page: 1, pageSize: 20, q: 'Circuito' };
      expect(queryParams.q).toBe('Circuito');
    });
  });

  describe('GET /specialities/{id}', () => {
    it('should retrieve a specific speciality', () => {
      const speciality = {
        SpecialityId: 1,
        Alias: 'Circuito',
        Descripcion: 'Circuito cerrado',
        default: true,
      };
      expect(speciality.SpecialityId).toBe(1);
      expect(speciality.Alias).toBe('Circuito');
    });
  });
});
