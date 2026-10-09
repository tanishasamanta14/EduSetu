/* ============================================================
   EduSetu — Explore Subjects JavaScript
   Screen 7: Level filter tabs, 6 subject cards, and real Supabase topics
   ============================================================ */

(function() {
  'use strict';

  var currentLevel = 'all';
  var selectedSubject = null;
  var currentQuery = '';

  var levelTabs = document.querySelectorAll('.level-tab-btn');
  var subjectCards = document.querySelectorAll('.subject-card-box');
  var resultsGrid = document.getElementById('topicsResultsGrid');
  var filterHeading = document.getElementById('topicsFilterHeading');
  var countBadge = document.getElementById('topicCountBadge');
  var searchInput = document.getElementById('topbarSearchInput');

  function init() {
    // Check URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    var qParam = urlParams.get('q');
    var subParam = urlParams.get('subject');

    if (qParam && searchInput) {
      searchInput.value = qParam;
      currentQuery = qParam;
    }
    if (subParam) {
      selectedSubject = subParam;
      highlightSubjectCard(subParam);
    }

    setupLevelTabs();
    setupSubjectCards();
    setupSearch();
    fetchTopics();
  }

  /* 1. Level Tabs Filter */
  function setupLevelTabs() {
    levelTabs.forEach(function(btn) {
      btn.addEventListener('click', function() {
        levelTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLevel = btn.getAttribute('data-level');
        fetchTopics();
      });
    });
  }

  /* 2. Subject Cards Filter */
  function setupSubjectCards() {
    subjectCards.forEach(function(card) {
      card.addEventListener('click', function() {
        var sub = card.getAttribute('data-subject');
        if (selectedSubject === sub) {
          // Toggle off
          selectedSubject = null;
          card.classList.remove('active-subject');
        } else {
          selectedSubject = sub;
          highlightSubjectCard(sub);
        }
        fetchTopics();
      });
    });
  }

  function highlightSubjectCard(sub) {
    subjectCards.forEach(function(card) {
      if (card.getAttribute('data-subject') === sub) {
        card.classList.add('active-subject');
      } else {
        card.classList.remove('active-subject');
      }
    });
  }

  /* 3. Search handling */
  function setupSearch() {
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        currentQuery = searchInput.value.trim();
        fetchTopics();
      });
    }
  }

  /* 4. Fetch topics from backend API */
  function fetchTopics() {
    if (!resultsGrid) return;
    resultsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">⏳ Loading topics from database...</div>';

    var url = new URL(window.location.origin + '/api/topics');
    if (currentQuery && currentQuery.length >= 2) url.searchParams.append('q', currentQuery);
    if (selectedSubject) url.searchParams.append('subject', selectedSubject);

    // Map level to grade level filter
    if (currentLevel === 'school') url.searchParams.append('level', 'primary');
    else if (currentLevel === 'secondary') url.searchParams.append('level', 'secondary');
    else if (currentLevel === 'higher') url.searchParams.append('level', 'higher');
    else if (currentLevel === 'college') url.searchParams.append('level', 'graduation');

    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(result) {
        if (result.success && result.data) {
          renderTopics(result.data);
        } else {
          showFallbackTopics();
        }
      })
      .catch(function(err) {
        showFallbackTopics();
      });
  }

  function renderTopics(topics) {
    resultsGrid.replaceChildren();

    if (filterHeading) {
      if (selectedSubject) {
        filterHeading.textContent = selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1) + ' Topics';
      } else if (currentQuery) {
        filterHeading.textContent = `Search Results for "${currentQuery}"`;
      } else {
        filterHeading.textContent = 'All Available Topics';
      }
    }

    if (countBadge) countBadge.textContent = `${topics.length} topics found`;

    if (topics.length === 0) {
      resultsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No matching topics found. Try selecting another level or subject above.</div>';
      return;
    }

    topics.forEach(function(topic) {
      var card = document.createElement('div');
      card.className = 'topic-result-card';

      var subjName = (topic.subject && topic.subject.name) ? topic.subject.name : (topic.subject_id || 'General');
      var gradeBadge = topic.gradeLevel ? `Class ${topic.gradeLevel}` : 'All Grades';
      var desc = topic.description || `Master core concepts and foundational problem solving in ${topic.name}.`;

      card.innerHTML = `
        <div>
          <div class="topic-card-header">
            <h4 class="topic-card-title">${topic.name}</h4>
            <span class="topic-card-grade">${gradeBadge}</span>
          </div>
          <p class="topic-card-desc">${desc}</p>
        </div>
        <div class="topic-card-actions">
          <a href="chatbot.html?q=Explain%20${encodeURIComponent(topic.name)}" class="btn-topic-action ai">Ask AI Tutor 🤖</a>
          <a href="quiz.html?topic=${encodeURIComponent(topic.slug || topic.name.toLowerCase().replace(/ /g, '-'))}" class="btn-topic-action quiz">Practice Quiz 📝</a>
        </div>
      `;

      resultsGrid.appendChild(card);
    });
  }

  function showFallbackTopics() {
    var sampleTopics = [
      { name: 'Linear Equations in One Variable', gradeLevel: 8, subject: { name: 'Mathematics' }, description: 'Solve standard one-variable linear equations step-by-step.' },
      { name: 'Photosynthesis & Plant Respiration', gradeLevel: 7, subject: { name: 'Science' }, description: 'Understand chlorophyll, sunlight absorption, and gas exchange.' },
      { name: 'Quadratic Equations & Roots', gradeLevel: 10, subject: { name: 'Mathematics' }, description: 'Factoring, quadratic formula, and discriminant analysis.' },
      { name: 'Newton\'s Laws of Motion', gradeLevel: 9, subject: { name: 'Science' }, description: 'Inertia, F=ma, and action-reaction pairs in everyday physics.' },
      { name: 'Active & Passive Voice Rules', gradeLevel: 8, subject: { name: 'English' }, description: 'Converting tense structures between active and passive constructions.' },
      { name: 'Indian Constitution & Fundamental Rights', gradeLevel: 9, subject: { name: 'Social Science' }, description: 'Key articles, rights, duties, and democratic framework.' }
    ];
    renderTopics(sampleTopics);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
