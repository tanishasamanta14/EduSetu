/* ============================================================
   EduSetu — Mentor Dashboard JavaScript
   Database-driven fetching for authorized mentors
   ============================================================ */

(function() {
  'use strict';
  
  var chartInstance = null;

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

  function loadDashboard() {
    var main = document.querySelector('.main-content');
    main.style.opacity = '0.5';

    fetch('/api/dashboard/mentor', { credentials: 'include' })
      .then(function(res) {
        if (res.status === 401) {
          window.location.replace('login.html?redirect=mentor.html');
          return null;
        }
        if (res.status === 403) {
          throw new Error('Forbidden: Only mentors can access this data.');
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
        showToast(err.message || 'Network error loading mentor dashboard', true);
      });
  }

  function renderDashboard(data) {
    // 1. Top Metrics
    var classAvgEl = document.getElementById('classAvg');
    var activeEl = document.getElementById('activeStudents');
    var riskEl = document.getElementById('atRiskCount');

    if (classAvgEl) classAvgEl.textContent = data.classAverage + '%';
    if (activeEl) activeEl.textContent = data.assignedStudents.length;
    if (riskEl) riskEl.textContent = data.atRiskStudents.length;

    renderStudents(data);
    renderInsights(data);
    renderChart(data);
  }

  function renderStudents(data) {
    var list = document.getElementById('studentList');
    if (!list) return;
    list.replaceChildren();

    if (data.assignedStudents.length === 0) {
      list.innerHTML = '<div style="color:var(--text-muted); padding:1rem;">No students assigned yet.</div>';
      return;
    }

    data.assignedStudents.forEach(function(s) {
      var card = document.createElement('div');
      card.className = 'student-card';

      var avatar = document.createElement('div');
      avatar.className = 'student-avatar';
      avatar.textContent = s.name.charAt(0);

      var info = document.createElement('div');
      info.className = 'student-info';
      var name = document.createElement('div');
      name.className = 'student-name';
      name.textContent = s.name;
      var details = document.createElement('div');
      details.className = 'student-details';
      details.textContent = 'Class ' + s.grade + ' • Score: ' + s.overallConfidence + '%';
      
      info.appendChild(name);
      info.appendChild(details);

      var badge = document.createElement('span');
      // If student is in atRisk array
      var isAtRisk = data.atRiskStudents.some(function(r) { return r.name === s.name; });
      if (isAtRisk) {
        badge.className = 'badge badge-weak';
        badge.textContent = 'At Risk';
      } else if (s.overallConfidence >= 80) {
        badge.className = 'badge badge-mastered';
        badge.textContent = 'Mastered';
      } else {
        badge.className = 'badge badge-developing';
        badge.textContent = 'On Track';
      }

      card.appendChild(avatar);
      card.appendChild(info);
      card.appendChild(badge);
      list.appendChild(card);
    });
  }

  function renderInsights(data) {
    var container = document.getElementById('insightsGrid');
    if (!container) return;
    container.replaceChildren();

    if (data.interventions.length === 0 && data.weakTopics.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted); padding:1rem;">No immediate insights. Class is performing well!</div>';
      return;
    }

    // Interventions
    data.interventions.forEach(function(inv) {
      var card = document.createElement('div');
      card.className = 'insight-card';
      var icon = document.createElement('div');
      icon.className = 'insight-icon';
      icon.textContent = '⚠️';
      icon.style.background = 'rgba(248, 113, 113, 0.2)';
      var text = document.createElement('div');
      text.className = 'insight-text';
      text.textContent = inv;
      card.appendChild(icon);
      card.appendChild(text);
      container.appendChild(card);
    });

    // Weak Topics
    data.weakTopics.forEach(function(wt) {
      var card = document.createElement('div');
      card.className = 'insight-card';
      var icon = document.createElement('div');
      icon.className = 'insight-icon';
      icon.textContent = '📉';
      icon.style.background = 'rgba(251, 191, 36, 0.2)';
      var text = document.createElement('div');
      text.className = 'insight-text';
      text.textContent = wt.studentCount + ' students struggling with ' + wt.name;
      card.appendChild(icon);
      card.appendChild(text);
      container.appendChild(card);
    });
  }

  function renderChart(data) {
    var ctx = document.getElementById('classChart');
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();

    var labels = data.assignedStudents.map(function(s) { return s.name; });
    var scores = data.assignedStudents.map(function(s) { return s.overallConfidence; });
    var avgData = data.assignedStudents.map(function() { return data.classAverage; });

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Class Average',
            data: avgData,
            type: 'line',
            borderColor: '#FBBF24',
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            order: 1
          },
          {
            label: 'Student Score',
            data: scores,
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: '#3B82F6',
            borderWidth: 1,
            borderRadius: 4,
            order: 2
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { 
            beginAtZero: true, 
            max: 100,
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#9CA3AF' }
          },
          y: { 
            grid: { display: false },
            ticks: { color: '#9CA3AF' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#D1D5DB' }
          }
        }
      }
    });
  }

  /* ---------- Init ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDashboard);
  } else {
    loadDashboard();
  }

})();
