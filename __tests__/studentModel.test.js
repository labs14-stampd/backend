const db = require('../database/dbConfig');
const StudentDetails = require('./../models/studentModel');
const User = require('../models/userModel');

describe('StudentDetails Model', () => {
  beforeEach(async () => {
    await db.seed.run();
  });
  describe('insert', () => {
    beforeEach(async () => {
      const user = await User.insert({
        username: 'testUser',
        email: 'testUser@test.com',
        sub: 'testUser'
      });
      const student = {
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
        userId: user.id
      };

      await StudentDetails.insert(student);
    });
    afterEach(() => {
      return db('users').delete();
    });
    it('shoud check whether all properties are inserted correctly', async () => {
      const [student] = await StudentDetails.findBy({ firstName: 'Test' });
      expect(student.fullName).toBe('Test User');
      expect(student.firstName).toBe('Test');
      expect(student.middleName).toBe('D');
      expect(student.lastName).toBe('User');
      expect(student.street1).toBe('Test St.');
      expect(student.street2).toBeNull();
      expect(student.city).toBe('Test');
      expect(student.state).toBe('TE');
      expect(student.zip).toBe('00000');
      expect(student.phone).toBe('(000)000-0000');
      expect(student.userId).toBeGreaterThan(1);
      expect(student.length).toBeUndefined();
    });
  });
  describe('update', () => {
    beforeEach(async () => {
      const user = await User.insert({
        username: 'testUser',
        email: 'testUser@test.com',
        sub: 'testUser'
      });

      const student = {
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
        userId: user.id
      };

      const updateStudent = {
        fullName: 'Test Updated',
        firstName: 'Test',
        middleName: 'S',
        lastName: 'Updated'
      };

      const inserted = await StudentDetails.insert(student);
      await StudentDetails.update(inserted.id, updateStudent);
    });
    afterEach(() => {
      return db('users').delete();
    });
    it('shoud check whether properties can be updated', async () => {
      const [student] = await StudentDetails.findBy({ firstName: 'Test' });
      expect(student.fullName).toBe('Test Updated');
      expect(student.firstName).toBe('Test');
      expect(student.middleName).toBe('S');
      expect(student.lastName).toBe('Updated');
    });
  });
});
