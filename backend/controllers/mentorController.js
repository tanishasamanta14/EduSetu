/* ============================================================
   EduSetu — Mentor Controller (Supabase)
   ============================================================ */

'use strict';

const { supabaseAdmin } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// POST /api/mentor/students (Assign student by email)
exports.addStudent = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new AppError('Please provide student email.', 400));
    }

    // 1. Find student profile in profiles table
    const { data: student, error: studentErr } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name, role')
      .eq('email', email)
      .eq('role', 'student')
      .single();

    if (studentErr || !student) {
      return next(new AppError('Student not found with that email.', 404));
    }

    // 2. Check existing linkage
    const { data: existing } = await supabaseAdmin
      .from('mentor_students')
      .select('id')
      .eq('mentor_id', req.user.id)
      .eq('student_id', student.id)
      .single();

    if (existing) {
      return next(new AppError('Student is already assigned to you.', 400));
    }

    // 3. Create linkage
    const { error: insertErr } = await supabaseAdmin
      .from('mentor_students')
      .insert({
        mentor_id: req.user.id,
        student_id: student.id,
        status: 'active'
      });

    if (insertErr) {
      return next(new AppError('Failed to assign student: ' + insertErr.message, 500));
    }

    return sendSuccess(res, { message: 'Student successfully added.' }, 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/mentor/students (List assigned students)
exports.getStudents = async (req, res, next) => {
  try {
    const { data: linkages, error } = await supabaseAdmin
      .from('mentor_students')
      .select('*')
      .eq('mentor_id', req.user.id)
      .eq('status', 'active');

    if (error) {
      return next(new AppError('Failed to fetch students: ' + error.message, 500));
    }

    const studentsData = (linkages || []).map(l => ({
      _id: l.student ? l.student.id : l.student_id,
      id: l.student ? l.student.id : l.student_id,
      email: l.student ? l.student.email : '',
      name: l.student ? l.student.name : 'Student',
      grade: l.student ? l.student.grade : 8
    }));

    return sendSuccess(res, studentsData);
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/mentor
exports.getMentorDashboard = async (req, res, next) => {
  try {
    const { data: linkages } = await supabaseAdmin
      .from('mentor_students')
      .select('*')
      .eq('mentor_id', req.user.id)
      .eq('status', 'active');

    const assigned = linkages || [];
    const studentIds = assigned.map(l => l.student_id);

    if (studentIds.length === 0) {
      return sendSuccess(res, {
        assignedStudents: [],
        classAverage: 0,
        weakTopics: [],
        atRiskStudents: [],
        interventions: ['Assign your first student to start monitoring learning progress.']
      });
    }

    // 1. Fetch profiles and learning progress for all linked students
    const students = [];
    let totalConfidence = 0;

    for (const sId of studentIds) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', sId)
        .single();

      const { data: lp } = await supabaseAdmin
        .from('learning_progress')
        .select('overall_confidence')
        .eq('user_id', sId)
        .single();

      const conf = lp ? lp.overall_confidence : 0;
      totalConfidence += conf;

      students.push({
        _id: sId,
        id: sId,
        name: profile ? profile.name : 'Student',
        email: profile ? profile.email : '',
        grade: profile ? profile.grade : 8,
        overallConfidence: conf
      });
    }

    const classAverage = students.length > 0 ? Math.round(totalConfidence / students.length) : 0;

    // 2. Identify At-Risk Students & Interventions
    const atRiskStudents = [];
    const interventions = [];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    for (const student of students) {
      const reasons = [];

      if (student.overallConfidence < 50) {
        reasons.push(`Low overall confidence (${student.overallConfidence}%)`);
      }

      // Check quiz attempts
      const { data: attempts } = await supabaseAdmin
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', student.id)
        .order('created_at', { ascending: false })
        .limit(3);

      const recentAttempts = attempts || [];
      if (recentAttempts.length === 0 || recentAttempts[0].created_at < sevenDaysAgo) {
        reasons.push('Inactive for over 7 days');
      }

      const recentFails = recentAttempts.filter(a => (a.percentage || 0) < 50);
      if (recentFails.length >= 2) {
        reasons.push('Declining performance / Repeated failed attempts');
      }

      if (reasons.length > 0) {
        atRiskStudents.push({
          name: student.name,
          reasons,
          overallConfidence: student.overallConfidence
        });
        interventions.push(`Schedule 1-on-1 with ${student.name} (${reasons[0]})`);
      }
    }

    // 3. Class Weak Topics from Mastery Table
    const { data: masteries } = await supabaseAdmin
      .from('mastery')
      .select('*')
      .in('user_id', studentIds)
      .in('status', ['weak', 'shaky']);

    const topicCount = {};
    (masteries || []).forEach(m => {
      const topicName = m.topic ? m.topic.name : 'Algebraic Expressions';
      topicCount[topicName] = (topicCount[topicName] || 0) + 1;
    });

    const weakTopics = Object.entries(topicCount)
      .map(([name, count]) => ({ name, studentCount: count }))
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 5);

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
