/* ============================================================
   EduSetu — Mastery Controller (Supabase)
   ============================================================ */

'use strict';

const { supabaseAdmin } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/mastery
exports.getMastery = async (req, res, next) => {
  try {
    const { data: masteries, error } = await supabaseAdmin
      .from('mastery')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) {
      return next(new AppError('Failed to fetch mastery: ' + error.message, 500));
    }

    const formatted = (masteries || []).map(m => ({
      _id: m.id,
      id: m.id,
      status: m.status,
      lastScore: m.last_score,
      confidenceLevel: m.confidence_level,
      topic: m.topic ? {
        _id: m.topic.id,
        id: m.topic.id,
        name: m.topic.name,
        slug: m.topic.slug,
        subject: m.topic.subject_id
      } : null
    }));

    return sendSuccess(res, formatted);
  } catch (err) {
    next(err);
  }
};

// GET /api/mastery/map
// Generates node and edge network for vis-network graph
exports.getMasteryMap = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user's masteries
    const { data: userMasteries } = await supabaseAdmin
      .from('mastery')
      .select('*')
      .eq('user_id', userId);

    // Fetch all active topics and prerequisites
    const { data: allTopics, error: topicErr } = await supabaseAdmin
      .from('topics')
      .select('*')
      .eq('is_active', true);

    if (topicErr) {
      return next(new AppError('Failed to fetch topics: ' + topicErr.message, 500));
    }

    const { data: prerequisites } = await supabaseAdmin
      .from('topic_prerequisites')
      .select('*');

    const masteryDict = {};
    (userMasteries || []).forEach(m => {
      masteryDict[m.topic_id] = m;
    });

    const { data: allSubjects } = await supabaseAdmin
      .from('subjects')
      .select('id, name, slug');

    const subjectMap = {};
    (allSubjects || []).forEach(s => { subjectMap[s.id] = s; });

    const nodes = [];
    const edges = [];

    (allTopics || []).forEach(t => {
      const m = masteryDict[t.id];
      const status = m ? m.status : 'unattempted';
      const confidence = m ? m.confidence_level : 0;
      const subj = subjectMap[t.subject_id] || (t.subject || null);

      nodes.push({
        id: t.slug,
        topicId: t.id,
        label: t.name,
        name: t.name,
        group: t.subject_id,
        subjectId: t.subject_id,
        subjectSlug: subj ? subj.slug : null,
        status,
        confidence,
        lastScore: m ? m.last_score : null,
        grade: t.grade_level || 8
      });
    });

    (prerequisites || []).forEach(p => {
      const fromTopic = (allTopics || []).find(t => t.id === p.prerequisite_id);
      const toTopic = (allTopics || []).find(t => t.id === p.topic_id);
      if (fromTopic && toTopic) {
        edges.push({
          from: fromTopic.slug,
          to: toTopic.slug
        });
      }
    });

    return sendSuccess(res, { nodes, edges });
  } catch (err) {
    next(err);
  }
};

// GET /api/progress
exports.getProgress = async (req, res, next) => {
  try {
    const { data: lp, error } = await supabaseAdmin
      .from('learning_progress')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error || !lp) {
      return sendSuccess(res, {
        overallConfidence: 0,
        subjectProgress: []
      });
    }

    return sendSuccess(res, {
      id: lp.id,
      overallConfidence: lp.overall_confidence || 0,
      subjectProgress: lp.subject_progress || []
    });
  } catch (err) {
    next(err);
  }
};
