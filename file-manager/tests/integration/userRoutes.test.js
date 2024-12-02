const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
jest.setTimeout(30000);  

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  console.log('MongoDB server created');
  await mongoose.connect(mongoServer.getUri(), { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  console.log('Connected to in-memory MongoDB');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('User Routes', () => {
  test('POST /api/users should register a new user', async () => {
   
  });

  test('POST /login should log in the user', async () => {
    
  });
});
