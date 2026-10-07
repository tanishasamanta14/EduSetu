/* ============================================================
   EduSetu — AI Tutor Chat Controller
   Zero-mock production architecture connecting Grok & Supabase
   ============================================================ */

'use strict';

const crypto = require('crypto');
const grokService = require('../ai/grokService');
const { supabaseAdmin } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

/**
 * POST /api/chat
 * Handles real student chat interactions with Grok AI, context-enrichment, and Supabase persistence.
 */
exports.handleChat = async (req, res, next) => {
  try {
    const { sanitizedMessage, conversationId, topicId, language } = req.body;
    const user = req.user;

    if (!user || !user.id) {
      return next(new AppError('Authentication required to use AI Tutor.', 401));
    }

    // 1. Gather comprehensive student context from Supabase
    let studentContext = {
      name: user.name || 'Student',
      grade: user.grade || 8,
      language: language || user.language || 'en',
      subject: 'General Academics',
      topic: '',
      misconceptions: [],
      masteryStatus: '',
      confidence: 0
    };

    try {
      // 1.1 Fetch topic info if topicId is provided
      if (topicId) {
        const { data: topicData } = await supabaseAdmin
          .from('topics')
          .select('id, name, slug, grade_level, description, key_points, subjects(name)')
          .eq('id', topicId)
          .single();

        if (topicData) {
          studentContext.topic = topicData.name;
          if (topicData.subjects && topicData.subjects.name) {
            studentContext.subject = topicData.subjects.name;
          }
        }
      }

      // 1.2 Fetch student learning progress
      const { data: progressData } = await supabaseAdmin
        .from('learning_progress')
        .select('overall_confidence, subject_progress')
        .eq('user_id', user.id)
        .single();

      if (progressData && progressData.overall_confidence !== undefined) {
        studentContext.confidence = progressData.overall_confidence;
      }

      // 1.3 Fetch student mastery details
      let masteryQuery = supabaseAdmin
        .from('mastery')
        .select('topic_id, status, confidence_score, topics(name, slug)')
        .eq('user_id', user.id);

      if (topicId) {
        masteryQuery = masteryQuery.eq('topic_id', topicId);
      }

      const { data: masteryData } = await masteryQuery.limit(5);

      if (masteryData && masteryData.length > 0) {
        studentContext.masteryStatus = masteryData[0].status || 'learning';
        if (masteryData[0].confidence_score) {
          studentContext.confidence = masteryData[0].confidence_score;
        }
      }
    } catch (ctxErr) {
      console.warn('[AI Tutor] Context query warning (proceeding with baseline profile):', ctxErr.message);
    }

    // 2. Manage conversation history in Supabase ai_conversations table
    let activeConversationId = conversationId;
    let existingMessages = [];
    let isExistingConversation = false;

    if (activeConversationId) {
      try {
        const { data: convData, error: convErr } = await supabaseAdmin
          .from('ai_conversations')
          .select('id, messages, topic_id')
          .eq('id', activeConversationId)
          .eq('user_id', user.id)
          .single();

        if (!convErr && convData) {
          isExistingConversation = true;
          existingMessages = Array.isArray(convData.messages) ? convData.messages : [];
        } else {
          // If conversation ID is invalid or belongs to another user, issue a new ID
          activeConversationId = crypto.randomUUID();
        }
      } catch (e) {
        activeConversationId = crypto.randomUUID();
      }
    } else {
      activeConversationId = crypto.randomUUID();
    }

    // 3. Request real AI response from Grok API
    const aiResult = await grokService.getChatCompletion({
      message: sanitizedMessage,
      history: existingMessages,
      language: studentContext.language,
      studentContext: studentContext
    });

    // 4. Construct updated conversation record
    const userMessageEntry = {
      role: 'user',
      content: sanitizedMessage,
      timestamp: new Date().toISOString()
    };

    const aiMessageEntry = {
      role: 'assistant',
      content: aiResult.reply,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...existingMessages, userMessageEntry, aiMessageEntry];

    // 5. Persist to Supabase ai_conversations table
    try {
      if (isExistingConversation) {
        await supabaseAdmin
          .from('ai_conversations')
          .update({
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeConversationId)
          .eq('user_id', user.id);
      } else {
        await supabaseAdmin
          .from('ai_conversations')
          .insert({
            id: activeConversationId,
            user_id: user.id,
            topic_id: topicId || null,
            messages: updatedMessages,
            session_date: new Date().toISOString()
          });
      }
    } catch (saveErr) {
      console.error('[AI Tutor] Failed to persist conversation in Supabase:', saveErr);
      // Non-fatal for client: response was successfully generated
    }

    return sendSuccess(res, {
      reply: aiResult.reply,
      conversationId: activeConversationId,
      model: aiResult.model,
      studentContext: {
        name: studentContext.name,
        grade: studentContext.grade,
        language: studentContext.language
      }
    });

  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/chat/conversations
 * Returns recent conversation sessions for the authenticated student.
 */
exports.getConversations = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return next(new AppError('Authentication required.', 401));
    }

    const { data: rows, error } = await supabaseAdmin
      .from('ai_conversations')
      .select('id, topic_id, session_date, created_at, updated_at, messages')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      return next(new AppError('Failed to fetch conversation history.', 500));
    }

    const conversations = (rows || []).map(conv => {
      const msgs = Array.isArray(conv.messages) ? conv.messages : [];
      const firstUserMsg = msgs.find(m => m.role === 'user');
      const title = firstUserMsg
        ? (firstUserMsg.content.slice(0, 45) + (firstUserMsg.content.length > 45 ? '...' : ''))
        : 'Learning Session';

      return {
        id: conv.id,
        title: title,
        messageCount: msgs.length,
        sessionDate: conv.session_date || conv.created_at,
        updatedAt: conv.updated_at || conv.created_at,
        topicId: conv.topic_id
      };
    });

    return sendSuccess(res, { conversations });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/chat/conversations/:id
 * Retrieves full message history for a specific conversation of the authenticated student.
 */
exports.getConversationById = async (req, res, next) => {
  try {
    const user = req.user;
    const conversationId = req.params.id;

    if (!user || !user.id) {
      return next(new AppError('Authentication required.', 401));
    }

    const { data, error } = await supabaseAdmin
      .from('ai_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return next(new AppError('Conversation not found.', 404));
    }

    return sendSuccess(res, {
      conversation: {
        id: data.id,
        messages: Array.isArray(data.messages) ? data.messages : [],
        sessionDate: data.session_date,
        topicId: data.topic_id
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/chat/conversations/:id
 * Deletes a student's conversation session.
 */
exports.deleteConversation = async (req, res, next) => {
  try {
    const user = req.user;
    const conversationId = req.params.id;

    if (!user || !user.id) {
      return next(new AppError('Authentication required.', 401));
    }

    const { error } = await supabaseAdmin
      .from('ai_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id);

    if (error) {
      return next(new AppError('Failed to delete conversation.', 500));
    }

    return sendSuccess(res, { message: 'Conversation deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
