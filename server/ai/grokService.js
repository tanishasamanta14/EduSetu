const https = require('https');
const config = require('../config/env');
const AppError = require('../utils/AppError');

exports.getChatCompletion = (message, language) => {
  return new Promise((resolve, reject) => {
    const apiKey = config.grokApiKey;
    if (!apiKey || apiKey === 'your-grok-api-key-here') {
      return reject(new AppError('API key not configured. Please add your Grok API key to the .env file.', 500));
    }

    const langInstruction = language === 'hi'
      ? 'Respond in Hindi (Devanagari script). Use simple Hindi that students can understand.'
      : 'Respond in English.';

    const systemPrompt = `You are EduSetu AI Tutor — a friendly, patient, and encouraging educational assistant for Indian students from Class 1 to Graduation level.

Your role:
- Explain concepts step-by-step in a simple, clear way
- Use real-world examples and analogies students can relate to
- Include key formulas, definitions, or rules when relevant
- Encourage students and make learning fun with emojis
- If a student seems confused, break it down further
- Cover all subjects: Math, Science, English, Hindi, Social Science, Physics, Chemistry, Computer Science, Biology, Economics

Format your responses with:
- Clear headings using **bold text**
- Bullet points for key points
- Step-by-step numbered lists for processes
- Emojis to make it engaging (but not excessive)

${langInstruction}

Keep responses concise but thorough — aim for 150-300 words.`;

    const requestBody = JSON.stringify({
      model: 'grok-3-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const options = {
      hostname: 'api.x.ai',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';

      apiRes.on('data', chunk => {
        data += chunk;
      });

      apiRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);

          if (apiRes.statusCode !== 200) {
            const errorMsg = apiRes.statusCode === 401
              ? 'Invalid API key. Please check your .env file.'
              : apiRes.statusCode === 429
                ? 'API rate limit reached. Please try again in a moment.'
                : 'AI service temporarily unavailable. Please try again.';
            return reject(new AppError(errorMsg, 502));
          }

          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
            return resolve({
              reply: parsed.choices[0].message.content,
              model: parsed.model || 'grok-3-mini'
            });
          }

          return reject(new AppError('Unexpected response from AI service.', 502));
        } catch (parseErr) {
          return reject(new AppError('Failed to parse AI response.', 502));
        }
      });
    });

    apiReq.on('error', () => {
      return reject(new AppError('Could not connect to AI service. Check your internet connection.', 502));
    });

    apiReq.setTimeout(30000, () => {
      apiReq.destroy();
      return reject(new AppError('AI service took too long to respond.', 504));
    });

    apiReq.write(requestBody);
    apiReq.end();
  });
};
