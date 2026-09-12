/* ============================================================
   EduSetu — Express Server with Grok API Proxy
   Serves static files + proxies chat requests to xAI Grok API.
   API key is read from .env (never exposed to the browser).
   ============================================================ */

'use strict';

const express = require('express');
const path = require('path');
const https = require('https');

// Load .env file securely
// TODO(security): In production, use a KMS or secret manager instead of .env files.
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = 3000;

/* ---------- Security: Get API Key ---------- */
function getApiKey() {
  const key = process.env.GROK_API_KEY;
  if (key && key !== 'your-grok-api-key-here' && key.trim().length > 0) {
    return key.trim();
  }
  return null;
}

/* ---------- Middleware ---------- */

// Parse JSON bodies with size limit to prevent DoS
app.use(express.json({ limit: '10kb' }));

// Security headers
app.use(function (req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // TODO(security): Add strict CSP in production
  // res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;");
  next();
});

// Serve static files from project root
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: 'index.html'
}));

/* ---------- Rate Limiting (Simple In-Memory) ---------- */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 20; // max 20 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return false;
  }
  return true;
}

/* ---------- API: Chat with Grok ---------- */
app.post('/api/chat', function (req, res) {
  // Rate limit check
  const clientIp = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  // Validate API key exists
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured. Please add your Grok API key to the .env file.'
    });
  }

  // Validate request body
  const userMessage = req.body && req.body.message;
  const language = req.body && req.body.language;

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Sanitize: limit message length
  const sanitizedMessage = userMessage.slice(0, 2000).trim();
  if (!sanitizedMessage) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  // Build system prompt for educational context
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

  // Prepare Grok API request
  const requestBody = JSON.stringify({
    model: 'grok-3-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: sanitizedMessage }
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

  const apiReq = https.request(options, function (apiRes) {
    let data = '';

    apiRes.on('data', function (chunk) {
      data += chunk;
    });

    apiRes.on('end', function () {
      try {
        const parsed = JSON.parse(data);

        if (apiRes.statusCode !== 200) {
          // Don't expose raw API error details to client
          const errorMsg = apiRes.statusCode === 401
            ? 'Invalid API key. Please check your .env file.'
            : apiRes.statusCode === 429
              ? 'API rate limit reached. Please try again in a moment.'
              : 'AI service temporarily unavailable. Please try again.';
          return res.status(502).json({ error: errorMsg });
        }

        if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
          return res.json({
            reply: parsed.choices[0].message.content,
            model: parsed.model || 'grok-3-mini'
          });
        }

        return res.status(502).json({ error: 'Unexpected response from AI service.' });
      } catch (parseErr) {
        return res.status(502).json({ error: 'Failed to parse AI response.' });
      }
    });
  });

  apiReq.on('error', function () {
    return res.status(502).json({ error: 'Could not connect to AI service. Check your internet connection.' });
  });

  // Timeout after 30 seconds
  apiReq.setTimeout(30000, function () {
    apiReq.destroy();
    return res.status(504).json({ error: 'AI service took too long to respond.' });
  });

  apiReq.write(requestBody);
  apiReq.end();
});

/* ---------- Health Check ---------- */
app.get('/api/health', function (req, res) {
  const hasKey = !!getApiKey();
  res.json({
    status: 'ok',
    grokConfigured: hasKey,
    message: hasKey ? 'Grok API is configured' : 'Add your API key to .env file'
  });
});

/* ---------- Start Server ---------- */
// TODO(security): In production, use HTTPS with TLS certificates
app.listen(PORT, '127.0.0.1', function () {
  const hasKey = !!getApiKey();
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   EduSetu Server running on port ' + PORT + '     ║');
  console.log('  ║   http://localhost:' + PORT + '                  ║');
  console.log('  ╠══════════════════════════════════════════╣');
  if (hasKey) {
    console.log('  ║   ✅ Grok API key loaded                 ║');
  } else {
    console.log('  ║   ⚠️  Grok API key NOT configured        ║');
    console.log('  ║   → Edit .env and add your key           ║');
  }
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});
