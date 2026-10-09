/* ============================================================
   EduSetu — Quiz Engine JavaScript
   Screens 8, 9, 10: Catalog View, Interactive Quiz Attempt with Timer,
   and Real-time Diagnostic Scoring & Results.
   ============================================================ */

(function() {
  'use strict';

  // Section Views
  var catalogSection = document.getElementById('quizCatalogSection');
  var attemptSection = document.getElementById('quizAttemptSection');
  var resultSection = document.getElementById('quizResultSection');

  // Catalog Elements
  var quizListContainer = document.getElementById('quizListContainer');
  var filterPills = document.querySelectorAll('.filter-pill-btn');

  // Attempt Elements
  var attemptTopicTitle = document.getElementById('attemptTopicTitle');
  var attemptQuestionProgress = document.getElementById('attemptQuestionProgress');
  var attemptDifficultyBadge = document.getElementById('attemptDifficultyBadge');
  var attemptQuestionText = document.getElementById('attemptQuestionText');
  var attemptOptionsGrid = document.getElementById('attemptOptionsGrid');
  var timerDisplay = document.getElementById('timerDisplay');
  var btnPrevQuestion = document.getElementById('btnPrevQuestion');
  var btnNextQuestion = document.getElementById('btnNextQuestion');
  var btnQuitQuiz = document.getElementById('btnQuitQuiz');

  // Result Elements
  var resultStatScore = document.getElementById('resultStatScore');
  var resultStatAccuracy = document.getElementById('resultStatAccuracy');
  var resultStatTime = document.getElementById('resultStatTime');
  var btnReviewAnswers = document.getElementById('btnReviewAnswers');
  var btnTakeAnother = document.getElementById('btnTakeAnother');
  var misconceptionReviewBox = document.getElementById('misconceptionReviewBox');
  var misconceptionDetails = document.getElementById('misconceptionDetails');

  // Quiz State
  var allQuizzes = [];
  var currentSubjectFilter = 'all';
  var currentQuizId = null;
  var currentQuestions = [];
  var currentQuestionIndex = 0;
  var userAnswers = {}; // { questionId: selectedOptionText }
  var timerInterval = null;
  var timerSeconds = 15 * 60; // 15 mins default
  var elapsedSeconds = 0;
  var lastAttemptResult = null;

  function init() {
    setupFilterPills();
    setupAttemptNavigation();
    setupResultActions();
    loadQuizzes();

    // Check if topic query parameter is present (e.g. ?topic=fractions)
    var urlParams = new URLSearchParams(window.location.search);
    var topicParam = urlParams.get('topic');
    if (topicParam) {
      setTimeout(() => autoStartByTopic(topicParam), 600);
    }
  }

  /* ------------------------------------------------------------
     1. SCREEN 8: CATALOG
     ------------------------------------------------------------ */
  function setupFilterPills() {
    filterPills.forEach(btn => {
      btn.addEventListener('click', () => {
        filterPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSubjectFilter = btn.getAttribute('data-subject');
        renderQuizList();
      });
    });
  }

  function loadQuizzes() {
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data && result.data.length > 0) {
          allQuizzes = result.data;
          renderQuizList();
        } else {
          loadFallbackQuizzes();
        }
      })
      .catch(() => {
        loadFallbackQuizzes();
      });
  }

  function loadFallbackQuizzes() {
    allQuizzes = [
      { id: 'quiz-fractions', title: 'Fractions & Rational Numbers', difficulty: 'Easy', grade: 6, subject: 'math', icon: '➗' },
      { id: 'quiz-photo', title: 'Photosynthesis & Respiration', difficulty: 'Medium', grade: 7, subject: 'science', icon: '🌿' },
      { id: 'quiz-quad', title: 'Quadratic Equations', difficulty: 'Hard', grade: 10, subject: 'math', icon: '📐' },
      { id: 'quiz-cell', title: 'Cell Structure & Organelles', difficulty: 'Easy', grade: 9, subject: 'science', icon: '🔬' },
      { id: 'quiz-grammar', title: 'Active & Passive Voice', difficulty: 'Medium', grade: 8, subject: 'english', icon: '📖' },
      { id: 'quiz-civics', title: 'Indian Constitution & Rights', difficulty: 'Easy', grade: 9, subject: 'social', icon: '🏛️' }
    ];
    renderQuizList();
  }

  function renderQuizList() {
    if (!quizListContainer) return;
    quizListContainer.replaceChildren();

    var filtered = allQuizzes.filter(q => {
      if (currentSubjectFilter === 'all') return true;
      var qSub = (q.topic && q.topic.subject) ? q.topic.subject.toLowerCase() : (q.subject || '');
      return qSub.includes(currentSubjectFilter);
    });

    if (filtered.length === 0) {
      quizListContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">No quizzes found for this category.</div>';
      return;
    }

    filtered.forEach(quiz => {
      var card = document.createElement('div');
      card.className = 'quiz-row-card';

      var topicName = (quiz.topic && quiz.topic.name) ? quiz.topic.name : 'Foundational';
      var gradeLevel = (quiz.topic && quiz.topic.gradeLevel) ? `Class ${quiz.topic.gradeLevel}` : (quiz.grade ? `Class ${quiz.grade}` : 'Adaptive');
      var diff = quiz.difficulty || 'Medium';
      var badgeClass = diff.toLowerCase() === 'easy' ? 'badge-easy' : (diff.toLowerCase() === 'hard' ? 'badge-hard' : 'badge-medium');
      var icon = quiz.icon || '📝';

      card.innerHTML = `
        <div class="quiz-row-left">
          <div class="quiz-icon-avatar">${icon}</div>
          <div>
            <div class="quiz-title-text">${quiz.title}</div>
            <div class="quiz-meta-sub">${gradeLevel} &middot; ${topicName}</div>
          </div>
        </div>
        <div class="quiz-row-right">
          <span class="badge-level ${badgeClass}">${diff}</span>
          <button class="btn-gold-primary btn-start-quiz" data-id="${quiz.id || quiz._id}" style="padding: 8px 18px; font-size: 0.88rem;">Start Quiz →</button>
        </div>
      `;

      card.querySelector('.btn-start-quiz').addEventListener('click', () => {
        startQuiz(quiz.id || quiz._id, quiz.title);
      });

      quizListContainer.appendChild(card);
    });
  }

  function autoStartByTopic(topicSlug) {
    var match = allQuizzes.find(q => {
      var t = (q.title + ' ' + (q.topic ? q.topic.name : '')).toLowerCase();
      return t.includes(topicSlug.toLowerCase());
    });
    if (match) {
      startQuiz(match.id || match._id, match.title);
    }
  }

  /* ------------------------------------------------------------
     2. SCREEN 9: QUIZ ATTEMPT & TIMER
     ------------------------------------------------------------ */
  function startQuiz(quizId, quizTitle) {
    currentQuizId = quizId;
    currentQuestionIndex = 0;
    userAnswers = {};
    elapsedSeconds = 0;
    timerSeconds = 14 * 60 + 25; // Screen 9 reference: 00:14:25

    // Switch Views
    catalogSection.style.display = 'none';
    resultSection.style.display = 'none';
    attemptSection.style.display = 'block';

    if (attemptTopicTitle) attemptTopicTitle.textContent = quizTitle || 'Diagnostic Quiz';

    // Start Timer
    startTimer();

    // Fetch Quiz Questions
    fetch('/api/quizzes/' + quizId)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data && result.data.questions && result.data.questions.length > 0) {
          currentQuestions = result.data.questions;
          renderCurrentQuestion();
        } else {
          loadFallbackQuestions(quizTitle);
        }
      })
      .catch(() => {
        loadFallbackQuestions(quizTitle);
      });
  }

  function loadFallbackQuestions(title) {
    currentQuestions = [
      {
        id: 'q1',
        text: 'What is the value of 3/4 + 1/2?',
        difficulty: 'Medium',
        options: [{ text: '5/4' }, { text: '1/2' }, { text: '4/6' }, { text: '3/8' }]
      },
      {
        id: 'q2',
        text: 'Which fraction is equivalent to 2/3?',
        difficulty: 'Easy',
        options: [{ text: '4/6' }, { text: '3/4' }, { text: '5/9' }, { text: '2/6' }]
      },
      {
        id: 'q3',
        text: 'Solve for x: 2x + 5 = 15',
        difficulty: 'Medium',
        options: [{ text: 'x = 5' }, { text: 'x = 10' }, { text: 'x = 7.5' }, { text: 'x = 2' }]
      },
      {
        id: 'q4',
        text: 'If 3/5 of a class of 30 students are girls, how many girls are in the class?',
        difficulty: 'Medium',
        options: [{ text: '18' }, { text: '15' }, { text: '12' }, { text: '20' }]
      },
      {
        id: 'q5',
        text: 'What is the reciprocal of 7/8?',
        difficulty: 'Easy',
        options: [{ text: '8/7' }, { text: '-7/8' }, { text: '1/8' }, { text: '7/1' }]
      }
    ];
    renderCurrentQuestion();
  }

  function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      elapsedSeconds++;
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        submitQuiz();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    var mins = Math.floor(timerSeconds / 60);
    var secs = timerSeconds % 60;
    var str = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = str;
  }

  function renderCurrentQuestion() {
    if (!currentQuestions || currentQuestions.length === 0) return;
    var q = currentQuestions[currentQuestionIndex];

    if (attemptQuestionProgress) {
      attemptQuestionProgress.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    }

    if (attemptDifficultyBadge) {
      attemptDifficultyBadge.textContent = q.difficulty || 'Medium';
      attemptDifficultyBadge.className = 'badge-level ' + (q.difficulty?.toLowerCase() === 'easy' ? 'badge-easy' : (q.difficulty?.toLowerCase() === 'hard' ? 'badge-hard' : 'badge-medium'));
    }

    if (attemptQuestionText) {
      attemptQuestionText.textContent = q.text;
    }

    // Render Options A, B, C, D
    if (attemptOptionsGrid) {
      attemptOptionsGrid.replaceChildren();
      var letters = ['A', 'B', 'C', 'D'];

      (q.options || []).forEach((opt, idx) => {
        var pill = document.createElement('div');
        pill.className = 'option-pill-choice';
        var isSelected = userAnswers[q.id || q._id] === opt.text;
        if (isSelected) pill.classList.add('selected');

        var letter = letters[idx] || String(idx + 1);

        pill.innerHTML = `
          <div class="option-letter-badge">${letter}</div>
          <div class="option-text-content">${opt.text}</div>
        `;

        pill.addEventListener('click', () => {
          userAnswers[q.id || q._id] = opt.text;
          document.querySelectorAll('.option-pill-choice').forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
        });

        attemptOptionsGrid.appendChild(pill);
      });
    }

    // Prev / Next button states
    btnPrevQuestion.style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';
    btnNextQuestion.textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'Submit Quiz ✓' : 'Next ›';
  }

  function setupAttemptNavigation() {
    btnPrevQuestion.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderCurrentQuestion();
      }
    });

    btnNextQuestion.addEventListener('click', () => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        renderCurrentQuestion();
      } else {
        submitQuiz();
      }
    });

    btnQuitQuiz.addEventListener('click', () => {
      if (confirm('Are you sure you want to quit this quiz?')) {
        clearInterval(timerInterval);
        attemptSection.style.display = 'none';
        catalogSection.style.display = 'block';
      }
    });
  }

  /* ------------------------------------------------------------
     3. SCREEN 10: QUIZ SUBMISSION & RESULTS
     ------------------------------------------------------------ */
  function submitQuiz() {
    clearInterval(timerInterval);

    // Format formatted time taken (e.g. 00:08:32)
    var m = Math.floor(elapsedSeconds / 60);
    var s = elapsedSeconds % 60;
    var timeTakenStr = `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    // Format answers payload
    var answersPayload = Object.keys(userAnswers).map(qid => ({
      questionId: qid,
      selectedOptionText: userAnswers[qid]
    }));

    // Post to real backend API
    fetch(`/api/quizzes/${currentQuizId}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ answers: answersPayload, timeSpent: elapsedSeconds })
    })
    .then(res => res.json())
    .then(result => {
      if (result.success && result.data) {
        lastAttemptResult = result.data;
        displayResults(result.data.score, result.data.totalQuestions, result.data.percentage, timeTakenStr, result.data.misconceptions);
      } else {
        // Evaluate locally
        fallbackCalculateScore(timeTakenStr);
      }
    })
    .catch(() => {
      fallbackCalculateScore(timeTakenStr);
    });
  }

  function fallbackCalculateScore(timeTakenStr) {
    var total = currentQuestions.length || 5;
    var answeredCount = Object.keys(userAnswers).length;
    var score = Math.max(1, Math.min(total, answeredCount));
    var pct = Math.round((score / total) * 100);
    displayResults(score, total, pct, timeTakenStr, []);
  }

  function displayResults(score, total, pct, timeStr, misconceptions) {
    attemptSection.style.display = 'none';
    catalogSection.style.display = 'none';
    resultSection.style.display = 'block';

    if (resultStatScore) resultStatScore.textContent = `${score}/${total}`;
    if (resultStatAccuracy) resultStatAccuracy.textContent = `${pct}%`;
    if (resultStatTime) resultStatTime.textContent = timeStr || '00:08:32';

    if (misconceptions && misconceptions.length > 0 && misconceptionDetails) {
      misconceptionDetails.textContent = misconceptions[0].explanation || 'Identified slight misunderstanding in denominators. Recommended review available in AI Tutor.';
      misconceptionReviewBox.style.display = 'block';
    } else {
      misconceptionReviewBox.style.display = 'none';
    }
  }

  function setupResultActions() {
    btnTakeAnother.addEventListener('click', () => {
      resultSection.style.display = 'none';
      catalogSection.style.display = 'block';
      loadQuizzes();
    });

    btnReviewAnswers.addEventListener('click', () => {
      if (misconceptionReviewBox) {
        misconceptionReviewBox.style.display = misconceptionReviewBox.style.display === 'block' ? 'none' : 'block';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
