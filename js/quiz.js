/* ============================================================
   EduSetu — Quiz JavaScript
   Concept selector, quiz engine, misconception tagging, results
   ============================================================ */

(function() {
  'use strict';

  var SUBJECT_ICONS = {
    math: '📐', science: '🔬', english: '📚', socialScience: '🌍', hindi: '📖'
  };

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
  var currentConceptId = null;
  var currentSubject = null;
  var questions = [];
  var currentQ = 0;
  var score = 0;
  var misconceptions = [];
  var answered = false;

  /* ---------- Render Concept Selector ---------- */
  function renderConceptSelector() {
    conceptSelector.replaceChildren();
    var availableConcepts = getAvailableQuizConcepts();

    availableConcepts.forEach(function(conceptId) {
      var subject = findConceptSubject(conceptId);
      if (!subject) return;
      var concepts = getMasteryConcepts(subject);
      var conceptData = concepts.find(function(c) { return c.id === conceptId; });
      if (!conceptData) return;

      var card = document.createElement('div');
      card.className = 'concept-select-card';
      card.setAttribute('data-status', conceptData.status);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Start quiz: ' + conceptData.name);

      var icon = document.createElement('span');
      icon.className = 'concept-icon';
      icon.textContent = SUBJECT_ICONS[subject] || '📝';

      var info = document.createElement('div');
      info.className = 'concept-info';
      var name = document.createElement('span');
      name.className = 'concept-name';
      name.textContent = conceptData.name;
      var subj = document.createElement('span');
      subj.className = 'concept-subject';
      subj.textContent = (SUBJECT_META[subject] ? SUBJECT_META[subject].name : subject);
      info.appendChild(name);
      info.appendChild(subj);

      var badge = document.createElement('span');
      badge.className = 'badge badge-' + conceptData.status;
      badge.textContent = conceptData.status;

      card.appendChild(icon);
      card.appendChild(info);
      card.appendChild(badge);

      card.addEventListener('click', function() {
        startQuiz(conceptId, subject);
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startQuiz(conceptId, subject); }
      });

      conceptSelector.appendChild(card);
    });
  }

  /* ---------- Start Quiz ---------- */
  function startQuiz(conceptId, subject) {
    currentConceptId = conceptId;
    currentSubject = subject;
    questions = getQuizForConcept(conceptId);
    if (!questions || questions.length === 0) return;

    currentQ = 0;
    score = 0;
    misconceptions = [];
    answered = false;

    var conceptName = EduSetu.formatConceptName(conceptId);
    quizTitle.textContent = conceptName + ' Quiz';
    quizSubtitle.textContent = 'Answer 5 questions to test your understanding';

    conceptSelector.style.display = 'none';
    quizArea.style.display = 'block';
    resultsArea.style.display = 'none';

    renderQuestion();
  }

  /* ---------- Render Question ---------- */
  function renderQuestion() {
    answered = false;
    var q = questions[currentQ];

    questionNum.textContent = (currentQ + 1);
    progressFill.style.width = ((currentQ + 1) / questions.length * 100) + '%';
    questionText.textContent = q.question;

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
        handleAnswer(opt, btn);
      });

      optionsContainer.appendChild(btn);
    });
  }

  /* ---------- Handle Answer ---------- */
  function handleAnswer(selectedOpt, selectedBtn) {
    answered = true;
    var q = questions[currentQ];

    // Disable all buttons
    var allBtns = optionsContainer.querySelectorAll('.quiz-option');
    allBtns.forEach(function(b) { b.disabled = true; });

    // Find correct button
    q.options.forEach(function(opt, i) {
      if (opt.correct) {
        allBtns[i].classList.add('correct');
      }
    });

    feedbackArea.replaceChildren();
    feedbackArea.style.display = 'block';

    if (selectedOpt.correct) {
      score++;
      feedbackArea.className = 'quiz-feedback correct-feedback';
      var fb = document.createElement('span');
      fb.textContent = '✅ Correct! Well done!';
      feedbackArea.appendChild(fb);
    } else {
      selectedBtn.classList.add('wrong');
      feedbackArea.className = 'quiz-feedback wrong-feedback';

      if (selectedOpt.misconceptionTag) {
        var tag = document.createElement('span');
        tag.className = 'feedback-tag';
        tag.textContent = selectedOpt.misconceptionTag.replace(/-/g, ' ');
        feedbackArea.appendChild(tag);
        feedbackArea.appendChild(document.createElement('br'));

        misconceptions.push({
          tag: selectedOpt.misconceptionTag,
          explanation: selectedOpt.explanation
        });
      }

      if (selectedOpt.explanation) {
        var exp = document.createElement('span');
        exp.textContent = selectedOpt.explanation;
        feedbackArea.appendChild(exp);
      }
    }

    nextBtn.style.display = 'block';
    nextBtn.textContent = currentQ < questions.length - 1 ? 'Next Question →' : 'See Results →';
  }

  /* ---------- Next / Results ---------- */
  nextBtn.addEventListener('click', function() {
    currentQ++;
    if (currentQ < questions.length) {
      renderQuestion();
    } else {
      showResults();
    }
  });

  /* ---------- Show Results ---------- */
  function showResults() {
    quizArea.style.display = 'none';
    resultsArea.style.display = 'block';
    resultsArea.replaceChildren();

    var scorePercent = Math.round((score / questions.length) * 100);

    // Update mastery
    if (currentSubject && currentConceptId) {
      updateConceptMastery(currentSubject, currentConceptId, scorePercent);
    }

    // Save quiz history
    var history = [];
    var stored = localStorage.getItem('edusetu_quiz_history');
    if (stored) { try { history = JSON.parse(stored); } catch(e) {} }
    history.push({
      concept: EduSetu.formatConceptName(currentConceptId),
      subject: currentSubject,
      score: scorePercent,
      date: new Date().toISOString().split('T')[0],
      misconceptions: misconceptions.map(function(m) { return m.tag; })
    });
    localStorage.setItem('edusetu_quiz_history', JSON.stringify(history));

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

    // Color based on score
    var strokeColor = scorePercent >= 80 ? '#3DA35D' : scorePercent >= 40 ? '#E0A526' : '#EF4444';
    fillCircle.setAttribute('stroke', strokeColor);

    svg.appendChild(bgCircle);
    svg.appendChild(fillCircle);

    var scoreText = document.createElement('div');
    scoreText.className = 'results-score-text';
    var scoreNum = document.createElement('span');
    scoreNum.className = 'results-score-num';
    scoreNum.textContent = score + '/' + questions.length;
    var scoreLbl = document.createElement('span');
    scoreLbl.className = 'results-score-label';
    scoreLbl.textContent = scorePercent + '%';
    scoreText.appendChild(scoreNum);
    scoreText.appendChild(scoreLbl);

    circleDiv.appendChild(svg);
    circleDiv.appendChild(scoreText);
    card.appendChild(circleDiv);

    // Animate circle after render
    setTimeout(function() {
      fillCircle.setAttribute('stroke-dasharray', scorePercent + ', 100');
    }, 100);

    // Status
    var statusDiv = document.createElement('div');
    statusDiv.className = 'results-status';
    var statusBadge = document.createElement('span');
    if (scorePercent >= 80) {
      statusBadge.className = 'badge badge-mastered';
      statusBadge.textContent = '🎉 Mastered!';
    } else if (scorePercent >= 40) {
      statusBadge.className = 'badge badge-shaky';
      statusBadge.textContent = '⚠️ Shaky — needs review';
    } else {
      statusBadge.className = 'badge badge-danger';
      statusBadge.textContent = '📖 Needs more practice';
    }
    statusDiv.appendChild(statusBadge);
    card.appendChild(statusDiv);

    // Misconceptions
    if (misconceptions.length > 0) {
      var miscDiv = document.createElement('div');
      miscDiv.className = 'results-misconceptions';
      var miscTitle = document.createElement('h4');
      miscTitle.textContent = 'Misconceptions Identified';
      miscDiv.appendChild(miscTitle);

      misconceptions.forEach(function(m) {
        var item = document.createElement('div');
        item.className = 'misconception-item';
        var tag = document.createElement('span');
        tag.className = 'misconception-tag';
        tag.textContent = m.tag.replace(/-/g, ' ');
        var text = document.createElement('span');
        text.className = 'misconception-text';
        text.textContent = m.explanation;
        item.appendChild(tag);
        item.appendChild(text);
        miscDiv.appendChild(item);
      });

      card.appendChild(miscDiv);
    }

    // Actions
    var actions = document.createElement('div');
    actions.className = 'results-actions';

    var mapBtn = document.createElement('a');
    mapBtn.className = 'btn btn-primary';
    mapBtn.href = 'mastery-map.html';
    mapBtn.textContent = '🗺️ View Mastery Map';

    var retryBtn = document.createElement('a');
    retryBtn.className = 'btn btn-secondary';
    retryBtn.href = 'quiz.html';
    retryBtn.textContent = '📝 Try Another Quiz';

    var aiBtn = document.createElement('a');
    aiBtn.className = 'btn btn-ghost';
    aiBtn.href = 'chatbot.html?concept=' + encodeURIComponent(currentConceptId);
    aiBtn.textContent = '🤖 Ask AI to Explain';

    actions.appendChild(mapBtn);
    actions.appendChild(retryBtn);
    actions.appendChild(aiBtn);
    card.appendChild(actions);

    resultsArea.appendChild(card);
  }

  /* ---------- Init ---------- */
  function init() {
    var concept = EduSetu.getUrlParam('concept');
    if (concept) {
      var quiz = getQuizForConcept(concept);
      var subject = findConceptSubject(concept);
      if (quiz && subject) {
        startQuiz(concept, subject);
        return;
      }
    }
    renderConceptSelector();
  }

  init();

})();
