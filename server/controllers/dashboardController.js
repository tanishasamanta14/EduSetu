const Mastery = require('../models/Mastery');
const QuizAttempt = require('../models/QuizAttempt');
const LearningProgress = require('../models/LearningProgress');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { sendSuccess } = require('../utils/response');

exports.getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Overall Mastery / Confidence
    let lp = await LearningProgress.findOne({ user: userId });
    const overallMastery = lp ? lp.overallConfidence : 0;

    // 2. Total Quizzes & Recent Quiz Scores
    const allAttempts = await QuizAttempt.find({ user: userId }).sort({ createdAt: -1 }).populate({
      path: 'quiz',
      populate: { path: 'topic' }
    });
    
    const totalQuizzes = allAttempts.length;

    // Prepare recent scores for chart (reverse to chronological order for the graph)
    const recentQuizScores = allAttempts.slice(0, 10).reverse().map(a => {
      const percentage = a.totalQuestions > 0 ? Math.round((a.score / a.totalQuestions) * 100) : 0;
      return {
        date: a.createdAt.toISOString().split('T')[0],
        score: percentage,
        quizTitle: a.quiz ? a.quiz.title : 'Quiz'
      };
    });

    // 3. Subject Mastery
    // Group masteries by subject
    const masteries = await Mastery.find({ user: userId }).populate({ path: 'topic', populate: { path: 'subject' } });
    
    const subjectDict = {};
    masteries.forEach(m => {
      if (!m.topic || !m.topic.subject) return;
      const subjId = m.topic.subject._id.toString();
      if (!subjectDict[subjId]) {
        subjectDict[subjId] = {
          subjectName: m.topic.subject.name,
          icon: m.topic.subject.icon,
          totalConfidence: 0,
          count: 0
        };
      }
      subjectDict[subjId].totalConfidence += (m.confidenceLevel || 0);
      subjectDict[subjId].count += 1;
    });

    const subjectMastery = Object.values(subjectDict).map(s => ({
      subjectName: s.subjectName,
      icon: s.icon,
      score: Math.round(s.totalConfidence / s.count)
    }));

    // 4. Weak & Strong Topics
    const weakTopics = masteries
      .filter(m => m.status === 'weak' || m.status === 'shaky')
      .map(m => ({ name: m.topic.name, status: m.status, score: m.confidenceLevel }));

    const strongTopics = masteries
      .filter(m => m.status === 'mastered')
      .map(m => ({ name: m.topic.name, status: m.status, score: m.confidenceLevel }));

    // 5. Completion Percentage (Mastered / Total Topics Enrolled OR Total Topics overall)
    const totalActiveTopics = await Topic.countDocuments({ isActive: true });
    const masteredCount = strongTopics.length;
    const completionPercentage = totalActiveTopics > 0 ? Math.round((masteredCount / totalActiveTopics) * 100) : 0;

    // 6. Recommended Topics
    let recommendedTopics = [];
    if (weakTopics.length > 0) {
      // Pick first weak topic's prerequisites
      const weakTopicData = masteries.find(m => m.status === 'weak' || m.status === 'shaky');
      if (weakTopicData && weakTopicData.topic.prerequisites.length > 0) {
        const prereqs = await Topic.find({ _id: { $in: weakTopicData.topic.prerequisites } });
        recommendedTopics = prereqs.map(p => p.name);
      } else {
        recommendedTopics = ['Review: ' + weakTopics[0].name];
      }
    } else if (strongTopics.length > 0) {
      // Find next topic
      const strongTopicData = masteries.find(m => m.status === 'mastered');
      const nextTopics = await Topic.find({ prerequisites: strongTopicData.topic._id });
      recommendedTopics = nextTopics.map(p => p.name);
    } else {
      recommendedTopics = ['Start with Basics'];
    }

    // 7. Recent Activity (Combines quizzes)
    const recentActivity = allAttempts.slice(0, 5).map(a => {
      const percentage = a.totalQuestions > 0 ? Math.round((a.score / a.totalQuestions) * 100) : 0;
      return {
        type: 'quiz',
        title: 'Completed ' + (a.quiz ? a.quiz.title : 'a quiz'),
        score: percentage,
        date: a.createdAt
      };
    });

    // 8. Learning Streak
    // Count distinct dates from attempts
    const distinctDates = new Set();
    allAttempts.forEach(a => {
      distinctDates.add(a.createdAt.toISOString().split('T')[0]);
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
        name: req.user.name,
        grade: req.user.grade
      } // Needed for welcome header if not available locally
    });

  } catch (error) {
    next(error);
  }
};
