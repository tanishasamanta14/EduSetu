(function() {
  'use strict';

  var LEVEL_LABELS = {
    primary: 'Primary (1-5)',
    middle: 'Middle (6-8)',
    secondary: 'Secondary (9-10)',
    higher: 'Higher Sec (11-12)',
    graduation: 'Graduation'
  };

  var LEVEL_COLORS = {
    primary: 'rgba(52,211,153,0.15)',
    middle: 'rgba(96,165,250,0.15)',
    secondary: 'rgba(251,191,36,0.15)',
    higher: 'rgba(167,139,250,0.15)',
    graduation: 'rgba(248,113,113,0.15)'
  };

  function getLevelFromGrade(grade) {
    if (grade <= 5) return 'primary';
    if (grade <= 8) return 'middle';
    if (grade <= 10) return 'secondary';
    if (grade <= 12) return 'higher';
    return 'graduation';
  }

  var currentLevel = 'all';
  var searchInput = document.getElementById('searchInput');
  var searchClear = document.getElementById('searchClear');
  var resultsContainer = document.getElementById('searchResults');
  var noResults = document.getElementById('noResults');
  var levelFilters = document.getElementById('levelFilters');
  var subjectFilter = document.getElementById('subjectFilter');
  var difficultyFilter = document.getElementById('difficultyFilter');

  /* ---------- Fetch Subjects ---------- */
  function loadSubjects() {
    fetch('/api/subjects')
      .then(function(res) { return res.json(); })
      .then(function(result) {
        if (result.success && result.data) {
          result.data.forEach(function(sub) {
            var option = document.createElement('option');
            option.value = sub.slug;
            option.textContent = sub.icon + ' ' + sub.name;
            subjectFilter.appendChild(option);
          });
        }
      })
      .catch(function(err) {
        console.error('Failed to load subjects:', err);
      });
  }

  /* ---------- Fetch Topics (Search) ---------- */
  function fetchTopics() {
    var query = searchInput.value.trim();
    var subject = subjectFilter.value;
    var difficulty = difficultyFilter.value;

    // Show loading state
    resultsContainer.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted);">⏳ Loading topics from database...</div>';
    noResults.style.display = 'none';

    var url = new URL(window.location.origin + '/api/topics');
    if (query.length >= 2) url.searchParams.append('q', query);
    if (currentLevel !== 'all') url.searchParams.append('level', currentLevel);
    if (subject) url.searchParams.append('subject', subject);
    if (difficulty) url.searchParams.append('difficulty', difficulty);

    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(result) {
        if (result.success) {
          renderResults(result.data, query);
        } else {
          showError(result.message || 'Error loading topics');
        }
      })
      .catch(function(err) {
        showError('Network error. Failed to connect to server.');
      });
  }

  function showError(msg) {
    resultsContainer.innerHTML = '<div style="text-align:center; padding: 40px; color: #f87171;">⚠️ ' + msg + '</div>';
    noResults.style.display = 'none';
  }

  /* ---------- Render Topic Card ---------- */
  function createTopicCard(topic) {
    var card = document.createElement('div');
    card.className = 'topic-card';

    var levelKey = getLevelFromGrade(topic.gradeLevel);
    var icon = (topic.subject && topic.subject.icon) ? topic.subject.icon : '📚';
    var subjectName = (topic.subject && topic.subject.name) ? topic.subject.name : 'General';

    // Header
    var header = document.createElement('div');
    header.className = 'topic-card-header';

    var iconDiv = document.createElement('div');
    iconDiv.className = 'topic-card-icon';
    iconDiv.style.background = LEVEL_COLORS[levelKey] || 'rgba(255,255,255,0.06)';
    iconDiv.textContent = icon;

    var info = document.createElement('div');
    var titleEl = document.createElement('div');
    titleEl.className = 'topic-card-title';
    titleEl.textContent = topic.name;

    var meta = document.createElement('div');
    meta.className = 'topic-card-meta';
    
    var levelBadge = document.createElement('span');
    levelBadge.className = 'topic-badge topic-badge-level';
    levelBadge.textContent = LEVEL_LABELS[levelKey] || 'Grade ' + topic.gradeLevel;
    
    var subjBadge = document.createElement('span');
    subjBadge.className = 'topic-badge topic-badge-subject';
    subjBadge.textContent = subjectName;
    
    meta.appendChild(levelBadge);
    meta.appendChild(subjBadge);
    
    if (topic.difficulty) {
      var diffBadge = document.createElement('span');
      diffBadge.className = 'topic-badge';
      diffBadge.style.opacity = '0.8';
      diffBadge.textContent = topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1);
      meta.appendChild(diffBadge);
    }

    info.appendChild(titleEl);
    info.appendChild(meta);
    header.appendChild(iconDiv);
    header.appendChild(info);
    card.appendChild(header);

    // Description
    if (topic.description) {
      var desc = document.createElement('p');
      desc.className = 'topic-card-desc';
      desc.textContent = topic.description;
      card.appendChild(desc);
    }

    // Key Points
    if (topic.keyPoints && topic.keyPoints.length > 0) {
      var ul = document.createElement('ul');
      ul.className = 'topic-card-points';
      topic.keyPoints.forEach(function(point) {
        var li = document.createElement('li');
        li.textContent = point;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    // Prerequisites (formerly Related)
    if (topic.prerequisites && topic.prerequisites.length > 0) {
      var relDiv = document.createElement('div');
      relDiv.className = 'topic-card-related';
      var relTitle = document.createElement('span');
      relTitle.style.fontSize = '0.8rem';
      relTitle.style.color = 'var(--text-muted)';
      relTitle.textContent = 'Prerequisites: ';
      relDiv.appendChild(relTitle);
      
      topic.prerequisites.forEach(function(prereq) {
        var chip = document.createElement('button');
        chip.className = 'related-chip';
        chip.textContent = prereq.name;
        chip.addEventListener('click', function() {
          searchInput.value = prereq.name;
          searchClear.style.display = 'flex';
          fetchTopics();
        });
        relDiv.appendChild(chip);
      });
      card.appendChild(relDiv);
    }

    // Actions
    var actions = document.createElement('div');
    actions.className = 'topic-card-actions';
    var learnBtn = document.createElement('a');
    learnBtn.className = 'btn btn-primary btn-sm';
    learnBtn.href = 'chatbot.html?topic=' + encodeURIComponent(topic.name);
    learnBtn.textContent = '🤖 Learn with AI';
    var quizBtn = document.createElement('a');
    quizBtn.className = 'btn btn-secondary btn-sm';
    quizBtn.href = 'quiz.html?topicId=' + topic._id;
    quizBtn.textContent = '📝 Practice Quiz';
    actions.appendChild(learnBtn);
    actions.appendChild(quizBtn);
    card.appendChild(actions);

    return card;
  }

  function renderResults(topics, query) {
    resultsContainer.replaceChildren();

    if (!topics || topics.length === 0) {
      noResults.style.display = 'block';
      return;
    }

    noResults.style.display = 'none';

    // Results count
    if (query && query.length >= 2) {
      var countDiv = document.createElement('div');
      countDiv.className = 'results-count';
      var strong = document.createElement('strong');
      strong.textContent = topics.length;
      countDiv.appendChild(strong);
      var text = document.createTextNode(' topic' + (topics.length !== 1 ? 's' : '') + ' found in database');
      countDiv.appendChild(text);
      resultsContainer.appendChild(countDiv);
    } else {
      var headerDiv = document.createElement('div');
      headerDiv.className = 'popular-header';
      headerDiv.textContent = currentLevel === 'all' ? '✨ Popular Topics Across All Levels' : '✨ Topics in ' + LEVEL_LABELS[currentLevel];
      resultsContainer.appendChild(headerDiv);
    }

    // Grid wrapper
    var grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(340px, 1fr))';
    grid.style.gap = 'var(--space-5)';

    topics.forEach(function(topic) {
      grid.appendChild(createTopicCard(topic));
    });

    resultsContainer.appendChild(grid);
  }

  /* ---------- Event Handlers ---------- */
  var debounceTimer;
  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    searchClear.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
    debounceTimer = setTimeout(fetchTopics, 300);
  });

  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    searchClear.style.display = 'none';
    fetchTopics();
    searchInput.focus();
  });

  levelFilters.addEventListener('click', function(e) {
    var btn = e.target.closest('.level-btn');
    if (!btn) return;
    currentLevel = btn.getAttribute('data-level');
    var allBtns = levelFilters.querySelectorAll('.level-btn');
    allBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    fetchTopics();
  });

  subjectFilter.addEventListener('change', fetchTopics);
  difficultyFilter.addEventListener('change', fetchTopics);

  /* ---------- Init ---------- */
  loadSubjects();
  fetchTopics();

})();
