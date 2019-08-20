const db = require('../database/dbConfig');
const Credentials = require('./../models/credentialModel');

describe('Credentials Model', () => {
  beforeEach(async () => {
    await db.seed.run();
  });
  afterAll(async () => {
    await db.seed.run();
    await db.destroy();
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
  describe('update', () => {
    // To be decided if in scope of feature canvas
  });

  describe('remove', () => {
    it('should remove a credential', async () => {
      const credential = await Credentials.insert({
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
      // before remove
      expect(credential.credName).toBe('Doctorate in Testing');
      // on remove
      const removedCredential = await Credentials.remove(credential.id);
      expect(removedCredential).toBe(1);
      // after remove
      const removed = await Credentials.findBy({
        studentEmail: 'testing@edu.com'
      });
      expect(removed).toHaveLength(0);
    });
  });
});
