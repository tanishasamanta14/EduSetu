const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/edusetu',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod',
  grokApiKey: process.env.GROK_API_KEY,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};
