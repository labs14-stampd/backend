const request = require('supertest');

const server = require('../api/server');

describe('Requests to status route: ', () => {
  const REQUEST_URI = '/';

  it('• should return an HTML page', async () => {
    const res = await request(server).get(REQUEST_URI);
    expect(res.type).toBe('text/html');
  });

  it('• should return status "OK"', async () => {
    const res = await request(server).get(REQUEST_URI);
    expect(res.status).toBe(200);
  });

  it('• should have the expected page text (instead of an error)', async () => {
    const res = await request(server).get(REQUEST_URI);
    expect(res.text).toEqual('The Stampd Server is alive and well 🎉');
  });
});
