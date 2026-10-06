const { sendSuccess } = require('../utils/response');
const config = require('../config/env');
const { checkConnection } = require('../config/supabase');

exports.checkHealth = async (req, res, next) => {
  try {
    const hasKey = !!(config.grokApiKey && config.grokApiKey !== 'your-grok-api-key-here');
    const dbStatus = await checkConnection();

    return sendSuccess(res, {
      status: 'ok',
      supabase: dbStatus,
      database: dbStatus,
      grokConfigured: hasKey,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};
