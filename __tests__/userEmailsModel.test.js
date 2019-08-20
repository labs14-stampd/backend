const db = require('../database/dbConfig');
const UserEmails = require('./../models/userEmailsModel');
const User = require('../models/userModel');

describe('StudentEmails Model', () => {
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
        username: 'testUser4Email',
        email: 'testUser4Email@test.com',
        sub: 'testUserEmail',
        roleId: 3
      });
      const studentEmail = {
        email: 'TESTUSER_EMAIL@gmail.com',
        userId: user.id
      };

      await UserEmails.insert(studentEmail);
    });
    it(' should check whether all properties are inserted correctly', async () => {
      const [student] = await UserEmails.findBy({
        email: 'TESTUSER_EMAIL@gmail.com'
      });

      expect(student.email).toBe('TESTUSER_EMAIL@gmail.com');
      expect(student.userId).toBeGreaterThan(1);
      expect(student.length).toBeUndefined();
    });
  });
  describe('delete', () => {
    it('should check whether properties can be deleted', async () => {
      const user = await User.insert({
        username: 'testUser4Email',
        email: 'testUser4Email@test.com',
        sub: 'testUserEmail',
        roleId: 3
      });
      const studentEmail = {
        email: 'TESTUSER_EMAIL@gmail.com',
        userId: user.id
      };

      const email = await UserEmails.insert(studentEmail);

      // before remove
      expect(email.email).toBe('TESTUSER_EMAIL@gmail.com');
      // on remove
      const removedCredential = await UserEmails.remove(email.id);
      expect(removedCredential).toBe(1);
      // after remove
      const removed = await UserEmails.findBy({
        email: 'TESTUSER_EMAIL@gmail.com'
      });
      expect(removed).toHaveLength(0);
    });
  });
});
