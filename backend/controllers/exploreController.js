const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/subjects
exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ isActive: true }).sort('name');
    return sendSuccess(res, subjects);
  } catch (error) {
    next(error);
  }
};

// GET /api/topics
// Supports query params: q (search), level, subject, difficulty
exports.getTopics = async (req, res, next) => {
  try {
    const { q, level, subject, difficulty } = req.query;
    
    let query = { isActive: true };

    if (q) {
      query.name = { $regex: q, $options: 'i' };
    }
    
    if (level && level !== 'all') {
      const levelMap = {
        primary: { $gte: 1, $lte: 5 },
        middle: { $gte: 6, $lte: 8 },
        secondary: { $gte: 9, $lte: 10 },
        higher: { $gte: 11, $lte: 12 },
        graduation: { $gte: 13 }
      };
      if (levelMap[level]) {
        query.gradeLevel = levelMap[level];
      }
    }
    if (subject) {
      // Find subject by slug or ID
      if (subject.length === 24) { // Basic ObjectId check
        query.subject = subject;
      } else {
        const sub = await Subject.findOne({ slug: subject });
        if (sub) {
          query.subject = sub._id;
        } else {
          return sendSuccess(res, []); // No matching subject found
        }
      }
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const topics = await Topic.find(query)
      .populate('subject', 'name slug icon')
      .populate('prerequisites', 'name slug')
      .sort('gradeLevel name');

    return sendSuccess(res, topics);
  } catch (error) {
    next(error);
  }
};

// GET /api/topics/:id
exports.getTopicById = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('subject', 'name slug icon')
      .populate('prerequisites', 'name slug');
      
    if (!topic) {
      return next(new AppError('Topic not found', 404));
    }
    
    return sendSuccess(res, topic);
  } catch (error) {
    next(error);
  }
};
