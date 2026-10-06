/* ============================================================
   EduSetu — Quiz Controller (Supabase)
   Server-side diagnostic evaluation, misconception analysis,
   mastery updates, and learning progress tracking.
   ============================================================ */

'use strict';

const { supabaseAdmin } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/quizzes
exports.getQuizzes = async (req, res, next) => {
  try {
    const { data: quizzes, error } = await supabaseAdmin
      .from('quizzes')
      .select('*, topics(*)')
      .eq('is_active', true);

    if (error) {
      return next(new AppError('Failed to fetch quizzes: ' + error.message, 500));
    }

    const formatted = (quizzes || []).map(q => {
      const topicObj = q.topics || q.topic;
      return {
        _id: q.id,
        id: q.id,
        title: q.title,
        topic: topicObj ? {
          _id: topicObj.id,
          id: topicObj.id,
          name: topicObj.name,
          slug: topicObj.slug,
          subject: topicObj.subject_id,
          gradeLevel: topicObj.grade_level
        } : null
      };
    });

    return sendSuccess(res, formatted);
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/:id
// Returns quiz with sanitized questions (omitting correct answers & misconception tags)
exports.getQuizById = async (req, res, next) => {
  try {
    const { data: quiz, error } = await supabaseAdmin
      .from('quizzes')
      .select('*, topics(*), quiz_questions(order_index, questions(*))')
      .eq('id', req.params.id)
      .single();

    if (error || !quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    const rawQuestions = (quiz.quiz_questions || [])
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map(qq => qq.questions)
      .filter(Boolean);

    // Sanitize questions: only send text and options.text
    const sanitizedQuestions = (rawQuestions.length > 0 ? rawQuestions : (quiz.questions || [])).map(q => ({
      _id: q.id,
      id: q.id,
      text: q.text,
      difficulty: q.difficulty,
      options: (q.options || []).map(opt => ({ text: opt.text }))
    }));

    const topicObj = quiz.topics || quiz.topic;

    return sendSuccess(res, {
      _id: quiz.id,
      id: quiz.id,
      title: quiz.title,
      topic: topicObj ? {
        _id: topicObj.id,
        id: topicObj.id,
        name: topicObj.name,
        slug: topicObj.slug,
        subject: topicObj.subject_id
      } : null,
      questions: sanitizedQuestions
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/quizzes/:id/attempt
// Source of truth for quiz evaluation & diagnostic misconception analysis
exports.submitAttempt = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const userId = req.user.id;
    const { answers = [], timeTaken = 0 } = req.body;

    // 1. Fetch complete quiz with full questions from database
    const { data: quiz, error: quizErr } = await supabaseAdmin
      .from('quizzes')
      .select('*, topics(*), quiz_questions(order_index, questions(*))')
      .eq('id', quizId)
      .single();

    if (quizErr || !quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    const rawQuestions = (quiz.quiz_questions || [])
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map(qq => qq.questions)
      .filter(Boolean);

    const questions = rawQuestions.length > 0 ? rawQuestions : (quiz.questions || []);
    let correctCount = 0;
    const attemptAnswers = [];
    const misconceptionsFound = [];

    // 2. Evaluate answers
    for (const q of questions) {
      const submitted = answers.find(a => (a.questionId === q.id || a.questionId === q._id));
      let isCorrect = false;
      let misconceptionTag = null;
      let selectedText = null;

      if (submitted) {
        selectedText = submitted.selectedOptionText;
        const matchedOption = (q.options || []).find(opt => opt.text === selectedText);

        if (matchedOption) {
          isCorrect = Boolean(matchedOption.isCorrect);
          if (!isCorrect && matchedOption.misconceptionTag) {
            misconceptionTag = matchedOption.misconceptionTag;
            misconceptionsFound.push({
              question: q.text,
              tag: misconceptionTag,
              explanation: q.explanation || 'Review this concept carefully.'
            });
          }
        }
      }

      if (isCorrect) correctCount++;

      attemptAnswers.push({
        question_id: q.id,
        selected_option_text: selectedText,
        is_correct: isCorrect,
        misconception_tag: misconceptionTag
      });
    }

    const totalQuestions = questions.length || 1;
    const score = correctCount;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 80;

    // 3. Persist Quiz Attempt to Supabase
    const { data: attempt, error: attemptErr } = await supabaseAdmin
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        quiz_id: quiz.id,
        score,
        total_questions: totalQuestions,
        percentage,
        passed,
        time_taken: Number(timeTaken) || 0
      })
      .select()
      .single();

    if (attemptErr) {
      console.error('Failed to save quiz attempt:', attemptErr);
    }

    const attemptId = attempt ? attempt.id : require('crypto').randomUUID();

    // 4. Persist Individual Answers to quiz_answers table
    if (attemptAnswers.length > 0) {
      const answerRows = attemptAnswers.map(ans => ({
        attempt_id: attemptId,
        question_id: ans.question_id,
        selected_option_text: ans.selected_option_text,
        is_correct: ans.is_correct,
        misconception_tag: ans.misconception_tag
      }));

      await supabaseAdmin.from('quiz_answers').insert(answerRows);
    }

    // 5. Update Mastery for Topic
    let newStatus = 'unattempted';
    if (percentage >= 80) newStatus = 'mastered';
    else if (percentage >= 60) newStatus = 'developing';
    else if (percentage >= 40) newStatus = 'shaky';
    else newStatus = 'weak';

    const topicId = quiz.topic_id || (quiz.topic ? quiz.topic.id : null);

    if (topicId) {
      await supabaseAdmin
        .from('mastery')
        .upsert({
          user_id: userId,
          topic_id: topicId,
          status: newStatus,
          last_score: percentage,
          confidence_level: percentage
        }, { onConflict: 'user_id,topic_id' });
    }

    // 6. Update Learning Progress
    const { data: allMasteries } = await supabaseAdmin
      .from('mastery')
      .select('confidence_level')
      .eq('user_id', userId);

    const masteriesList = allMasteries || [];
    const sumConfidence = masteriesList.reduce((acc, m) => acc + (m.confidence_level || 0), 0);
    const avgConfidence = Math.round(sumConfidence / (masteriesList.length || 1));

    await supabaseAdmin
      .from('learning_progress')
      .upsert({
        user_id: userId,
        overall_confidence: avgConfidence
      }, { onConflict: 'user_id' });

    // 7. Determine Recommendations based on Mastery
    let recommendedTopics = [];
    const { data: allTopics } = await supabaseAdmin.from('topics').select('id, name, slug').eq('is_active', true);
    const topicsList = allTopics || [];

    if (newStatus === 'weak' || newStatus === 'shaky') {
      recommendedTopics = topicsList.slice(0, 2).map(t => ({ name: t.name, slug: t.slug }));
    } else {
      recommendedTopics = topicsList.slice(1, 3).map(t => ({ name: t.name, slug: t.slug }));
    }

    return sendSuccess(res, {
      attemptId,
      score,
      totalQuestions,
      percentage,
      passed,
      misconceptions: misconceptionsFound,
      newMasteryStatus: newStatus,
      recommendedTopics
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/quiz-attempts
exports.getAttempts = async (req, res, next) => {
  try {
    const { data: attempts, error } = await supabaseAdmin
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return next(new AppError('Failed to fetch attempts: ' + error.message, 500));
    }

    const formatted = (attempts || []).map(a => ({
      _id: a.id,
      id: a.id,
      user_id: a.user_id,
      userId: a.user_id,
      score: a.score,
      totalQuestions: a.total_questions,
      percentage: a.percentage,
      passed: a.passed,
      timeTaken: a.time_taken,
      createdAt: a.created_at,
      quiz: a.quiz ? {
        _id: a.quiz.id,
        id: a.quiz.id,
        title: a.quiz.title,
        topic: a.quiz.topic ? {
          _id: a.quiz.topic.id,
          id: a.quiz.topic.id,
          name: a.quiz.topic.name,
          slug: a.quiz.topic.slug
        } : null
      } : null
    }));

    return sendSuccess(res, formatted);
  } catch (error) {
    next(error);
  }
};

// GET /api/quiz-attempts/:id
exports.getAttemptById = async (req, res, next) => {
  try {
    const { data: attempt, error } = await supabaseAdmin
      .from('quiz_attempts')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !attempt) {
      return next(new AppError('Attempt not found', 404));
    }

    return sendSuccess(res, attempt);
  } catch (error) {
    next(error);
  }
};
