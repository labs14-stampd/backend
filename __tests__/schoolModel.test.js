const db = require('../database/dbConfig');
const SchoolDetails = require('./../models/schoolModel');
const User = require('../models/userModel');

describe('SchoolDetails Model', () => {
  beforeEach(async () => {
    await db.seed.run();
  });
  afterAll(async () => {
    await db.seed.run();
    await db.destroy();
  });

  describe('insert', () => {
    beforeEach(async () => {
      const user = await User.insert({
        username: 'testUser',
        email: 'testUser@test.com',
        sub: 'testUser',
        roleId: 2
      });
      const school = {
        name: 'School of the Test',
        taxId: '1111111',
        street1: 'Test St.',
        street2: null,
        city: 'Test City',
        state: 'TE',
        zip: '5050',
        phone: '555-5555',
        type: 'University',
        url: 'https://www.TEU.edu/',
        userId: user.id
      };

      await SchoolDetails.insert(school);
    });
    it(' should check whether all properties are inserted correctly', async () => {
      const [school] = await SchoolDetails.findBy({ taxId: '1111111' });
      expect(school.name).toBe('School of the Test');
      expect(school.taxId).toBe('1111111');
      expect(school.street1).toBe('Test St.');
      expect(school.street2).toBeNull();
      expect(school.city).toBe('Test City');
      expect(school.state).toBe('TE');
      expect(school.zip).toBe('5050');
      expect(school.phone).toBe('555-5555');
      expect(school.url).toBe('https://www.TEU.edu/');
      expect(school.userId).toBeGreaterThan(1);
      expect(school.length).toBeUndefined();
    });
  });
  describe('update', () => {
    beforeEach(async () => {
      await db.seed.run();
      const user = await User.insert({
        username: 'testUser',
        email: 'testUser@test.com',
        sub: 'testUser',
        roleId: 2
      });

      const school = {
        name: 'School of the Test',
        taxId: '1111111',
        street1: 'Test St.',
        street2: null,
        city: 'Test City',
        state: 'TE',
        zip: '5050',
        phone: '555-5555',
        type: 'University',
        url: 'https://www.TEU.edu/',
        userId: user.id
      };

      const updatedSchool = {
        street1: 'Test Updated',
        city: 'Test-UPDATED',
        state: 'S-UPDATED',
        url: 'https://www.TEU-UPDATED.edu/'
      };

      const inserted = await SchoolDetails.insert(school);
      await SchoolDetails.update(inserted.id, updatedSchool);
    });
    afterEach(() => {
      return db('users').delete();
    });
    it('shoud check whether properties can be updated', async () => {
      const [school] = await SchoolDetails.findBy({ taxId: '1111111' });
      expect(school.street1).toBe('Test Updated');
      expect(school.city).toBe('Test-UPDATED');
      expect(school.state).toBe('S-UPDATED');
      expect(school.url).toBe('https://www.TEU-UPDATED.edu/');
    });
  });
});
