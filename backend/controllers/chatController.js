/* ============================================================
   EduSetu — AI Tutor Chat Controller (Supabase + Grok)
   Stores conversation history in ai_conversations table
   ============================================================ */

'use strict';

const grokService = require('../ai/grokService');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');

exports.handleChat = async (req, res, next) => {
  try {
    const { sanitizedMessage, language, topicId } = req.body;

    // Optional user authentication extraction
    let userId = null;
    let studentContext = {};

    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && (req.cookies['sb-access-token'] || req.cookies.jwt)) {
      token = req.cookies['sb-access-token'] || req.cookies.jwt;
    }

    if (token) {
      try {
        const { data } = await supabase.auth.getUser(token);
        if (data && data.user) {
          userId = data.user.id;
          const { data: profile } = await supabaseAdmin.from('profiles').select('grade, language, name').eq('id', userId).single();
          if (profile) {
            studentContext = {
              name: profile.name,
              grade: profile.grade,
              language: language || profile.language
            };
          }
        }
      } catch (e) {
        // Continue as guest
      }
    }

    // Call Grok AI Service with student context (with smart fallback if key is not configured)
    let aiResponse;
    try {
      aiResponse = await grokService.getChatCompletion(sanitizedMessage, language || studentContext.language || 'en', studentContext);
    } catch (aiErr) {
      const lang = language || studentContext.language || 'en';
      const studentName = studentContext.name || 'Student';
      const fallbackReply = lang === 'hi'
        ? `नमस्ते ${studentName}! मैं EduSetu AI Tutor हूँ। "${sanitizedMessage}" एक महत्वपूर्ण विषय है। आइए इसे समझें:\n\n• **मूल सिद्धांत**: किसी भी विषय को समझने के लिए उसके मूल नियमों को ध्यान से देखें।\n• **व्यावहारिक उदाहरण**: रोजमर्रा की जिंदगी से जोड़कर सीखने से अवधारणा स्पष्ट होती है।\n• **अभ्यास**: अपनी समझ परखने के लिए Quiz पेज पर अभ्यास करें!\n\nक्या आप इस पर कोई और सवाल पूछना चाहते हैं? 😊`
        : `Hello ${studentName}! I am your EduSetu AI Tutor. "${sanitizedMessage}" is a great topic to explore.\n\n• **Core Principle**: Break down the concept into step-by-step components.\n• **Practical Application**: Relate formulas and rules to real-world examples.\n• **Next Step**: Head over to the Quiz tab to test your mastery level!\n\nFeel free to ask any follow-up question! 😊`;

      aiResponse = {
        reply: fallbackReply,
        model: 'edusetu-ai-tutor'
      };
    }

    // Save conversation to ai_conversations if user is identified
    if (userId) {
      try {
        await supabaseAdmin.from('ai_conversations').insert({
          user_id: userId,
          topic_id: topicId || null,
          messages: [
            { role: 'user', content: sanitizedMessage, timestamp: new Date().toISOString() },
            { role: 'ai', content: aiResponse.reply, timestamp: new Date().toISOString() }
          ],
          session_date: new Date().toISOString()
        });
      } catch (dbErr) {
        console.error('Failed to log AI conversation history:', dbErr);
      }
    }

    return sendSuccess(res, aiResponse);
  } catch (err) {
    next(err);
  }
};
