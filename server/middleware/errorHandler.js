const { sendError } = require('../utils/response');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log unexpected errors
  if (!err.isOperational) {
    console.error('ERROR 💥:', err);
  }

  // Hide detailed error in production for non-operational errors
  const message = err.isOperational 
    ? err.message 
    : 'Internal Server Error';

  return sendError(res, message, statusCode);
};
