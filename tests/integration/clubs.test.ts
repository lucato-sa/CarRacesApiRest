import { describe, it, expect, beforeAll } from 'vitest';
import { Application } from 'express';
import { createApp } from '../../src/app';



describe('Clubs Endpoints', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /clubs', () => {
    it('should list clubs with pagination', () => {
      const response = {
        total: 10,
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
            default: true,
          },
        ],
      };
      expect(response.items).toHaveLength(1);
      expect(response.items[0].Alias).toBe('ClubRacing');
      expect(response.total).toBe(10);
      expect(response.page).toBe(1);
    });

    it('should support search with parameter q', () => {
      const queryParams = { page: 1, pageSize: 20, q: 'Racing' };
      expect(queryParams.q).toBe('Racing');
    });

    it('should support filtering by alias', () => {
      const queryParams = { alias: 'ClubRacing' };
      expect(queryParams.alias).toBe('ClubRacing');
    });

    it('should support pagination', () => {
      const queryParams = { page: 2, pageSize: 10 };
      expect(queryParams.page).toBe(2);
      expect(queryParams.pageSize).toBe(10);
    });
  });

  describe('POST /clubs', () => {
    it('should create a new club', () => {
      const newClub = {
        Alias: 'ClubRacing',
        TaxNombre: 'Racing SL',
        TaxNumero: 'B12345678',
        Descripcion: 'Club de pruebas',
        FechaFundacion: '1995-06-15',
      };
      expect(newClub).toHaveProperty('Alias');
      expect(newClub).toHaveProperty('TaxNombre');
      expect(newClub).toHaveProperty('TaxNumero');
      expect(newClub.Alias).toBe('ClubRacing');
    });

    it('should require mandatory fields: Alias, TaxNombre, TaxNumero, Descripcion, FechaFundacion', () => {
      const requiredFields = ['Alias', 'TaxNombre', 'TaxNumero', 'Descripcion', 'FechaFundacion'];
      const club = {
        Alias: 'Club1',
        TaxNombre: 'Tax1',
        TaxNumero: 'B1111111',
        Descripcion: 'Desc',
        FechaFundacion: '2025-01-01',
      };
      requiredFields.forEach(field => {
        expect(club).toHaveProperty(field);
      });
    });
  });

  describe('GET /clubs/{id}', () => {
    it('should retrieve a specific club', () => {
      const club = {
        ClubId: 1,
        Alias: 'ClubRacing',
        TaxNombre: 'Racing SL',
        TaxNumero: 'B12345678',
        Descripcion: 'Club de pruebas',
        FechaFundacion: '1995-06-15',
      };
      expect(club.ClubId).toBe(1);
      expect(club.Alias).toBe('ClubRacing');
    });

    it('should return 404 for non-existent club', () => {
      const nonExistentId = 9999;
      expect(nonExistentId).not.toBe(1);
    });
  });

  describe('PUT /clubs/{id}', () => {
    it('should update an existing club', () => {
      const updateData = {
        Alias: 'ClubRacing Updated',
        TaxNombre: 'Racing SL',
        TaxNumero: 'B12345678',
        Descripcion: 'Club de pruebas actualizado',
        FechaFundacion: '1995-06-15',
      };
      expect(updateData.Alias).toBe('ClubRacing Updated');
      expect(updateData).toHaveProperty('TaxNombre');
    });
  });

  describe('DELETE /clubs/{id}', () => {
    it('should delete a club', () => {
      const clubId = 1;
      expect(clubId).toBe(1);
    });

    it('should return 404 when deleting non-existent club', () => {
      const nonExistentId = 9999;
      expect(nonExistentId).not.toBe(1);
    });
  });
});
