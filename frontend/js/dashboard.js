/* ============================================================
   EduSetu — Dashboard JavaScript
   Database-driven student dashboard with dynamic Chart.js
   ============================================================ */

(function() {
  'use strict';

  var chartInstances = {};

  // Toast for errors
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

  /* ---------- Fetch Dashboard Data ---------- */
  function loadDashboard() {
    var main = document.querySelector('.main-content');
    main.style.opacity = '0.5';

    fetch('/api/dashboard/student')
      .then(function(res) {
        if (res.status === 401) {
          return fetch('/api/auth/dev-login').then(function() { return fetch('/api/dashboard/student'); });
        }
        return res;
      })
      .then(function(res) { return res.json(); })
      .then(function(result) {
        main.style.opacity = '1';
        if (result.success && result.data) {
          renderDashboard(result.data);
        } else {
          showToast(result.message || 'Error loading dashboard', true);
        }
      })
      .catch(function(err) {
        main.style.opacity = '1';
        showToast('Network error loading dashboard', true);
      });
  }

  /* ---------- Render Everything ---------- */
  function renderDashboard(data) {
    renderWelcome(data);
    renderTopMetrics(data);
    
    // Check if new student with 0 quizzes
    if (data.totalQuizzes === 0) {
      showEmptyState();
      return;
    } else {
      document.getElementById('dashStats').style.display = 'grid';
      document.querySelector('.dashboard-grid').style.display = 'grid';
      var emptyEl = document.getElementById('emptyStateMsg');
      if (emptyEl) emptyEl.remove();
    }

    renderCharts(data);
    renderWeakStrong(data);
    renderRecentActivity(data);
  }

  function showEmptyState() {
    // Hide standard elements
    document.getElementById('dashStats').style.display = 'none';
    document.querySelector('.dashboard-grid').style.display = 'none';

    // Create empty state banner
    var container = document.querySelector('.container');
    var emptyDiv = document.getElementById('emptyStateMsg');
    if (!emptyDiv) {
      emptyDiv = document.createElement('div');
      emptyDiv.id = 'emptyStateMsg';
      emptyDiv.className = 'glass-card';
      emptyDiv.style.textAlign = 'center';
      emptyDiv.style.padding = '3rem';
      emptyDiv.style.marginTop = '2rem';
      
      emptyDiv.innerHTML = `
        <h2 style="margin-bottom: 1rem; color: var(--primary-color);">Welcome to EduSetu!</h2>
        <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem;">
          Take your first diagnostic quiz to start building your mastery map.
        </p>
        <button class="btn btn-primary" onclick="window.location.href='quiz.html'">Start a Quiz</button>
      `;
      container.insertBefore(emptyDiv, document.querySelector('.dashboard-grid'));
    }
  }

  function renderWelcome(data) {
    var welcome = document.getElementById('dashWelcome');
    var subtitle = document.getElementById('dashSubtitle');
    
    // Use profile name if we have to fetch it, but usually user data comes back.
    // For now we'll fetch from /api/profile if needed, or rely on what's available
    fetch('/api/profile').then(r => r.json()).then(res => {
       if(res.success) {
         welcome.textContent = 'Welcome back, ' + res.data.name + '!';
         subtitle.textContent = 'Class ' + res.data.grade + ' — Here\'s your learning overview';
       }
    });

    var riskDiv = document.getElementById('dashRisk');
    if (riskDiv) {
      riskDiv.replaceChildren();
      var badge = document.createElement('span');
      // If overall mastery is high, low risk.
      if (data.overallMastery >= 70) {
        badge.className = 'risk-badge low';
        badge.textContent = 'Low Risk';
      } else if (data.overallMastery >= 40) {
        badge.className = 'risk-badge medium';
        badge.textContent = 'Moderate Risk';
      } else {
        badge.className = 'risk-badge high';
        badge.textContent = 'High Dropout Risk';
      }
      riskDiv.appendChild(badge);
    }
  }

  function renderTopMetrics(data) {
    var container = document.getElementById('dashStats');
    if (!container) return;
    container.replaceChildren();

    var stats = [
      { label: 'Overall Confidence', val: data.overallMastery + '%', icon: '🧠', color: 'var(--primary-color)' },
      { label: 'Total Quizzes', val: data.totalQuizzes, icon: '📝', color: 'var(--accent-color)' },
      { label: 'Learning Streak', val: data.learningStreak + ' days', icon: '🔥', color: '#F59E0B' },
      { label: 'Completion', val: data.completionPercentage + '%', icon: '🎯', color: '#10B981' }
    ];

    stats.forEach(function(s) {
      var card = document.createElement('div');
      card.className = 'stat-card';
      
      var icon = document.createElement('div');
      icon.className = 'stat-icon';
      icon.textContent = s.icon;
      icon.style.background = s.color + '20'; // 20% opacity
      icon.style.color = s.color;

      var info = document.createElement('div');
      var val = document.createElement('div');
      val.className = 'stat-val';
      val.textContent = s.val;
      var lbl = document.createElement('div');
      lbl.className = 'stat-label';
      lbl.textContent = s.label;
      
      info.appendChild(val);
      info.appendChild(lbl);
      card.appendChild(icon);
      card.appendChild(info);
      container.appendChild(card);
    });
  }

  function renderCharts(data) {
    // 1. Overall Doughnut
    var overCtx = document.getElementById('overallChart');
    if (overCtx) {
      if (chartInstances.overall) chartInstances.overall.destroy();
      chartInstances.overall = new Chart(overCtx, {
        type: 'doughnut',
        data: {
          labels: ['Mastered', 'Learning'],
          datasets: [{
            data: [data.overallMastery, 100 - data.overallMastery],
            backgroundColor: ['#3B82F6', 'rgba(59, 130, 246, 0.1)'],
            borderWidth: 0
          }]
        },
        options: {
          cutout: '80%', responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          }
        }
      });
      // Update text in center
      var centerText = document.getElementById('overallScoreText');
      if (centerText) centerText.textContent = data.overallMastery + '%';
    }

    // 2. Subject Radar
    var subjCtx = document.getElementById('subjectChart');
    if (subjCtx && data.subjectMastery.length > 0) {
      if (chartInstances.subject) chartInstances.subject.destroy();
      var labels = data.subjectMastery.map(function(s) { return s.subjectName; });
      var scores = data.subjectMastery.map(function(s) { return s.score; });

      chartInstances.subject = new Chart(subjCtx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Subject Mastery',
            data: scores,
            backgroundColor: 'rgba(96, 165, 250, 0.2)',
            borderColor: '#60A5FA',
            pointBackgroundColor: '#60A5FA',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#60A5FA'
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: 'rgba(255,255,255,0.1)' },
              grid: { color: 'rgba(255,255,255,0.1)' },
              pointLabels: { color: '#9CA3AF', font: { size: 12 } },
              ticks: { display: false, min: 0, max: 100 }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // 3. Progress Line Chart
    var progCtx = document.getElementById('progressChart');
    if (progCtx && data.recentQuizScores.length > 0) {
      if (chartInstances.progress) chartInstances.progress.destroy();
      var pLabels = data.recentQuizScores.map(function(q) { return q.date; });
      var pScores = data.recentQuizScores.map(function(q) { return q.score; });

      chartInstances.progress = new Chart(progCtx, {
        type: 'line',
        data: {
          labels: pLabels,
          datasets: [{
            label: 'Quiz Scores (%)',
            data: pScores,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true, max: 100,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#9CA3AF' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#9CA3AF' }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  function renderWeakStrong(data) {
    var strongList = document.getElementById('strongTopicsList');
    var weakList = document.getElementById('weakTopicsList');
    
    if (strongList) {
      strongList.replaceChildren();
      if (data.strongTopics.length === 0) {
        strongList.innerHTML = '<li style="color:var(--text-muted); padding:1rem 0;">No mastered topics yet.</li>';
      } else {
        data.strongTopics.slice(0,4).forEach(function(t) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="topic-name">' + t.name + '</span><span class="badge badge-mastered">Mastered</span>';
          strongList.appendChild(li);
        });
      }
    }

    if (weakList) {
      weakList.replaceChildren();
      if (data.weakTopics.length === 0) {
        weakList.innerHTML = '<li style="color:var(--text-muted); padding:1rem 0;">No weak topics! Great job.</li>';
      } else {
        data.weakTopics.slice(0,4).forEach(function(t) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="topic-name">' + t.name + '</span><span class="badge badge-' + t.status + '">' + t.status + '</span>';
          weakList.appendChild(li);
        });
      }
    }
  }

  function renderRecentActivity(data) {
    var activityList = document.getElementById('activityList');
    if (!activityList) return;
    activityList.replaceChildren();
    
    if (data.recentActivity.length === 0) {
      activityList.innerHTML = '<li style="color:var(--text-muted); padding:1rem 0;">No recent activity.</li>';
      return;
    }

    data.recentActivity.forEach(function(act) {
      var li = document.createElement('li');
      li.className = 'activity-item';
      
      var icon = document.createElement('div');
      icon.className = 'activity-icon';
      icon.textContent = '✅';
      
      var content = document.createElement('div');
      content.className = 'activity-content';
      var text = document.createElement('div');
      text.textContent = act.title + ' (Score: ' + act.score + '%)';
      var time = document.createElement('div');
      time.className = 'activity-time';
      var d = new Date(act.date);
      time.textContent = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
      
      content.appendChild(text);
      content.appendChild(time);
      li.appendChild(icon);
      li.appendChild(content);
      activityList.appendChild(li);
    });
  }

  /* ---------- Init ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDashboard);
  } else {
    loadDashboard();
  }

})();
