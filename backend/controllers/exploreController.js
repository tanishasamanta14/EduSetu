/* ============================================================
   EduSetu — Explore Controller (Supabase)
   ============================================================ */

'use strict';

const { supabaseAdmin } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/subjects
exports.getSubjects = async (req, res, next) => {
  try {
    const { data: subjects, error } = await supabaseAdmin
      .from('subjects')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      return next(new AppError('Failed to fetch subjects: ' + error.message, 500));
    }

    return sendSuccess(res, subjects || []);
  } catch (error) {
    next(error);
  }
};

// GET /api/topics
// Supports query params: q, level, subject, difficulty
exports.getTopics = async (req, res, next) => {
  try {
    const { q, level, subject, difficulty } = req.query;

    let query = supabaseAdmin
      .from('topics')
      .select('*')
      .eq('is_active', true);

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }

    if (level && level !== 'all') {
      const levelMap = {
        primary: { min: 1, max: 5 },
        middle: { min: 6, max: 8 },
        secondary: { min: 9, max: 10 },
        higher: { min: 11, max: 12 },
        graduation: { min: 13, max: 16 }
      };
      if (levelMap[level]) {
        query = query.gte('grade_level', levelMap[level].min).lte('grade_level', levelMap[level].max);
      }
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data: rawTopics, error } = await query.order('grade_level').order('name');

    if (error) {
      return next(new AppError('Failed to fetch topics: ' + error.message, 500));
    }

    let topics = rawTopics || [];

    // Filter by subject slug or ID if requested
    if (subject) {
      // Find subject ID by slug or ID
      const { data: subData } = await supabaseAdmin
        .from('subjects')
        .select('id, slug')
        .eq('is_active', true);

      const targetSub = (subData || []).find(s => s.id === subject || s.slug === subject);
      if (targetSub) {
        topics = topics.filter(t => t.subject_id === targetSub.id);
      } else {
        return sendSuccess(res, []);
      }
    }

    // Map properties for frontend compatibility (e.g., topic.subject, topic.gradeLevel)
    const formattedTopics = topics.map(t => ({
      _id: t.id,
      id: t.id,
      name: t.name,
      slug: t.slug,
      gradeLevel: t.grade_level,
      difficulty: t.difficulty,
      description: t.description,
      keyPoints: t.key_points || [],
      subject: t.subject ? {
        _id: t.subject.id,
        id: t.subject.id,
        name: t.subject.name,
        slug: t.subject.slug,
        icon: t.subject.icon
      } : null,
      prerequisites: (t.prerequisites || []).map(p => p.prerequisite).filter(Boolean)
    }));

    return sendSuccess(res, formattedTopics);
  } catch (error) {
    next(error);
  }
};

// GET /api/topics/:id
exports.getTopicById = async (req, res, next) => {
  try {
    const { data: topic, error } = await supabaseAdmin
      .from('topics')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !topic) {
      return next(new AppError('Topic not found', 404));
    }

    return sendSuccess(res, {
      _id: topic.id,
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      gradeLevel: topic.grade_level,
      difficulty: topic.difficulty,
      description: topic.description,
      keyPoints: topic.key_points || [],
      subject: topic.subject,
      prerequisites: (topic.prerequisites || []).map(p => p.prerequisite).filter(Boolean)
    });
  } catch (error) {
    next(error);
  }
};
