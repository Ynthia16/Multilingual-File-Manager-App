const { registerUser } = require('../controllers/userController');
const User = require('../models/userModel');

jest.mock('../models/userModel', () => ({
  create: jest.fn()
}));

describe('registerUser', () => {
  it('should create a user and respond with status 201', async () => {
    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

  
    User.create.mockResolvedValue({ id: 1, email: 'test@example.com' });

 
    await registerUser(req, res);

  
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, email: 'test@example.com' });
  });
});
