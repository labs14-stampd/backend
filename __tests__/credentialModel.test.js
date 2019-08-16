const db = require('../database/dbConfig');
const Credentials = require('./../models/credentialModel');

describe('Credentials Model', () => {
  beforeEach(async () => {
    await db.seed.run();
  });
  describe('insert', () => {
    it('should insert new credential', async () => {
      await Credentials.insert({
        credName: 'Doctorate in Testing',
        description:
          'Certifies that this person is capable of testing while testing',
        type: 'PhD',
        ownerName: 'Test',
        studentEmail: 'testing@edu.com',
        imageUrl: '',
        criteria: 'Complete Engineering of a Testing',
        issuedOn: '08/08/2016',
        expirationDate: '09/09/2040',
        schoolId: 3
      });
      const [credential] = await Credentials.findBy({
        studentEmail: 'testing@edu.com'
      });
      expect(credential.credName).toBe('Doctorate in Testing');
      expect(credential.description).toBe(
        'Certifies that this person is capable of testing while testing'
      );
      expect(credential.type).toBe('PhD');
      expect(credential.ownerName).toBe('Test');
      expect(credential.studentEmail).toBe('testing@edu.com');
      expect(credential.criteria).toBe('Complete Engineering of a Testing');
      expect(credential.schoolId).toBe(3);
    });
  });
});
