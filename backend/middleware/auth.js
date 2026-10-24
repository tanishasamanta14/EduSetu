/* ============================================================
   EduSetu — Authentication & Role Middleware (Supabase Auth)
   ============================================================ */

'use strict';

const { supabase, supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

/**
 * Protect routes: verifies Supabase Auth session/token
 */
exports.protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && (req.cookies['sb-access-token'] || req.cookies.jwt)) {
      token = req.cookies['sb-access-token'] || req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // Verify token with Supabase Auth or Local Auth
    let authUser = null;
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data && data.user) {
        authUser = data.user;
      }
    } catch (err) {
      // Network failure on cloud supabase
    }

    if (!authUser) {
      const { localAuth } = require('../config/supabase');
      const { data: localData } = await localAuth.getUser(token);
      if (localData && localData.user) {
        authUser = localData.user;
      }
    }

    if (!authUser) {
      return next(new AppError('Authentication failed or session expired. Please log in again.', 401));
    }

    // Fetch user profile from the profiles table
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileErr || !profile) {
      return next(new AppError('The profile belonging to this user could not be found.', 401));
    }

    if (!profile.is_active) {
      return next(new AppError('This user account has been deactivated.', 403));
    }

    // Attach user information to request
    req.user = {
      id: profile.id,
      _id: profile.id, // For backward compatibility with existing controllers
      email: profile.email || authUser.email,
      name: profile.name,
      role: profile.role,
      grade: profile.grade,
      school: profile.school,
      language: profile.language
    };

    next();
  } catch (error) {
    next(new AppError('Authentication failed: ' + error.message, 401));
  }
};

/**
 * Restrict to specified roles (e.g. 'mentor', 'admin')
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
