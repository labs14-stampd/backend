const db = require('../database/dbConfig');
const Users = require('./../models/userModel');

describe('Users Model', () => {
  beforeEach(async () => {
    await db.seed.run();
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
});
