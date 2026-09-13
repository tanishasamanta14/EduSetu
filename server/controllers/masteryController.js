const Mastery = require('../models/Mastery');
const LearningProgress = require('../models/LearningProgress');
const Topic = require('../models/Topic');
const { sendSuccess } = require('../utils/response');

exports.getMastery = async (req, res, next) => {
  try {
    const masteries = await Mastery.find({ user: req.user._id }).populate('topic');
    return sendSuccess(res, masteries);
  } catch (err) {
    next(err);
  }
};

exports.getMasteryMap = async (req, res, next) => {
  try {
    // Generate nodes and edges for mastery-map.html
    const masteries = await Mastery.find({ user: req.user._id }).populate('topic');
    const allTopics = await Topic.find({ isActive: true });
    
    // Create a dictionary of user's masteries
    const userMasteryDict = {};
    masteries.forEach(m => {
      userMasteryDict[m.topic._id.toString()] = m;
    });

    const nodes = [];
    const edges = [];

    allTopics.forEach(topic => {
      const mastery = userMasteryDict[topic._id.toString()];
      const status = mastery ? mastery.status : 'unattempted';
      const confidence = mastery ? mastery.confidenceLevel : 0;
      
      nodes.push({
        id: topic.slug, // Use slug for frontend mapping
        label: topic.name,
        group: topic.subject.toString(), // or name
        status: status,
        confidence: confidence,
        grade: topic.gradeLevel || 8
      });

      // Map prerequisites to edges
      if (topic.prerequisites && topic.prerequisites.length > 0) {
        topic.prerequisites.forEach(prereqId => {
          const prereqTopic = allTopics.find(t => t._id.toString() === prereqId.toString());
          if (prereqTopic) {
            edges.push({
              from: prereqTopic.slug,
              to: topic.slug
            });
          }
        });
      }
    });

    return sendSuccess(res, { nodes, edges });
  } catch (err) {
    next(err);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const lp = await LearningProgress.findOne({ user: req.user._id }).populate('subjectProgress.subject');
    return sendSuccess(res, lp || { overallConfidence: 0, subjectProgress: [] });
  } catch (err) {
    next(err);
  }
};
