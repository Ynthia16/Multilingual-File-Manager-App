const request = require('supertest');
const app = require('../src/app');

describe('User Routes', () => {
  it('should register a new user', async () => {
    const newUser = {
      email: 'testuser@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users/register') // Adjust to your route path
      .send(newUser)
      .expect(201);

    expect(response.body.email).toBe('testuser@example.com');
  });

  it('should login an existing user', async () => {
    const user = {
      email: 'testuser@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users/login') // Adjust to your route path
      .send(user)
      .expect(200);

    expect(response.body.email).toBe('testuser@example.com');
  });
});
