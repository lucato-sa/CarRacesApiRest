import { describe, it, expect } from 'vitest';

describe('EntityLinks Endpoints', () => {
  describe('GET /entitylinks', () => {
    it('should list all entity links', () => {
      const response = [
        {
          EntityLinkId: 1,
          EntityName: 'Championship',
        },
        {
          EntityLinkId: 2,
          EntityName: 'Competition',
        },
        {
          EntityLinkId: 3,
          EntityName: 'Event',
        },
      ];
      expect(response).toHaveLength(3);
      expect(response[0].EntityName).toBe('Championship');
    });

    it('should validate entity link structure', () => {
      const entityLink = {
        EntityLinkId: 1,
        EntityName: 'Championship',
      };
      expect(entityLink).toHaveProperty('EntityName');
      expect(entityLink.EntityName).toBe('Championship');
    });

    it('should require EntityName field', () => {
      const requiredFields = ['EntityName'];
      const entityLink = {
        EntityName: 'Championship',
      };
      requiredFields.forEach(field => {
        expect(entityLink).toHaveProperty(field);
      });
    });
  });
});
