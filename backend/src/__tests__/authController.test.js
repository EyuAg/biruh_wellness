jest.mock('../models/User', () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  updateRefreshToken: jest.fn(),
  comparePassword: jest.fn(),
  findById: jest.fn(),
  findByRefreshToken: jest.fn(),
  updatePassword: jest.fn(),
  deactivate: jest.fn(),
  activate: jest.fn(),
  updateRole: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn()
}));

jest.mock('../models/Patient', () => ({
  create: jest.fn()
}));

jest.mock('../models/Therapist', () => ({
  create: jest.fn()
}));

jest.mock('../config/jwt', () => ({
  generateAccessToken: jest.fn(() => 'access-token'),
  generateRefreshToken: jest.fn(() => 'refresh-token'),
  verifyRefreshToken: jest.fn(),
  verifyAccessToken: jest.fn()
}));

jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

const User = require('../models/User');
const Patient = require('../models/Patient');
const { register } = require('../controllers/authController');

describe('authController.register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('preserves the requested role for admin registration', async () => {
    User.findByEmail.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 42,
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin'
    });
    User.updateRefreshToken.mockResolvedValue();

    const req = {
      body: {
        email: 'admin@example.com',
        password: 'StrongPassword123',
        full_name: 'Admin User',
        phone: '0912345678',
        role: 'admin'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'admin' }));
    expect(Patient.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
