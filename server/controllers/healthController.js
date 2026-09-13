const { sendSuccess } = require('../utils/response');
const config = require('../config/env');

exports.checkHealth = (req, res, next) => {
  const hasKey = !!(config.grokApiKey && config.grokApiKey !== 'your-grok-api-key-here');
  
  return sendSuccess(res, {
    status: 'ok',
    grokConfigured: hasKey,
    message: hasKey ? 'Grok API is configured' : 'Add your API key to .env file'
  });
};
