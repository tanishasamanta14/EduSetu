const AppError = require('../utils/AppError');

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 20; // max 20 requests per minute

exports.apiLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return next(new AppError('Too many requests. Please wait a moment.', 429));
  }

  next();
};
