const MentorStudent = require('../models/MentorStudent');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Mastery = require('../models/Mastery');
const LearningProgress = require('../models/LearningProgress');
const QuizAttempt = require('../models/QuizAttempt');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// POST /api/mentor/students (Assign a student by email)
exports.addStudent = async (req, res, next) => {
  try {
    const { email } = req.body;
    const student = await User.findOne({ email, role: 'student' });
    
    if (!student) {
      return next(new AppError('Student not found with that email.', 404));
    }

    const existing = await MentorStudent.findOne({ mentor: req.user._id, student: student._id });
    if (existing) {
      return next(new AppError('Student is already assigned to you.', 400));
    }

    await MentorStudent.create({
      mentor: req.user._id,
      student: student._id
    });

    return sendSuccess(res, { message: 'Student successfully added.' }, 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/mentor/students (List students)
exports.getStudents = async (req, res, next) => {
  try {
    const relations = await MentorStudent.find({ mentor: req.user._id, status: 'active' }).populate('student', 'email');
    
    const studentsData = await Promise.all(relations.map(async (r) => {
      const profile = await StudentProfile.findOne({ user: r.student._id });
      return {
        _id: r.student._id,
        email: r.student.email,
        name: profile ? profile.name : 'Unknown',
        grade: profile ? profile.grade : null
      };
    }));

    return sendSuccess(res, studentsData);
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/mentor
exports.getMentorDashboard = async (req, res, next) => {
  try {
    const relations = await MentorStudent.find({ mentor: req.user._id, status: 'active' });
    const studentIds = relations.map(r => r.student);

    if (studentIds.length === 0) {
      return sendSuccess(res, {
        assignedStudents: [],
        classAverage: 0,
        weakTopics: [],
        atRiskStudents: [],
        interventions: ["Assign your first student to start monitoring."]
      });
    }

    // 1. Get basic profiles and LP for students
    const students = [];
    let totalConfidence = 0;

    for (const sId of studentIds) {
      const profile = await StudentProfile.findOne({ user: sId });
      const lp = await LearningProgress.findOne({ user: sId });
      const conf = lp ? lp.overallConfidence : 0;
      totalConfidence += conf;
      
      students.push({
        _id: sId,
        name: profile ? profile.name : 'Unknown',
        grade: profile ? profile.grade : 'N/A',
        overallConfidence: conf
      });
    }

    const classAverage = Math.round(totalConfidence / students.length);

    // 2. Identify At-Risk Students & Interventions
    const atRiskStudents = [];
    const interventions = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (const student of students) {
      const reasons = [];
      
      // Check low mastery
      if (student.overallConfidence < 50) {
        reasons.push(`Low overall confidence (${student.overallConfidence}%)`);
      }

      // Check inactivity
      const recentAttempts = await QuizAttempt.find({ user: student._id })
        .sort({ createdAt: -1 })
        .limit(3);

      if (recentAttempts.length === 0 || recentAttempts[0].createdAt < sevenDaysAgo) {
        reasons.push('Inactive for over 7 days');
      }

      // Check repeated failures (consecutive < 50%)
      const recentFails = recentAttempts.filter(a => a.percentage < 50);
      if (recentFails.length >= 2) {
        reasons.push('Declining performance / Repeated failed attempts');
      }

      if (reasons.length > 0) {
        atRiskStudents.push({
          name: student.name,
          reasons: reasons,
          overallConfidence: student.overallConfidence
        });
        
        interventions.push(`Schedule 1-on-1 with ${student.name} (${reasons[0]})`);
      }
    }

    // 3. Class Weak Topics (Count topics that are 'weak'/'shaky' across students)
    const masteries = await Mastery.find({ user: { $in: studentIds }, status: { $in: ['weak', 'shaky'] } })
      .populate('topic', 'name');
    
    const topicCount = {};
    masteries.forEach(m => {
      if (!m.topic) return;
      const topicName = m.topic.name;
      topicCount[topicName] = (topicCount[topicName] || 0) + 1;
    });

    const weakTopics = Object.entries(topicCount)
      .map(([name, count]) => ({ name, studentCount: count }))
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 5); // Top 5 weak topics

    // Recommendations for class
    if (weakTopics.length > 0) {
      interventions.push(`Review '${weakTopics[0].name}' in next group session (${weakTopics[0].studentCount} students struggling).`);
    }

    return sendSuccess(res, {
      assignedStudents: students,
      classAverage,
      weakTopics,
      atRiskStudents,
      interventions
    });

  } catch (error) {
    next(error);
  }
};
