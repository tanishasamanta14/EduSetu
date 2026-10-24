/* ============================================================
   EduSetu — Authentication Controller (Supabase Auth + Resilient Fallback)
   ============================================================ */

'use strict';

const { supabase, supabaseAdmin, switchToLocalStore, localAuth } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

const setAuthCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };
  res.cookie('sb-access-token', token, cookieOptions);
  res.cookie('jwt', token, cookieOptions); // Compatibility
};

const isNetworkError = (err) => {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  return (
    msg.includes('fetch failed') ||
    msg.includes('enotfound') ||
    msg.includes('econnrefused') ||
    msg.includes('network') ||
    msg.includes('timeout') ||
    msg.includes('abort')
  );
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { email, password, name, grade, role, school, language } = req.body;

    if (!email || !password || !name) {
      return next(new AppError('Please provide email, password, and name.', 400));
    }

    // Do NOT allow public admin registration
    const userRole = (role === 'mentor') ? 'mentor' : 'student';

    let user = null;
    let token = null;

    // Helper to attempt registration
    const tryPrimaryAuth = async () => {
      if (supabaseAdmin && supabaseAdmin.auth && supabaseAdmin.auth.admin && supabaseAdmin !== supabase) {
        const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            name,
            role: userRole,
            grade: grade ? Number(grade) : 8,
            school: school || '',
            language: language || 'en'
          }
        });

        if (createErr) {
          if (isNetworkError(createErr)) throw createErr;
          return { error: createErr };
        }

        user = createData?.user;
        try {
          const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
          token = signInData?.session?.access_token || `auth_${user.id}`;
        } catch (e) {
          token = `auth_${user.id}`;
        }
        return { user, token };
      } else {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: userRole,
              grade: grade ? Number(grade) : 8,
              school: school || '',
              language: language || 'en'
            }
          }
        });

        if (authErr) {
          if (isNetworkError(authErr)) throw authErr;
          return { error: authErr };
        }

        user = authData?.user;
        token = authData?.session ? authData.session.access_token : `dev_token_${user?.id}`;
        return { user, token };
      }
    };

    try {
      const result = await tryPrimaryAuth();
      if (result && result.error) {
        return next(new AppError(result.error.message, 400));
      }
    } catch (authError) {
      if (isNetworkError(authError)) {
        console.warn(`[EduSetu Auth] Cloud Supabase registration failed (${authError.message}). Falling back to local store.`);
        switchToLocalStore();
        const localRes = await localAuth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: userRole,
              grade: grade ? Number(grade) : 8,
              school: school || '',
              language: language || 'en'
            }
          }
        });

        if (localRes.error) {
          return next(new AppError(localRes.error.message, 400));
        }

        user = localRes.data.user;
        token = localRes.data.session.access_token;
      } else {
        throw authError;
      }
    }

    if (!user) {
      return next(new AppError('Failed to create account.', 500));
    }

    // 2. Ensure profile is created/upserted in profiles table
    let profile = null;
    try {
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name,
          role: userRole,
          school: school || '',
          grade: grade ? Number(grade) : 8,
          language: language || 'en',
          is_active: true
        })
        .select()
        .single();
      profile = profileData;
    } catch (upsertErr) {
      console.warn('[EduSetu Auth] Profile upsert warning:', upsertErr.message);
    }

    // Initialize learning progress for student
    try {
      await supabaseAdmin
        .from('learning_progress')
        .upsert({
          user_id: user.id,
          overall_confidence: 0,
          subject_progress: []
        }, { onConflict: 'user_id' });
    } catch (progressErr) {
      console.warn('[EduSetu Auth] Progress upsert warning:', progressErr.message);
    }

    token = token || `dev_token_${user.id}`;
    setAuthCookie(res, token);

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile ? profile.name : name,
        role: userRole,
        grade: profile ? profile.grade : (grade || 8)
      }
    }, 201);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password.', 400));
    }

    let authData = null;
    let authErr = null;

    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      authData = result.data;
      authErr = result.error;

      if (authErr && isNetworkError(authErr)) {
        throw authErr;
      }
    } catch (netErr) {
      if (isNetworkError(netErr)) {
        console.warn(`[EduSetu Auth] Cloud login failed (${netErr.message}). Falling back to local store.`);
        switchToLocalStore();
        const localResult = await localAuth.signInWithPassword({ email, password });
        authData = localResult.data;
        authErr = localResult.error;
      } else {
        throw netErr;
      }
    }

    if (authErr || !authData || !authData.user) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const user = authData.user;
    const token = authData.session ? authData.session.access_token : `dev_token_${user.id}`;

    // 2. Fetch profile from database
    let profile = null;
    try {
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profile = profileData;
    } catch (pErr) {
      console.warn('[EduSetu Auth] Profile fetch warning:', pErr.message);
    }

    setAuthCookie(res, token);

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile ? profile.name : (user.user_metadata?.name || user.email.split('@')[0]),
        role: profile ? profile.role : (user.user_metadata?.role || 'student'),
        grade: profile ? profile.grade : 8,
        language: profile ? profile.language : 'en'
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/dev-login
exports.devLogin = async (req, res, next) => {
  try {
    const email = 'student1@edusetu.in';
    let profile = null;

    try {
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      profile = profileData;
    } catch (e) {}

    if (!profile) {
      const { db } = require('../config/supabase');
      profile = (db.profiles || []).find(p => p.email === email);
    }

    if (!profile) {
      return next(new AppError('Default student account not found.', 404));
    }

    let token = `dev_token_${profile.id}`;
    try {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password: 'Password123!'
      });
      if (signInData?.session?.access_token) {
        token = signInData.session.access_token;
      }
    } catch (e) {}

    setAuthCookie(res, token);

    return sendSuccess(res, {
      token,
      user: {
        id: profile.id,
        _id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        grade: profile.grade,
        language: profile.language
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/dev-login-mentor
exports.devLoginMentor = async (req, res, next) => {
  try {
    const email = 'mentor1@edusetu.in';
    let profile = null;

    try {
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      profile = profileData;
    } catch (e) {}

    if (!profile) {
      const { db } = require('../config/supabase');
      profile = (db.profiles || []).find(p => p.email === email);
    }

    if (!profile) {
      return next(new AppError('Default mentor account not found.', 404));
    }

    let token = `dev_token_${profile.id}`;
    try {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password: 'Password123!'
      });
      if (signInData?.session?.access_token) {
        token = signInData.session.access_token;
      }
    } catch (e) {}

    setAuthCookie(res, token);

    return sendSuccess(res, {
      token,
      user: {
        id: profile.id,
        _id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        grade: profile.grade,
        language: profile.language
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout & GET /api/auth/logout
exports.logout = async (req, res) => {
  try {
    await supabase.auth.signOut();
  } catch (e) {}

  res.clearCookie('sb-access-token');
  res.clearCookie('jwt');
  return sendSuccess(res, { message: 'Logged out successfully' });
};
