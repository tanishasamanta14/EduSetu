const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '90d' });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
  res.cookie('jwt', token, cookieOptions);
  
  return sendSuccess(res, { token, role: user.role }, statusCode);
};

// GET /api/auth/dev-login
// Useful for development to auto-login as a seeded user
exports.devLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: 'student1@edusetu.in' });
    if (!user) return res.status(404).json({ success: false, message: 'Dev user not found' });

    const token = signToken(user._id);
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true
    });

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.devLoginMentor = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: 'mentor1@edusetu.in' });
    if (!user) return res.status(404).json({ success: false, message: 'Dev mentor not found' });

    const token = signToken(user._id);
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true
    });

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  return sendSuccess(res, { message: 'Logged out successfully' });
};
