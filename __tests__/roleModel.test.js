const db = require('../database/dbConfig');
const Roles = require('./../models/roleModel');

describe('Roles Model', () => {
  afterAll(async () => {
    await db.destroy()
  })
  describe('Admin', () => {
    it(' should check if id of 1 is admin', async () => {
      const role = await Roles.findById(1);
      expect(role.type).toBe('admin');
    });
    it(' should return the right object', async () => {
      const role = await Roles.findById(1);
      expect(role).toEqual({ id: 1, type: 'admin' });
    });
  });
  describe('School', () => {
    it(' should check if id of 2 is school', async () => {
      const role = await Roles.findById(2);
      expect(role.type).toBe('school');
    });
    it(' should return the right object', async () => {
      const role = await Roles.findById(2);
      expect(role).toEqual({ id: 2, type: 'school' });
    });
  });
  describe('Student', () => {
    it(' should check if id of 3 is student', async () => {
      const role = await Roles.findById(3);
      expect(role.type).toBe('student');
    });
    it(' should return the right object', async () => {
      const role = await Roles.findById(3);
      expect(role).toEqual({ id: 3, type: 'student' });
    });
  });
  describe('Employer', () => {
    it(' should check if id of 4 is employer', async () => {
      const role = await Roles.findById(4);
      expect(role.type).toBe('employer');
    });
    it(' should return the right object', async () => {
      const role = await Roles.findById(4);
      expect(role).toEqual({ id: 4, type: 'employer' });
    });
  });
});
