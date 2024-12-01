// userController.test.js
jest.mock('../src/models/userModel', () => ({
  create: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
}));

const User = require('../models/userModel'); // Import the mocked User model
const { registerUser } = require('../controllers/userController'); // Controller to test

describe('User Controller - registerUser', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data between tests
  });

  it('should call User.create with correct data', async () => {
    const mockReq = { body: { email: 'test@example.com', password: 'password123' } };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await registerUser(mockReq, mockRes);

    expect(User.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123', // Assuming hashed password logic is handled in the model
    });
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
    });
  });
});
