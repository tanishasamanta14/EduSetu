const AppError = require('../utils/AppError');

exports.validateChatRequest = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return next(new AppError('Message is required and must be a string.', 400));
  }

  const sanitizedMessage = message.slice(0, 2000).trim();
  if (!sanitizedMessage) {
    return next(new AppError('Message cannot be empty.', 400));
  }

  req.body.sanitizedMessage = sanitizedMessage;
  next();
};
