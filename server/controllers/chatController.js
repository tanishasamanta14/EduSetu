const grokService = require('../ai/grokService');
const { sendSuccess } = require('../utils/response');

exports.handleChat = async (req, res, next) => {
  try {
    const { sanitizedMessage, language } = req.body;
    
    // Call AI Service
    const aiResponse = await grokService.getChatCompletion(sanitizedMessage, language);
    
    // Return success response
    return sendSuccess(res, aiResponse);
  } catch (err) {
    next(err); // Pass to centralized error handler
  }
};
