/* ============================================================
   EduSetu — Student Dashboard Controller (Supabase)
   Calculates real mastery data, performance trends, and streaks.
   ============================================================ */

'use strict';

const { supabaseAdmin } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/dashboard/student
exports.getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Overall Confidence from learning_progress
    const { data: lp } = await supabaseAdmin
      .from('learning_progress')
      .select('overall_confidence')
      .eq('user_id', userId)
      .single();

    const overallMastery = lp ? lp.overall_confidence : 0;

    // 2. Quiz Attempts
    const { data: attempts } = await supabaseAdmin
      .from('quiz_attempts')
      .select('*, quizzes(title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const allAttempts = attempts || [];
    const totalQuizzes = allAttempts.length;

    // Recent 10 quiz scores (chronological order for graph)
    const recentQuizScores = allAttempts.slice(0, 10).reverse().map(a => {
      const percentage = a.total_questions > 0 ? Math.round((a.score / a.total_questions) * 100) : a.percentage;
      const qObj = a.quizzes || a.quiz;
      return {
        date: (a.created_at || '').split('T')[0],
        score: percentage,
        quizTitle: qObj ? qObj.title : 'Diagnostic Quiz'
      };
    });

    // 3. User Mastery Records
    const { data: masteries } = await supabaseAdmin
      .from('mastery')
      .select('*, topics(*, subjects(*))')
      .eq('user_id', userId);

    const masteryList = masteries || [];

    // Group mastery by subject
    const { data: subjects } = await supabaseAdmin.from('subjects').select('*').eq('is_active', true);
    const subjectList = subjects || [];

    const subjectDict = {};
    masteryList.forEach(m => {
      const topic = m.topics || m.topic;
      if (!topic) return;
      const subj = topic.subjects || topic.subject;
      if (!subj) return;
      if (!subjectDict[subj.id]) {
        subjectDict[subj.id] = {
          subjectName: subj.name,
          icon: subj.icon,
          totalConfidence: 0,
          count: 0
        };
      }
      subjectDict[subj.id].totalConfidence += (m.confidence_level || 0);
      subjectDict[subj.id].count += 1;
    });

    // Provide default subject scores if empty
    const subjectMastery = Object.values(subjectDict).length > 0
      ? Object.values(subjectDict).map(s => ({
          subjectName: s.subjectName,
          icon: s.icon,
          score: Math.round(s.totalConfidence / s.count)
        }))
      : subjectList.map(s => ({
          subjectName: s.name,
          icon: s.icon,
          score: 0
        }));

    // 4. Weak & Strong Topics
    const weakTopics = masteryList
      .filter(m => m.status === 'weak' || m.status === 'shaky')
      .map(m => {
        const topic = m.topics || m.topic;
        return {
          name: topic ? topic.name : 'Unknown Topic',
          status: m.status,
          score: m.confidence_level
        };
      });

    const strongTopics = masteryList
      .filter(m => m.status === 'mastered')
      .map(m => {
        const topic = m.topics || m.topic;
        return {
          name: topic ? topic.name : 'Unknown Topic',
          status: m.status,
          score: m.confidence_level
        };
      });

    // 5. Completion Percentage
    const { data: allTopics } = await supabaseAdmin.from('topics').select('id, name, slug').eq('is_active', true);
    const totalActiveTopics = (allTopics || []).length;
    const masteredCount = strongTopics.length;
    const completionPercentage = totalActiveTopics > 0 ? Math.round((masteredCount / totalActiveTopics) * 100) : 0;

    // 6. Recommended Topics
    let recommendedTopics = [];
    if (weakTopics.length > 0) {
      recommendedTopics = ['Review: ' + weakTopics[0].name];
    } else if (strongTopics.length > 0) {
      recommendedTopics = (allTopics || []).slice(2, 4).map(t => t.name);
    } else {
      recommendedTopics = (allTopics || []).slice(0, 2).map(t => t.name);
    }
    if (recommendedTopics.length === 0) recommendedTopics = ['Start with Basics'];

    // 7. Recent Activity
    const recentActivity = allAttempts.slice(0, 5).map(a => {
      const percentage = a.total_questions > 0 ? Math.round((a.score / a.total_questions) * 100) : a.percentage;
      return {
        type: 'quiz',
        title: 'Completed ' + (a.quiz ? a.quiz.title : 'Diagnostic Quiz'),
        score: percentage,
        date: a.created_at
      };
    });

    // 8. Learning Streak
    const distinctDates = new Set();
    allAttempts.forEach(a => {
      if (a.created_at) distinctDates.add(a.created_at.split('T')[0]);
    });
    const learningStreak = distinctDates.size;

    return sendSuccess(res, {
      overallMastery,
      subjectMastery,
      recentQuizScores,
      totalQuizzes,
      weakTopics,
      strongTopics,
      learningStreak,
      completionPercentage,
      recommendedTopics,
      recentActivity,
      user: {
        id: req.user.id,
        name: req.user.name,
        grade: req.user.grade
      }
    });
  } catch (error) {
    next(error);
  }
};
