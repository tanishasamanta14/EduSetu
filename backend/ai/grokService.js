/* ============================================================
   EduSetu — Grok AI Service (xAI Grok Integration)
   Diagnostic-first, pedagogical Socratic tutoring engine
   ============================================================ */

'use strict';

const https = require('https');
const config = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Generates a pedagogical system prompt calibrated to the student's profile and curriculum context.
 */
function buildSystemPrompt(studentContext = {}, language = 'en') {
  const name = studentContext.name || 'Student';
  const grade = studentContext.grade || 8;
  const subject = studentContext.subject || 'General Academics';
  const topic = studentContext.topic || '';
  const misconceptions = studentContext.misconceptions || [];
  const masteryStatus = studentContext.masteryStatus || '';
  const confidence = studentContext.confidence !== undefined ? `${studentContext.confidence}%` : 'Not recorded';

  // Grade-level pedagogical calibration
  let gradeInstruction = '';
  if (grade <= 5) {
    gradeInstruction = `The student is in primary school (Class ${grade}). Use very simple everyday words, short sentences, and fun visual analogies (fruits, toys, animals, stories). Avoid technical jargon entirely unless defining it very gently.`;
  } else if (grade <= 8) {
    gradeInstruction = `The student is in middle school (Class ${grade}). Use clear foundational concepts, relatable real-world analogies (sports, food, daily household examples, dividing pizza), and step-by-step intuitive logic. Define any new term clearly before using it.`;
  } else if (grade <= 10) {
    gradeInstruction = `The student is in secondary school (Class ${grade}, preparing for Board Exams like CBSE/ICSE/State Boards). Provide formal conceptual clarity paired with intuitive examples. Include standard definitions, formulas, and common exam pitfalls to watch out for.`;
  } else {
    gradeInstruction = `The student is in higher secondary / college (Class ${grade}+). Provide rigorous, in-depth academic explanations, formal derivations, problem-solving strategies, and conceptual nuances relevant to entrance exams (JEE/NEET/CUET/University).`;
  }

  // Language instructions
  let langInstruction = '';
  if (language === 'hi') {
    langInstruction = `The student's preferred language is Hindi.
- Respond in natural, polite Hindi (Devanagari script).
- Keep key technical, mathematical, or scientific terms in parentheses or bilingual format where standard in Indian textbooks (e.g., 'अंश (Numerator)', 'हर (Denominator)', 'प्रकाश संश्लेषण (Photosynthesis)').
- Maintain an encouraging and respectful tone (use 'आप').`;
  } else if (language === 'bn') {
    langInstruction = `The student's preferred language is Bengali.
- Respond in natural, polite Bengali.
- Include standard English terms in parentheses where helpful for textbook alignment.`;
  } else {
    langInstruction = `The student's preferred language is English.
- Use clear, modern Indian English appropriate for school textbooks.`;
  }

  // Misconception guidance
  let misconceptionNotes = '';
  if (misconceptions.length > 0) {
    misconceptionNotes = `\nKnown Student Misconceptions on this topic: ${misconceptions.join(', ')}.
Gently address and clarify these root misconceptions if relevant to the question, without scolding or making the student feel embarrassed.`;
  }

  return `You are EduSetu AI Tutor — an empathetic, patient, and highly effective Socratic educational tutor for students in India.

STUDENT PROFILE CONTEXT:
- Name: ${name}
- Class / Grade: Class ${grade}
- Current Subject: ${subject}${topic ? ` · Topic: ${topic}` : ''}
- Mastery Status: ${masteryStatus || 'In Progress'} (Confidence: ${confidence})
${misconceptionNotes}

PEDAGOGICAL CALIBRATION:
${gradeInstruction}

LANGUAGE INSTRUCTION:
${langInstruction}

TUTORING RULES:
1. Socratic Teaching: Do NOT simply dump answers or write full homework solutions without explanation. Guide the student to understand the underlying logic.
2. Structure: Follow this teaching sequence for academic questions:
   - **Core Concept**: 1-2 sentence intuitive explanation.
   - **Step-by-Step Breakdown**: Clear numbered steps or bullet points.
   - **Real-World Example**: A concrete, relatable scenario illustrating the idea.
   - **Check Understanding**: Conclude with a brief, friendly follow-up question to verify if the student grasped it.
3. Tone: Encouraging, enthusiastic, warm, and patient. Celebrate curiosity with occasional emojis (🎯, 💡, ✨, 🌿).
4. Non-academic queries: If the student asks something unrelated to education, give a brief polite response and steer them gently back to their studies.
5. Absolute Truth: Never hallucinate scientific or mathematical facts. Keep explanations verified according to standard NCERT curriculum.`;
}

/**
 * Sends a conversation to the Grok API (xAI) and returns the tutor's response.
 *
 * @param {Object} params
 * @param {string} params.message - Latest student message
 * @param {Array} params.history - Array of previous messages [{ role: 'user'|'assistant', content: string }]
 * @param {string} params.language - 'en' | 'hi'
 * @param {Object} params.studentContext - Context retrieved from Supabase
 * @returns {Promise<{ reply: string, model: string, usage: Object }>}
 */
exports.getChatCompletion = ({ message, history = [], language = 'en', studentContext = {} }) => {
  return new Promise((resolve, reject) => {
    const apiKey = config.grokApiKey;

    // Verify API key configuration
    if (!apiKey || apiKey === 'your-grok-api-key-here') {
      console.error('[Grok AI Service] GROK_API_KEY is missing or unconfigured in .env');
      return reject(new AppError('The AI Tutor service is currently awaiting configuration. Please ensure GROK_API_KEY is configured in your .env file.', 503));
    }

    const systemPrompt = buildSystemPrompt(studentContext, language);
    const model = process.env.GROK_MODEL || 'grok-3-mini';

    // Build messages payload with conversation history
    const apiMessages = [
      { role: 'system', content: systemPrompt }
    ];

    // Include up to 10 recent messages from history for conversation memory
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-10);
      for (const item of recentHistory) {
        if (item && item.content && (item.role === 'user' || item.role === 'assistant')) {
          apiMessages.push({
            role: item.role,
            content: String(item.content).slice(0, 2500)
          });
        }
      }
    }

    // Append latest student message
    apiMessages.push({
      role: 'user',
      content: String(message).slice(0, 2500)
    });

    const requestBody = JSON.stringify({
      model: model,
      messages: apiMessages,
      temperature: 0.6,
      max_tokens: 1200
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
            console.error(`[Grok AI Error] Status ${apiRes.statusCode}:`, parsed?.error?.message || data);

            let clientMsg = 'AI service temporarily unavailable. Please try again.';
            if (apiRes.statusCode === 401) {
              clientMsg = 'The AI service authorization failed. Please contact your administrator.';
            } else if (apiRes.statusCode === 429) {
              clientMsg = 'The AI Tutor is currently experiencing high demand. Please try again in a few seconds.';
            }

            return reject(new AppError(clientMsg, apiRes.statusCode >= 500 ? 502 : apiRes.statusCode));
          }

          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
            return resolve({
              reply: parsed.choices[0].message.content,
              model: parsed.model || model,
              usage: parsed.usage || null
            });
          }

          console.error('[Grok AI Error] Unexpected response shape:', data);
          return reject(new AppError('Unexpected response from AI service.', 502));
        } catch (parseErr) {
          console.error('[Grok AI Error] JSON parse failure:', parseErr.message);
          return reject(new AppError('Failed to parse AI response.', 502));
        }
      });
    });

    apiReq.on('error', (err) => {
      console.error('[Grok AI Error] Connection error:', err.message);
      return reject(new AppError('Could not connect to AI service. Please check your internet connection.', 502));
    });

    apiReq.setTimeout(35000, () => {
      apiReq.destroy();
      console.error('[Grok AI Error] Request timeout after 35s');
      return reject(new AppError('AI service took too long to respond. Please try again.', 504));
    });

    apiReq.write(requestBody);
    apiReq.end();
  });
};
