const StudentProfile = require('../models/StudentProfile');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/profile
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }
    
    // We also return the user's email from the User model since req.user has it
    return sendSuccess(res, {
      name: profile.name,
      email: req.user.email,
      school: profile.school,
      grade: profile.grade,
      language: profile.language,
      role: req.user.role
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, school, grade, language } = req.body;
    
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }

    if (name) profile.name = name;
    if (school !== undefined) profile.school = school;
    if (grade) profile.grade = Number(grade);
    if (language) profile.language = language;
    
    await profile.save();
    
    return sendSuccess(res, {
      name: profile.name,
      email: req.user.email,
      school: profile.school,
      grade: profile.grade,
      language: profile.language,
      role: req.user.role
    });
  } catch (error) {
    next(error);
  }
};
