/* ============================================================
   EduSetu — Dashboard JavaScript (Enhanced Dark Theme)
   Doughnut confidence, radar subjects, fixed layouts
   ============================================================ */

(function() {
  'use strict';

  var SUBJECT_CONFIG = [
    { key: 'math',          name: 'Mathematics',    icon: '📐', color: '#818CF8' },
    { key: 'science',       name: 'Science',        icon: '🔬', color: '#34D399' },
    { key: 'english',       name: 'English',        icon: '📚', color: '#FBBF24' },
    { key: 'socialScience', name: 'Social Science',  icon: '🌍', color: '#A78BFA' },
    { key: 'hindi',         name: 'हिंदी',           icon: '📖', color: '#F87171' },
    { key: 'physics',       name: 'Physics',        icon: '⚛️', color: '#38BDF8' },
    { key: 'chemistry',     name: 'Chemistry',      icon: '🧪', color: '#FB923C' },
    { key: 'computerScience', name: 'Computer Science', icon: '💻', color: '#4ADE80' },
    { key: 'biology',       name: 'Biology',        icon: '🧬', color: '#E879F9' },
    { key: 'economics',     name: 'Economics',      icon: '📈', color: '#FACC15' }
  ];

  /* ---------- Welcome ---------- */
  function renderWelcome() {
    var prefs = EduSetu.getUserPrefs();
    var welcome = document.getElementById('dashWelcome');
    var subtitle = document.getElementById('dashSubtitle');
    welcome.textContent = 'Welcome back, ' + prefs.name + '!';
    subtitle.textContent = 'Class ' + prefs.grade + ' · Here\'s your learning overview';

    var riskDiv = document.getElementById('dashRisk');
    riskDiv.replaceChildren();
    var badge = document.createElement('span');
    badge.className = 'risk-badge low';
    badge.textContent = 'Low Risk';
    riskDiv.appendChild(badge);
  }

  /* ---------- Stats ---------- */
  function renderStats() {
    var container = document.getElementById('dashStats');
    container.replaceChildren();

    var confidence = EduSetu.getConfidenceScore();

    var totalMastered = 0;
    var totalConcepts = 0;
    SUBJECT_CONFIG.forEach(function(s) {
      var stats = getMasteryStats(s.key);
      totalMastered += stats.mastered;
      totalConcepts += stats.total;
    });

    var history = [];
    var stored = localStorage.getItem('edusetu_quiz_history');
    if (stored) { try { history = JSON.parse(stored); } catch(e) {} }

    var statsData = [
      { icon: '🎯', label: 'Confidence Score', value: confidence + '%', bg: 'rgba(244,163,0,0.15)' },
      { icon: '✅', label: 'Concepts Mastered', value: totalMastered + '/' + totalConcepts, bg: 'rgba(52,211,153,0.15)' },
      { icon: '📝', label: 'Quizzes Taken', value: String(history.length), bg: 'rgba(96,165,250,0.15)' },
      { icon: '🔥', label: 'Current Streak', value: '5 days', bg: 'rgba(248,113,113,0.15)' }
    ];

    statsData.forEach(function(s) {
      var card = document.createElement('div');
      card.className = 'stat-card';

      var iconDiv = document.createElement('div');
      iconDiv.className = 'stat-card-icon';
      iconDiv.style.background = s.bg;
      iconDiv.textContent = s.icon;

      var infoDiv = document.createElement('div');
      var val = document.createElement('span');
      val.className = 'stat-card-value';
      val.textContent = s.value;
      var lbl = document.createElement('span');
      lbl.className = 'stat-card-label';
      lbl.textContent = s.label;
      infoDiv.appendChild(val);
      infoDiv.appendChild(lbl);

      card.appendChild(iconDiv);
      card.appendChild(infoDiv);
      container.appendChild(card);
    });
  }

  /* ---------- Confidence Doughnut Chart ---------- */
  function renderConfidenceChart() {
    var confidence = EduSetu.getConfidenceScore();
    var canvas = document.getElementById('confidenceChart');
    var ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Confident', 'Unsure', 'Confused'],
        datasets: [{
          data: (function() {
            var stored = localStorage.getItem('edusetu_chat_ratings');
            var r = { gotIt: 15, kindOf: 8, confused: 4 };
            if (stored) { try { r = JSON.parse(stored); } catch(e) {} }
            return [r.gotIt || 0, r.kindOf || 0, r.confused || 0];
          })(),
          backgroundColor: [
            'rgba(52,211,153,0.8)',
            'rgba(251,191,36,0.8)',
            'rgba(248,113,113,0.8)'
          ],
          borderColor: [
            'rgba(52,211,153,1)',
            'rgba(251,191,36,1)',
            'rgba(248,113,113,1)'
          ],
          borderWidth: 2,
          hoverOffset: 6,
          spacing: 3,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9CA3AF',
              font: { family: 'Inter', size: 11 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 8
            }
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: function(chart) {
          var width = chart.width;
          var height = chart.height;
          var ctx2 = chart.ctx;
          ctx2.save();
          ctx2.font = '800 28px Sora, sans-serif';
          ctx2.fillStyle = '#F9FAFB';
          ctx2.textAlign = 'center';
          ctx2.textBaseline = 'middle';
          var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx2.fillText(confidence + '%', width / 2, centerY - 8);
          ctx2.font = '500 11px Inter, sans-serif';
          ctx2.fillStyle = '#6B7280';
          ctx2.fillText('Confidence', width / 2, centerY + 14);
          ctx2.restore();
        }
      }]
    });
  }

  /* ---------- Subject Radar Chart ---------- */
  function renderSubjectRadar() {
    var canvas = document.getElementById('subjectRadar');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var labels = [];
    var data = [];
    SUBJECT_CONFIG.forEach(function(s) {
      var stats = getMasteryStats(s.key);
      labels.push(s.name);
      data.push(stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0);
    });

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mastery %',
          data: data,
          backgroundColor: 'rgba(59,130,246,0.15)',
          borderColor: 'rgba(96,165,250,0.8)',
          borderWidth: 2,
          pointBackgroundColor: '#60A5FA',
          pointBorderColor: '#111827',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 25,
              color: '#6B7280',
              backdropColor: 'transparent',
              font: { size: 10 }
            },
            grid: { color: 'rgba(255,255,255,0.06)' },
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            pointLabels: {
              color: '#D1D5DB',
              font: { family: 'Inter', size: 11, weight: 600 }
            }
          }
        }
      }
    });
  }

  /* ---------- Subject Progress ---------- */
  function renderSubjects() {
    var container = document.getElementById('dashSubjects');
    container.replaceChildren();

    SUBJECT_CONFIG.forEach(function(s) {
      var stats = getMasteryStats(s.key);
      var pct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

      var card = document.createElement('div');
      card.className = 'subject-card';
      card.style.borderLeftColor = s.color;

      var header = document.createElement('div');
      header.className = 'subject-card-header';
      var icon = document.createElement('span');
      icon.className = 'subject-card-icon';
      icon.textContent = s.icon;
      var name = document.createElement('span');
      name.className = 'subject-card-name';
      name.textContent = s.name;
      var pctEl = document.createElement('span');
      pctEl.className = 'subject-card-pct';
      pctEl.textContent = pct + '%';
      header.appendChild(icon);
      header.appendChild(name);
      header.appendChild(pctEl);

      var progBar = document.createElement('div');
      progBar.className = 'progress-bar';
      var progFill = document.createElement('div');
      progFill.className = 'progress-bar-fill';
      progFill.style.width = pct + '%';
      progFill.style.background = s.color;
      progBar.appendChild(progFill);

      var badges = document.createElement('div');
      badges.className = 'subject-badges';
      var b1 = document.createElement('span');
      b1.className = 'badge badge-mastered';
      b1.textContent = stats.mastered + ' mastered';
      var b2 = document.createElement('span');
      b2.className = 'badge badge-shaky';
      b2.textContent = stats.shaky + ' shaky';
      var b3 = document.createElement('span');
      b3.className = 'badge badge-unattempted';
      b3.textContent = stats.unattempted + ' to learn';
      badges.appendChild(b1);
      badges.appendChild(b2);
      badges.appendChild(b3);

      card.appendChild(header);
      card.appendChild(progBar);
      card.appendChild(badges);
      container.appendChild(card);
    });
  }

  /* ---------- Recommended Topics ---------- */
  function renderRecommended() {
    var container = document.getElementById('recommendedTopics');
    container.replaceChildren();

    var count = 0;
    SUBJECT_CONFIG.forEach(function(s) {
      var concepts = getMasteryConcepts(s.key);
      concepts.forEach(function(c) {
        if (c.status === 'recommended' && count < 5) {
          count++;
          var item = document.createElement('div');
          item.className = 'recommended-item';
          var dot = document.createElement('span');
          dot.className = 'recommended-dot';
          var link = document.createElement('a');
          link.href = 'quiz.html?concept=' + encodeURIComponent(c.id);
          link.textContent = c.name;
          var subj = document.createElement('span');
          subj.className = 'recommended-subject';
          subj.textContent = s.name;
          item.appendChild(dot);
          item.appendChild(link);
          item.appendChild(subj);
          container.appendChild(item);
        }
      });
    });

    if (count === 0) {
      var empty = document.createElement('p');
      empty.className = 'text-muted text-sm';
      empty.textContent = 'No recommended topics right now.';
      container.appendChild(empty);
    }
  }

  /* ---------- Quiz Activity ---------- */
  function renderActivity() {
    var container = document.getElementById('quizActivity');
    container.replaceChildren();

    var history = [];
    var stored = localStorage.getItem('edusetu_quiz_history');
    if (stored) { try { history = JSON.parse(stored); } catch(e) {} }

    var recent = history.slice(-5).reverse();

    if (recent.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'text-muted text-sm';
      empty.textContent = 'No quizzes taken yet.';
      container.appendChild(empty);
      return;
    }

    recent.forEach(function(q) {
      var item = document.createElement('div');
      item.className = 'activity-item';
      var concept = document.createElement('span');
      concept.className = 'activity-concept';
      concept.textContent = q.concept;
      var scoreEl = document.createElement('span');
      scoreEl.className = 'activity-score';
      scoreEl.textContent = q.score + '%';
      scoreEl.style.color = q.score >= 80 ? '#34D399' : q.score >= 40 ? '#FBBF24' : '#F87171';
      var date = document.createElement('span');
      date.className = 'activity-date';
      date.textContent = q.date;
      item.appendChild(concept);
      item.appendChild(scoreEl);
      item.appendChild(date);
      container.appendChild(item);
    });
  }

  /* ---------- Init ---------- */
  function init() {
    renderWelcome();
    renderStats();
    renderConfidenceChart();
    renderSubjectRadar();
    renderSubjects();
    renderRecommended();
    renderActivity();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
