/* ============================================================
   EduSetu — Profile Controller (Supabase)
   ============================================================ */

'use strict';

const { supabaseAdmin } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/profile
exports.getProfile = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return next(new AppError('Profile not found', 404));
    }

    return sendSuccess(res, {
      id: profile.id,
      name: profile.name,
      email: profile.email || req.user.email,
      school: profile.school,
      grade: profile.grade,
      language: profile.language,
      role: profile.role
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, school, grade, language } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (school !== undefined) updates.school = school;
    if (grade) updates.grade = Number(grade);
    if (language) updates.language = language;

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error || !updatedProfile) {
      return next(new AppError('Failed to update profile: ' + (error ? error.message : 'Unknown error'), 500));
    }

    return sendSuccess(res, {
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email || req.user.email,
      school: updatedProfile.school,
      grade: updatedProfile.grade,
      language: updatedProfile.language,
      role: updatedProfile.role
    });
  } catch (error) {
    next(error);
  }
};
