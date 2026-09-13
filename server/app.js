const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const apiRoutes = require('./routes');

const app = express();

// 1. Core Middleware
app.use(express.json({ limit: '10kb' })); // Body parser
app.use(cookieParser()); // Cookie parser
app.use(securityMiddleware); // Security headers

// 2. Static File Serving (Frontend)
app.use(express.static(path.join(__dirname, '../'), {
  extensions: ['html'],
  index: 'index.html'
}));

// 3. API Routes
app.use('/api', apiRoutes);

// 4. Handle Unhandled Routes (404)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. Global Error Handler
app.use(errorHandler);

module.exports = app;
