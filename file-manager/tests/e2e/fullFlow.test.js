const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('End-to-End Flow', () => {
  test('User registration, login, and file upload', async () => {
    // Register user
    const registerResponse = await request(app)
      .post('/api/users')
      .send({ username: 'testuser', password: 'password123' });
    expect(registerResponse.status).toBe(201);

    // Log in user
    const loginResponse = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('message', 'welcome');

    // Upload file
    const uploadResponse = await request(app)
      .post('/upload-profile-image')
      .set('Authorization', `Bearer ${loginResponse.body.token}`) // Assuming token is returned
      .attach('file', Buffer.from('test content'), 'test.jpg');
    expect(uploadResponse.status).toBe(200);
    expect(uploadResponse.body).toHaveProperty('success', true);
  });
});
