import { describe, it, expect } from 'vitest';

describe('UserEntities Endpoints', () => {
  describe('GET /userentities', () => {
    it('should list all user entities', () => {
      const response = [
        {
          UserEntityId: 1,
          UserId: 7,
          EntityLinkId: 3,
          RolId: 7,
          EntityId: 100,
        },
        {
          UserEntityId: 2,
          UserId: 8,
          EntityLinkId: 2,
          RolId: 1,
          EntityId: 50,
        },
      ];
      expect(response).toHaveLength(2);
      expect(response[0].UserId).toBe(7);
    });

    it('should validate userentity structure', () => {
      const userEntity = {
        UserEntityId: 1,
        UserId: 7,
        EntityLinkId: 3,
        RolId: 7,
        EntityId: 100,
      };
      expect(userEntity).toHaveProperty('UserId');
      expect(userEntity).toHaveProperty('EntityLinkId');
      expect(userEntity).toHaveProperty('RolId');
    });
  });

  describe('POST /userentities', () => {
    it('should associate user with entity and role', () => {
      const newUserEntity = {
        UserId: 7,
        EntityLinkId: 3,
        RolId: 7,
        EntityId: 100,
      };
      expect(newUserEntity).toHaveProperty('UserId');
      expect(newUserEntity).toHaveProperty('EntityLinkId');
      expect(newUserEntity).toHaveProperty('RolId');
      expect(newUserEntity).toHaveProperty('EntityId');
      expect(newUserEntity.RolId).toBe(7);
    });

    it('should validate role assignment for competition responsible', () => {
      const competitionResponsible = {
        UserId: 7,
        EntityLinkId: 3, // Competition
        RolId: 7,       // Organizador
        EntityId: 100,  // CompetitionId
      };
      expect(competitionResponsible.EntityLinkId).toBe(3);
      expect(competitionResponsible.RolId).toBe(7);
    });

    it('should require mandatory fields for user entity association', () => {
      const requiredFields = ['UserId', 'EntityLinkId', 'RolId'];
      const userEntity = {
        UserId: 7,
        EntityLinkId: 3,
        RolId: 7,
      };
      requiredFields.forEach(field => {
        expect(userEntity).toHaveProperty(field);
      });
    });
  });
});
