const db = require('../database/dbConfig');
const Users = require('./../models/userModel');

describe('Users Model', () => {
  beforeEach(async () => {
    await db.seed.run();
  });
  afterAll(async () => {
    await db.seed.run();
    await db.destroy();
  }); 
  describe('Teamstampd@gmail.com', () => {
    it('should check if teamstampd@gmail.com is in the database', async () => {
      const [user] = await Users.findBy({ email: 'teamstampd@gmail.com' });
      expect(user).toEqual({
        id: 3,
        username: 'school1',
        email: 'teamstampd@gmail.com',
        profilePicture: '',
        sub: '3',
        roleId: 2
      });
    });
    it('should check if teamstampd@gmail.com is a school', async () => {
      const [user] = await Users.findBy({ email: 'teamstampd@gmail.com' });
      expect(user.roleId).toBe(2);
    });
  });
  afterEach(async () => {
    await db('users').delete();
  });
  describe('insert', () => {
    it('should insert new admin', async () => {
      await Users.insert({
        username: 'ByronHolmes',
        email: 'BH@admin.com',
        profilePicture: '',
        sub: 'admin',
        roleId: 1
      });
      const [school] = await Users.findBy({ email: 'BH@admin.com' });
      expect(school.username).toBe('ByronHolmes');
      expect(school.email).toBe('BH@admin.com');
      expect(school.sub).toBe('admin');
      expect(school.roleId).toBe(1);
    });
    it('should insert new school', async () => {
      await Users.insert({
        username: 'Test University',
        email: 'TU@edu.com',
        profilePicture: '',
        sub: 'test',
        roleId: 2
      });
      const [school] = await Users.findBy({ email: 'TU@edu.com' });
      expect(school.username).toBe('Test University');
      expect(school.email).toBe('TU@edu.com');
      expect(school.sub).toBe('test');
      expect(school.roleId).toBe(2);
    });
    it('should insert new student', async () => {
      await Users.insert({
        username: 'Test Student',
        email: 'TS@edu.com',
        profilePicture: '',
        sub: 'testStudent',
        roleId: 3
      });
      const [school] = await Users.findBy({ email: 'TS@edu.com' });
      expect(school.username).toBe('Test Student');
      expect(school.email).toBe('TS@edu.com');
      expect(school.sub).toBe('testStudent');
      expect(school.roleId).toBe(3);
    });
    it('should insert new employer', async () => {
      // future feature
    });
  });
  describe('remove', () => {
    it('should remove a user', async () => {
      const user = await Users.insert({
        username: 'Removed User',
        email: 'RU@edu.com',
        profilePicture: '',
        sub: 'testRemoved',
        roleId: 3
      });
      // before remove
      expect(user.username).toBe('Removed User');
      // on remove
      const removedUser = await Users.remove(user.id);
      expect(removedUser).toBe(1);
      // after remove
      const removed = await Users.findBy({ email: 'RU@edu.com' });
      expect(removed).toHaveLength(0);
    });
  });
});
