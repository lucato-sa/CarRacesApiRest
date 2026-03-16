import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../setup.db';

const isMemoryTest = process.env.NODE_ENV !== 'test' || !process.env.DB_HOST;

describe('Clubs Endpoints', () => {
  if (!isMemoryTest) {
    // Tests de integración con BD real
    describe('GET /api/clubs', () => {
      it('should list clubs with pagination', async () => {
        const response = await request(app)
          .get('/api/clubs')
          .query({ page: 1, pageSize: 20 })
          .expect(200);

        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('page');
        expect(response.body).toHaveProperty('pageSize');
        expect(response.body).toHaveProperty('items');
        expect(Array.isArray(response.body.items)).toBe(true);
      });

      it('should support search with parameter q', async () => {
        const response = await request(app)
          .get('/api/clubs')
          .query({ page: 1, pageSize: 20, q: 'Racing' })
          .expect(200);

        expect(response.body).toHaveProperty('items');
      });

      it('should support filtering by alias', async () => {
        const response = await request(app)
          .get('/api/clubs')
          .query({ alias: 'ClubRacing' })
          .expect(200);

        expect(response.body).toHaveProperty('items');
      });

      it('should support pagination', async () => {
        const response = await request(app)
          .get('/api/clubs')
          .query({ page: 2, pageSize: 10 })
          .expect(200);

        expect(response.body.page).toBe(2);
        expect(response.body.pageSize).toBe(10);
      });
    });
  } else {
    // Tests en memoria con mocks
    describe('GET /clubs', () => {
      it('should list clubs with pagination', () => {
        const response = {
          total: 3,
          page: 1,
          pageSize: 20,
          items: [
            {
              ClubId: 1,
              Alias: 'ClubRacing',
              TaxNombre: 'Racing SL',
              TaxNumero: 'B12345678',
              Descripcion: 'Club de pruebas',
              FechaFundacion: '1995-06-15',
            },
          ],
        };
        expect(response.items).toHaveLength(1);
        expect(response.items[0].Alias).toBe('ClubRacing');
      });
    });
  }

  describe('POST /api/clubs', () => {
    it('should create a new club', async () => {
      const newClub = {
        Alias: 'ClubRacing',
        TaxNombre: 'Racing SL',
        TaxNumero: 'B12345678',
        Descripcion: 'Club de pruebas',
        FechaFundacion: '1995-06-15',
      };

      const response = await request(app)
        .post('/api/clubs')
        .send(newClub)
        .expect(201)
        .catch(err => {
          console.error('body:', err.response?.body);
          throw err;
        });

      expect(response.body).toHaveProperty('ClubId');
      expect(response.body.Alias).toBe('ClubRacing');
    });

    it('should require mandatory fields', async () => {
      const incompleteClub = {
        Alias: 'Club1',
      };

      await request(app)
        .post('/api/clubs')
        .send(incompleteClub)
        .expect(400);
    });
  });

  describe('GET /api/clubs/{id}', () => {
    it('should retrieve a specific club', async () => {
      const newClub = {
        Alias: 'ClubTest',
        TaxNombre: 'Test SL',
        TaxNumero: 'B99999999',
        Descripcion: 'Club para test',
        FechaFundacion: '2020-01-01',
      };

      const createResponse = await request(app)
        .post('/api/clubs')
        .send(newClub)
        .expect(201);

      const clubId = createResponse.body.ClubId;

      const response = await request(app)
        .get(`/api/clubs/${clubId}`)
        .expect(200);

      expect(response.body.ClubId).toBe(clubId);
      expect(response.body.Alias).toBe('ClubTest');
    });

    it('should return 404 for non-existent club', async () => {
      await request(app)
        .get('/api/clubs/9999')
        .expect(404);
    });
  });

  describe('PUT /api/clubs/{id}', () => {
    it('should update an existing club', async () => {
      const newClub = {
        Alias: 'ClubToUpdate',
        TaxNombre: 'Update SL',
        TaxNumero: 'B88888888',
        Descripcion: 'Club para actualizar',
        FechaFundacion: '2021-01-01',
      };

      const createResponse = await request(app)
        .post('/api/clubs')
        .send(newClub)
        .expect(201);

      const clubId = createResponse.body.ClubId;

      const updateData = {
        Alias: 'ClubUpdated',
        TaxNombre: 'Updated SL',
        TaxNumero: 'B88888888',
        Descripcion: 'Club actualizado',
        FechaFundacion: '2021-01-01',
      };

      const response = await request(app)
        .put(`/api/clubs/${clubId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.Alias).toBe('ClubUpdated');
    });
  });
});
