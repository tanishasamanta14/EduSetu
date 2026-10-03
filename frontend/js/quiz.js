/* ============================================================
   EduSetu — Quiz JavaScript
   Database-driven diagnostic quiz engine
   ============================================================ */

(function() {
  'use strict';

  /* ---------- DOM Refs ---------- */
  var conceptSelector = document.getElementById('conceptSelector');
  var quizArea = document.getElementById('quizArea');
  var resultsArea = document.getElementById('resultsArea');
  var questionText = document.getElementById('questionText');
  var optionsContainer = document.getElementById('optionsContainer');
  var feedbackArea = document.getElementById('feedbackArea');
  var nextBtn = document.getElementById('nextBtn');
  var progressFill = document.getElementById('progressFill');
  var questionNum = document.getElementById('questionNum');
  var quizTitle = document.getElementById('quizTitle');
  var quizSubtitle = document.getElementById('quizSubtitle');

  /* ---------- State ---------- */
  var currentQuizId = null;
  var questions = [];
  var currentQ = 0;
  var userAnswers = []; // Array of { questionId, selectedOptionText }
  var answered = false;
  var startTime = 0;

  // We will show a toast message for errors
  function showToast(msg, isError) {
    var toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = isError ? '#F87171' : '#34D399';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
  }

  /* ---------- Load Quizzes from API ---------- */
  function loadQuizzes() {
    conceptSelector.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted); width: 100%;">⏳ Loading quizzes from database...</div>';
    
    fetch('/api/quizzes')
      .then(function(res) {
        if (res.status === 401) {
          // Dev fallback: auto-login
          return fetch('/api/auth/dev-login').then(function() { return fetch('/api/quizzes'); });
        }
        return res;
      })
      .then(function(res) { return res.json(); })
      .then(function(result) {
        if (result.success && result.data) {
          renderQuizSelector(result.data);
        } else {
          conceptSelector.innerHTML = '<div style="color: #f87171;">⚠️ ' + (result.message || 'Error loading quizzes') + '</div>';
        }
      })
      .catch(function(err) {
        conceptSelector.innerHTML = '<div style="color: #f87171;">⚠️ Network error loading quizzes.</div>';
      });
  }

  function renderQuizSelector(quizzes) {
    conceptSelector.replaceChildren();

    if (quizzes.length === 0) {
      conceptSelector.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted); width: 100%;">No quizzes available yet. Check back later!</div>';
      return;
    }

    quizzes.forEach(function(quiz) {
      var topic = quiz.topic || { name: 'General', subject: { icon: '📚' } };
      
      var card = document.createElement('div');
      card.className = 'concept-select-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Start quiz: ' + quiz.title);

      var icon = document.createElement('span');
      icon.className = 'concept-icon';
      icon.textContent = (topic.subject && topic.subject.icon) ? topic.subject.icon : '📝';

      var info = document.createElement('div');
      info.className = 'concept-info';
      var name = document.createElement('span');
      name.className = 'concept-name';
      name.textContent = quiz.title;
      var subj = document.createElement('span');
      subj.className = 'concept-subject';
      subj.textContent = topic.name;
      info.appendChild(name);
      info.appendChild(subj);

      var badge = document.createElement('span');
      badge.className = 'badge badge-recommended';
      badge.textContent = 'Take Quiz';

      card.appendChild(icon);
      card.appendChild(info);
      card.appendChild(badge);

      card.addEventListener('click', function() {
        startQuiz(quiz._id);
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startQuiz(quiz._id); }
      });

      conceptSelector.appendChild(card);
    });
  }

  /* ---------- Start Quiz ---------- */
  function startQuiz(quizId) {
    // Fetch specific quiz with questions
    conceptSelector.style.opacity = '0.5';
    conceptSelector.style.pointerEvents = 'none';

    fetch('/api/quizzes/' + quizId)
      .then(function(res) { return res.json(); })
      .then(function(result) {
        if (result.success && result.data) {
          currentQuizId = quizId;
          questions = result.data.questions;
          
          if (!questions || questions.length === 0) {
            showToast('This quiz has no questions yet.', true);
            conceptSelector.style.opacity = '1';
            conceptSelector.style.pointerEvents = 'all';
            return;
          }

          currentQ = 0;
          userAnswers = [];
          answered = false;
          startTime = Date.now();

          quizTitle.textContent = result.data.title;
          quizSubtitle.textContent = 'Answer ' + questions.length + ' questions to test your understanding';

          conceptSelector.style.display = 'none';
          conceptSelector.style.opacity = '1';
          conceptSelector.style.pointerEvents = 'all';
          
          quizArea.style.display = 'block';
          resultsArea.style.display = 'none';

          renderQuestion();
        } else {
          showToast(result.message || 'Error loading quiz', true);
        }
      })
      .catch(function(err) {
        showToast('Network error starting quiz', true);
        conceptSelector.style.opacity = '1';
        conceptSelector.style.pointerEvents = 'all';
      });
  }

  /* ---------- Render Question ---------- */
  function renderQuestion() {
    answered = false;
    var q = questions[currentQ];

    questionNum.textContent = (currentQ + 1);
    progressFill.style.width = ((currentQ + 1) / questions.length * 100) + '%';
    questionText.textContent = q.text;

    optionsContainer.replaceChildren();
    feedbackArea.style.display = 'none';
    nextBtn.style.display = 'none';

    var letters = ['A', 'B', 'C', 'D'];
    q.options.forEach(function(opt, i) {
      var btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.setAttribute('aria-label', 'Option ' + letters[i] + ': ' + opt.text);

      var letter = document.createElement('span');
      letter.className = 'option-letter';
      letter.textContent = letters[i];

      var text = document.createElement('span');
      text.textContent = opt.text;

      btn.appendChild(letter);
      btn.appendChild(text);

      btn.addEventListener('click', function() {
        if (answered) return;
        handleAnswer(opt, btn, q._id);
      });

      optionsContainer.appendChild(btn);
    });
  }

  /* ---------- Handle Answer ---------- */
  function handleAnswer(selectedOpt, selectedBtn, questionId) {
    answered = true;

    // Highlight selected option visually
    var allBtns = optionsContainer.querySelectorAll('.quiz-option');
    allBtns.forEach(function(b) { b.disabled = true; });
    
    // Using a subtle active style since we don't know correct/wrong yet
    selectedBtn.style.background = 'var(--primary-color)';
    selectedBtn.style.color = '#fff';
    selectedBtn.style.borderColor = 'var(--primary-color)';

    // Store user's answer
    userAnswers.push({
      questionId: questionId,
      selectedOptionText: selectedOpt.text
    });

    nextBtn.style.display = 'block';
    nextBtn.textContent = currentQ < questions.length - 1 ? 'Next Question →' : 'Submit Quiz →';
  }

  /* ---------- Next / Submit ---------- */
  nextBtn.addEventListener('click', function() {
    currentQ++;
    if (currentQ < questions.length) {
      renderQuestion();
    } else {
      submitQuiz();
    }
  });

  /* ---------- Submit Quiz to Backend ---------- */
  function submitQuiz() {
    nextBtn.disabled = true;
    nextBtn.textContent = 'Submitting...';

    var timeTaken = Math.floor((Date.now() - startTime) / 1000);

    fetch('/api/quizzes/' + currentQuizId + '/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: userAnswers, timeTaken: timeTaken })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
      nextBtn.disabled = false;
      if (result.success) {
        showResults(result.data);
      } else {
        showToast(result.message || 'Error submitting quiz', true);
        nextBtn.textContent = 'Retry Submission';
      }
    })
    .catch(function(err) {
      nextBtn.disabled = false;
      showToast('Network error submitting quiz', true);
      nextBtn.textContent = 'Retry Submission';
    });
  }

  /* ---------- Show Results ---------- */
  function showResults(data) {
    quizArea.style.display = 'none';
    resultsArea.style.display = 'block';
    resultsArea.replaceChildren();

    var scorePercent = data.percentage;

    // Build results card
    var card = document.createElement('div');
    card.className = 'results-card';

    // Score circle
    var circleDiv = document.createElement('div');
    circleDiv.className = 'results-score-circle';

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 36 36');

    var bgCircle = document.createElementNS(svgNS, 'path');
    bgCircle.setAttribute('class', 'score-bg');
    bgCircle.setAttribute('d', 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831');

    var fillCircle = document.createElementNS(svgNS, 'path');
    fillCircle.setAttribute('class', 'score-fill');
    fillCircle.setAttribute('d', 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831');
    fillCircle.setAttribute('stroke-dasharray', '0, 100');

    var strokeColor = scorePercent >= 80 ? '#3DA35D' : scorePercent >= 50 ? '#E0A526' : '#EF4444';
    
    // Animate stroke
    setTimeout(function() {
      fillCircle.style.transition = 'stroke-dasharray 1s ease-out';
      fillCircle.setAttribute('stroke-dasharray', scorePercent + ', 100');
      fillCircle.setAttribute('stroke', strokeColor);
    }, 100);

    svg.appendChild(bgCircle);
    svg.appendChild(fillCircle);

    var textDiv = document.createElement('div');
    textDiv.className = 'score-text';
    textDiv.innerHTML = scorePercent + '<span>%</span>';

    circleDiv.appendChild(svg);
    circleDiv.appendChild(textDiv);
    card.appendChild(circleDiv);

    // Title & Subtitle
    var h3 = document.createElement('h3');
    h3.textContent = data.passed ? 'Excellent Work!' : 'Keep Practicing!';
    var p = document.createElement('p');
    p.textContent = 'You got ' + data.score + ' out of ' + data.totalQuestions + ' correct.';
    
    // Status Badge
    var badge = document.createElement('span');
    badge.className = 'badge badge-' + data.newMasteryStatus;
    badge.style.marginTop = '10px';
    badge.style.display = 'inline-block';
    badge.textContent = 'Mastery Updated: ' + data.newMasteryStatus.toUpperCase();

    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(badge);

    resultsArea.appendChild(card);

    // Misconceptions
    if (data.misconceptions && data.misconceptions.length > 0) {
      var mCard = document.createElement('div');
      mCard.className = 'misconception-card';
      var mTitle = document.createElement('h4');
      mTitle.textContent = '🧠 Identified Knowledge Gaps';
      mCard.appendChild(mTitle);

      var ul = document.createElement('ul');
      ul.className = 'misconception-list';
      data.misconceptions.forEach(function(m) {
        var li = document.createElement('li');
        var tag = document.createElement('span');
        tag.className = 'feedback-tag';
        tag.textContent = m.tag ? m.tag.replace(/-/g, ' ') : 'Concept Error';
        var exp = document.createElement('p');
        exp.textContent = m.explanation;
        li.appendChild(tag);
        li.appendChild(exp);
        ul.appendChild(li);
      });
      mCard.appendChild(ul);
      resultsArea.appendChild(mCard);
    } else if (data.passed) {
      var perfectCard = document.createElement('div');
      perfectCard.className = 'misconception-card';
      perfectCard.style.textAlign = 'center';
      perfectCard.innerHTML = '<h4>🎯 Perfect Understanding</h4><p>No knowledge gaps detected. You have mastered this topic!</p>';
      resultsArea.appendChild(perfectCard);
    }

    // Actions
    var actionDiv = document.createElement('div');
    actionDiv.style.marginTop = 'var(--space-6)';
    actionDiv.style.display = 'flex';
    actionDiv.style.gap = 'var(--space-4)';
    actionDiv.style.justifyContent = 'center';
    
    var retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-secondary';
    retryBtn.textContent = '↻ Retake Quiz';
    retryBtn.addEventListener('click', function() {
      startQuiz(currentQuizId);
    });

    var homeBtn = document.createElement('button');
    homeBtn.className = 'btn btn-primary';
    homeBtn.textContent = 'Back to Quizzes';
    homeBtn.addEventListener('click', function() {
      loadQuizzes();
      resultsArea.style.display = 'none';
      conceptSelector.style.display = 'grid';
    });

    actionDiv.appendChild(retryBtn);
    actionDiv.appendChild(homeBtn);
    resultsArea.appendChild(actionDiv);
  }

  /* ---------- Init ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadQuizzes);
  } else {
    loadQuizzes();
  }

})();
