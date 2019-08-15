const db = require('../database/dbConfig');
const StudentDetails = require('./../models/studentModel');
const User = require('../models/userModel');

describe('StudentDetails Model', () => {
  beforeAll(async () => {
    await db.seed.run();
    const user = await User.insert({
      username: 'testUser',
      email: 'testUser@test.com',
      sub: 'testUser'
    });
    // testUser with an id of 9
    return user;
  });
  afterEach(() => {
    return db('users').delete();
  });
  describe('insert', () => {
    beforeEach(async () => {
      await StudentDetails.insert({
        fullName: 'Test User',
        firstName: 'Test',
        middleName: 'D',
        lastName: 'User',
        street1: 'Test St.',
        street2: null,
        city: 'Test',
        state: 'TE',
        zip: '00000',
        phone: '(000)000-0000',
        userId: 9
      });
    });
    afterEach(() => {
      return db('studentDetails').delete();
    });
    it('shoud have a fullName of Test User', async () => {
      const [student] = await StudentDetails.findBy({ firstName: 'Test' });
      expect(student.fullName).toBe("Test User")
    })
  });
});
