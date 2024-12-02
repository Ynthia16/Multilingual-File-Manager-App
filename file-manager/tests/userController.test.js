const { registerUser } = require('../controllers/userController');

describe('registerUser', () => {
  it('should create a user and respond with status 201', async () => {
    const req = {
      body: { username: 'test_user', email: 'test@example.com', password: 'password123' },
      headers: { 'accept-language': 'en' },
      t: jest.fn().mockImplementation((key) => {
        const translations = {
          'errors.user_exists': 'User already exists',
          'success.registration_successful': 'User registered successfully',
        };
        return translations[key];
      }),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User registered successfully',
    }));
  });
});

