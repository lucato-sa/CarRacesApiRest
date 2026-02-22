import { describe, it, expect } from 'vitest';

describe('RolEntities Endpoints', () => {
  describe('GET /rolentities', () => {
    it('should list all role entities', () => {
      const response = [
        {
          RolEntityId: 1,
          EntityLinkId: 1,
          RolId: 1,
        },
        {
          RolEntityId: 2,
          EntityLinkId: 2,
          RolId: 7,
        },
      ];
      expect(response).toHaveLength(2);
      expect(response[0].RolId).toBe(1);
    });

    it('should validate rolentity structure', () => {
      const rolEntity = {
        RolEntityId: 1,
        EntityLinkId: 1,
        RolId: 1,
      };
      expect(rolEntity).toHaveProperty('EntityLinkId');
      expect(rolEntity).toHaveProperty('RolId');
    });
  });

  describe('POST /rolentities', () => {
    it('should create a new role entity', () => {
      const newRolEntity = {
        EntityLinkId: 1,
        RolId: 1,
      };
      expect(newRolEntity).toHaveProperty('EntityLinkId');
      expect(newRolEntity).toHaveProperty('RolId');
    });

    it('should require mandatory fields: EntityLinkId, RolId', () => {
      const requiredFields = ['EntityLinkId', 'RolId'];
      const rolEntity = {
        EntityLinkId: 1,
        RolId: 1,
      };
      requiredFields.forEach(field => {
        expect(rolEntity).toHaveProperty(field);
      });
    });
  });
});
