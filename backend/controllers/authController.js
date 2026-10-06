/* ============================================================
   EduSetu — Authentication Controller (Supabase Auth)
   ============================================================ */

'use strict';

const { supabase, supabaseAdmin } = require('../config/supabase');
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

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { email, password, name, grade, role, school, language } = req.body;

    if (!email || !password || !name) {
      return next(new AppError('Please provide email, password, and name.', 400));
    }

    // Do NOT allow public admin registration
    const userRole = (role === 'mentor') ? 'mentor' : 'student';

    // 1. Create or Sign up user via Supabase Auth
    let user;
    let token = null;

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
        return next(new AppError(createErr.message, 400));
      }

      user = createData?.user;
      const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
      token = signInData?.session?.access_token || `auth_${user.id}`;
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
        return next(new AppError(authErr.message, 400));
      }

      user = authData.user;
      token = authData?.session ? authData.session.access_token : `dev_token_${user?.id}`;
    }

    if (!user) {
      return next(new AppError('Failed to create account.', 500));
    }

    // 2. Ensure profile is created/upserted in profiles table
    const { data: profile, error: profileErr } = await supabaseAdmin
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

    if (profileErr) {
      console.error('Error creating profile row:', profileErr);
    }

    // Initialize learning progress for student
    await supabaseAdmin
      .from('learning_progress')
      .upsert({
        user_id: user.id,
        overall_confidence: 0,
        subject_progress: []
      }, { onConflict: 'user_id' });

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

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authErr || !authData || !authData.user) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const user = authData.user;
    const token = authData.session ? authData.session.access_token : `dev_token_${user.id}`;

    // 2. Fetch profile from database
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setAuthCookie(res, token);

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile ? profile.name : user.email.split('@')[0],
        role: profile ? profile.role : 'student',
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
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (!profile) {
      return next(new AppError('Default student account not found.', 404));
    }

    let token = `dev_token_${profile.id}`;
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email,
      password: 'Password123!'
    });
    if (signInData?.session?.access_token) {
      token = signInData.session.access_token;
    }

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
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (!profile) {
      return next(new AppError('Default mentor account not found.', 404));
    }

    let token = `dev_token_${profile.id}`;
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email,
      password: 'Password123!'
    });
    if (signInData?.session?.access_token) {
      token = signInData.session.access_token;
    }

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
