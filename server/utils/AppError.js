class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Identifies errors we created vs unexpected bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
