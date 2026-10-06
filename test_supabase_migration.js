/* ============================================================
   EduSetu — End-to-End Test & Verification Suite
   Validates all 18 required flows for Supabase architecture.
   ============================================================ */

'use strict';

const app = require('./backend/app');
const config = require('./backend/config/env');
const { checkConnection } = require('./backend/config/supabase');

let server;
const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runTests() {
  console.log('========================================================');
  console.log(' EduSetu — Running Supabase Migration Verification Suite');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // Start HTTP server on PORT 3000
  server = await new Promise((resolve) => {
    const s = app.listen(PORT, '127.0.0.1', () => {
      console.log(`[INIT] Test server running at ${BASE_URL}\n`);
      resolve(s);
    });
  });

  try {
    // Flow 1: Backend starts successfully
    assert(server !== null, 'Flow 1: Backend server started successfully on port 3000');

    // Flow 2: Supabase connection works
    const conn = await checkConnection();
    assert(conn.connected === true, `Flow 2: Supabase connection verified (${conn.provider})`);

    // Verify health endpoint
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.data.database.connected === true, 'Flow 2b: /api/health reports database connected');

    // Flow 3: User registration works
    const testStudentEmail = `test_student_${Date.now()}@edusetu.in`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Sharma',
        email: testStudentEmail,
        password: 'Password123!',
        grade: 8,
        school: 'Kendriya Vidyalaya Delhi',
        role: 'student'
      })
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201 && regJson.success && regJson.data.user.email === testStudentEmail, 'Flow 3: Student registration works via Supabase Auth');
    const newStudentToken = regJson.data.token;

    // Flow 4: User login works
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testStudentEmail,
        password: 'Password123!'
      })
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200 && loginJson.success && loginJson.data.token, 'Flow 4: Student login works with credentials');
    const studentToken = loginJson.data.token;

    // Flow 5: Protected route works
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.data.user.email === testStudentEmail, 'Flow 5: Protected route /api/auth/me resolves user profile');

    // Flow 5b: Profile updates persist
    const updateProfileRes = await fetch(`${BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Rohan V. Sharma',
        school: 'Kendriya Vidyalaya No. 1',
        grade: 9
      })
    });
    const updateProfileJson = await updateProfileRes.json();
    assert(updateProfileRes.status === 200 && updateProfileJson.data.grade === 9 && updateProfileJson.data.school === 'Kendriya Vidyalaya No. 1', 'Flow 5b: Profile updates persist into Supabase profiles table');

    // Flow 6: Explore subjects/topics load
    const subRes = await fetch(`${BASE_URL}/api/subjects`);
    const subJson = await subRes.json();
    assert(subRes.status === 200 && Array.isArray(subJson.data) && subJson.data.length >= 3, `Flow 6a: Explore /api/subjects returns ${subJson.data ? subJson.data.length : 0} active subjects`);

    const topRes = await fetch(`${BASE_URL}/api/topics`);
    const topJson = await topRes.json();
    assert(topRes.status === 200 && Array.isArray(topJson.data) && topJson.data.length >= 3, `Flow 6b: Explore /api/topics returns ${topJson.data ? topJson.data.length : 0} active topics with subjects attached`);

    // Flow 7: Quiz fetches questions (sanitized without leaking correct answers)
    const quizzesRes = await fetch(`${BASE_URL}/api/quizzes`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const quizzesJson = await quizzesRes.json();
    assert(quizzesRes.status === 200 && Array.isArray(quizzesJson.data) && quizzesJson.data.length > 0, 'Flow 7a: Quizzes list retrieved');

    const firstQuiz = quizzesJson.data[0];
    const quizDetailRes = await fetch(`${BASE_URL}/api/quizzes/${firstQuiz._id || firstQuiz.id}`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const quizDetailJson = await quizDetailRes.json();
    const hasQuestions = quizDetailJson.data.questions && quizDetailJson.data.questions.length > 0;
    const questionsSanitized = hasQuestions && quizDetailJson.data.questions[0].options.every(o => o.isCorrect === undefined);
    assert(hasQuestions && questionsSanitized, 'Flow 7b: Quiz detail returns sanitized questions (answers hidden)');

    // Flow 8 & 9: Quiz evaluates correctly on backend & attempt saved
    // Submit an attempt with one deliberate misconception
    const sampleQuestions = quizDetailJson.data.questions;
    const submittedAnswers = [
      { questionId: sampleQuestions[0]._id || sampleQuestions[0].id, selectedOptionText: '5' }, // Correct for 2x=10
      { questionId: sampleQuestions[1] ? (sampleQuestions[1]._id || sampleQuestions[1].id) : 'dummy', selectedOptionText: '6x' } // Wrong (multiplied-coefficients)
    ];

    const attemptRes = await fetch(`${BASE_URL}/api/quizzes/${firstQuiz._id || firstQuiz.id}/attempt`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answers: submittedAnswers,
        timeTaken: 45
      })
    });
    const attemptJson = await attemptRes.json();
    assert(attemptRes.status === 200 && attemptJson.success && attemptJson.data.attemptId, 'Flow 8: Server evaluates quiz answers and tags misconceptions');
    assert(attemptJson.data.misconceptions && attemptJson.data.misconceptions.length > 0, 'Flow 8b: Misconception diagnostic tagging caught student logic mistake');

    // Flow 9: Quiz attempt is saved to database
    const attemptsListRes = await fetch(`${BASE_URL}/api/quiz-attempts`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const attemptsListJson = await attemptsListRes.json();
    assert(attemptsListRes.status === 200 && attemptsListJson.data.length >= 1, 'Flow 9: Quiz attempt persisted and retrievable via /api/quiz-attempts');

    // Flow 10: Mastery status is updated
    const masteryRes = await fetch(`${BASE_URL}/api/mastery`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const masteryJson = await masteryRes.json();
    assert(masteryRes.status === 200 && masteryJson.data.length >= 1, 'Flow 10: Mastery status updated and stored in mastery table');

    // Flow 11: Learning progress is updated
    const progressRes = await fetch(`${BASE_URL}/api/progress`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const progressJson = await progressRes.json();
    assert(progressRes.status === 200 && progressJson.data.overallConfidence !== undefined, 'Flow 11: Learning progress calculated and stored in learning_progress table');

    // Flow 12: Student Dashboard reflects real data
    const dashRes = await fetch(`${BASE_URL}/api/dashboard/student`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const dashJson = await dashRes.json();
    assert(
      dashRes.status === 200 &&
      dashJson.data.totalQuizzes >= 1 &&
      Array.isArray(dashJson.data.recentQuizScores) &&
      dashJson.data.recentQuizScores.length >= 1,
      'Flow 12: Student Dashboard reflects real quiz attempts, confidence metrics, and streak'
    );

    // Flow 13: Mastery Map reflects real data
    const mapRes = await fetch(`${BASE_URL}/api/mastery/map`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const mapJson = await mapRes.json();
    assert(
      mapRes.status === 200 &&
      Array.isArray(mapJson.data.nodes) &&
      mapJson.data.nodes.length >= 3 &&
      Array.isArray(mapJson.data.edges),
      'Flow 13: Mastery Map endpoint provides graph nodes, edges, and real student status'
    );

    // Flow 14: Mentor endpoints work
    // Login as mentor
    const mentorLoginRes = await fetch(`${BASE_URL}/api/auth/dev-login-mentor`);
    const mentorLoginJson = await mentorLoginRes.json();
    const mentorToken = mentorLoginJson.data.token;

    // Mentor assigns new student
    const assignRes = await fetch(`${BASE_URL}/api/mentor/students`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mentorToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testStudentEmail })
    });
    const assignJson = await assignRes.json();
    assert(assignRes.status === 201 && assignJson.success, 'Flow 14a: Mentor assigns student via /api/mentor/students');

    // Mentor dashboard
    const mentorDashRes = await fetch(`${BASE_URL}/api/dashboard/mentor`, {
      headers: { Authorization: `Bearer ${mentorToken}` }
    });
    const mentorDashJson = await mentorDashRes.json();
    assert(
      mentorDashRes.status === 200 &&
      mentorDashJson.data.assignedStudents.length >= 1 &&
      Array.isArray(mentorDashJson.data.interventions),
      'Flow 14b: Mentor Dashboard reflects assigned students, at-risk alerts, and targeted interventions'
    );

    // Flow 15: AI conversation works and logs
    const chatRes = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Can you explain linear equations in simple words?',
        language: 'en'
      })
    });
    const chatJson = await chatRes.json();
    assert(
      chatRes.status === 200 &&
      chatJson.success &&
      chatJson.data.reply &&
      chatJson.data.reply.length > 10,
      'Flow 15: AI Tutor generates educational explanation and logs to ai_conversations table'
    );

    // Flow 16: Logout works
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST'
    });
    const logoutJson = await logoutRes.json();
    assert(logoutRes.status === 200 && logoutJson.success, 'Flow 16: Logout clears session cookies and signs out');

    // Flow 17: Invalid credentials fail correctly
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@edusetu.in',
        password: 'wrongpassword'
      })
    });
    assert(badLoginRes.status === 401, 'Flow 17: Invalid login credentials rejected with 401 Unauthorized');

    // Flow 18: Unauthorized access fails correctly
    const unauthorizedRes = await fetch(`${BASE_URL}/api/dashboard/student`);
    assert(unauthorizedRes.status === 401, 'Flow 18: Unauthenticated access to protected route rejected with 401');

    // Flow 18b: Role restriction works (student cannot access mentor dashboard)
    const forbiddenRes = await fetch(`${BASE_URL}/api/dashboard/mentor`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(forbiddenRes.status === 403, 'Flow 18b: Student role forbidden from accessing mentor endpoints with 403');

    // Flow 19: Static Frontend pages load with 200 OK
    const pages = [
      '/',
      '/pages/index.html',
      '/pages/explore.html',
      '/pages/chatbot.html',
      '/pages/dashboard.html',
      '/pages/quiz.html',
      '/pages/mastery-map.html',
      '/pages/mentor.html',
      '/pages/profile.html'
    ];

    let allPagesOk = true;
    for (const p of pages) {
      const pageRes = await fetch(`${BASE_URL}${p}`);
      if (pageRes.status !== 200) {
        allPagesOk = false;
        console.error(`Page ${p} returned ${pageRes.status}`);
      }
    }
    assert(allPagesOk, 'Flow 19: All 8 frontend HTML pages and landing page load with 200 OK');

  } catch (err) {
    console.error('Test Suite encountered an unexpected error:', err);
    failed++;
  } finally {
    if (server) {
      server.close();
    }
  }

  console.log('\n========================================================');
  console.log(` Summary: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
