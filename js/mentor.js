/* ============================================================
   EduSetu — Mentor View JavaScript
   Student cards, class chart, weekly insights
   ============================================================ */

(function() {
  'use strict';

  /* ---------- Mock Student Data ---------- */
  var STUDENTS = [
    {
      name: 'Riya Patel', grade: 8, avatar: 'RP', color: '#7C3AED', risk: 'medium',
      mastery: { mastered: 8, shaky: 5, unattempted: 4 },
      note: 'Riya is shaky on Algebraic Expressions (sign errors) and Refraction. Suggested: 10-min revision on sign rules with worked examples.'
    },
    {
      name: 'Aarav Sharma', grade: 8, avatar: 'AS', color: '#2563EB', risk: 'low',
      mastery: { mastered: 12, shaky: 3, unattempted: 2 },
      note: 'Aarav is performing well overall. Focus area: Ratios & Proportions — suggest additional practice problems with real-world contexts.'
    },
    {
      name: 'Priya Singh', grade: 7, avatar: 'PS', color: '#059669', risk: 'high',
      mastery: { mastered: 4, shaky: 6, unattempted: 7 },
      note: 'Priya needs immediate attention — multiple concepts shaky in Math and Science. Risk of disengagement is high. Suggested: 1-on-1 session on Fractions basics and Cell Structure.'
    },
    {
      name: 'Karan Mehta', grade: 8, avatar: 'KM', color: '#DC2626', risk: 'low',
      mastery: { mastered: 10, shaky: 4, unattempted: 3 },
      note: 'Karan is strong in Science. Shaky on Active/Passive Voice in English. Suggested: grammar exercises with sentence conversion practice.'
    }
  ];

  var INSIGHTS = [
    {
      icon: '⚠️',
      title: 'At-Risk Student Alert',
      text: 'Priya Singh shows declining engagement with 7 unattempted concepts. Schedule a 1-on-1 session this week to prevent dropout risk.'
    },
    {
      icon: '📈',
      title: 'Class Strength: Science',
      text: 'Average mastery in Science is highest at 65%. Consider advancing to more complex topics for top performers like Karan.'
    },
    {
      icon: '🎯',
      title: 'Common Misconception',
      text: '"Sign errors" in Algebraic Expressions appear across 3 of 4 students. A focused 15-minute class exercise could help.'
    },
    {
      icon: '💡',
      title: 'Suggested Activity',
      text: 'Run a group quiz on Ratios & Proportions — 2 students are shaky, 1 has not attempted. Great for peer learning.'
    }
  ];

  /* ---------- Render Students ---------- */
  function renderStudents() {
    var container = document.getElementById('studentsGrid');
    container.replaceChildren();

    STUDENTS.forEach(function(s) {
      var card = document.createElement('div');
      card.className = 'student-card';

      // Header
      var header = document.createElement('div');
      header.className = 'student-header';

      var avatar = document.createElement('div');
      avatar.className = 'student-avatar';
      avatar.style.background = s.color;
      avatar.textContent = s.avatar;

      var info = document.createElement('div');
      var nameEl = document.createElement('span');
      nameEl.className = 'student-name';
      nameEl.textContent = s.name;
      var gradeEl = document.createElement('span');
      gradeEl.className = 'student-grade';
      gradeEl.textContent = 'Class ' + s.grade;
      info.appendChild(nameEl);
      info.appendChild(gradeEl);

      var riskBadge = document.createElement('span');
      riskBadge.className = 'risk-badge ' + s.risk;
      riskBadge.textContent = s.risk.charAt(0).toUpperCase() + s.risk.slice(1) + ' Risk';

      header.appendChild(avatar);
      header.appendChild(info);
      header.appendChild(riskBadge);

      // Mastery summary
      var mastery = document.createElement('div');
      mastery.className = 'student-mastery';

      var b1 = document.createElement('span');
      b1.className = 'badge badge-mastered';
      b1.textContent = s.mastery.mastered + ' mastered';
      var b2 = document.createElement('span');
      b2.className = 'badge badge-shaky';
      b2.textContent = s.mastery.shaky + ' shaky';
      var b3 = document.createElement('span');
      b3.className = 'badge badge-unattempted';
      b3.textContent = s.mastery.unattempted + ' unattempted';
      mastery.appendChild(b1);
      mastery.appendChild(b2);
      mastery.appendChild(b3);

      // Weekly note
      var note = document.createElement('div');
      note.className = 'student-note';
      note.textContent = s.note;

      card.appendChild(header);
      card.appendChild(mastery);
      card.appendChild(note);
      container.appendChild(card);
    });
  }

  /* ---------- Class Overview Chart ---------- */
  function renderClassChart() {
    var canvas = document.getElementById('classChart');
    var ctx = canvas.getContext('2d');

    // Calculate average mastery % per subject across students
    var subjects = ['Math', 'Science', 'English', 'Social Science', 'Hindi'];
    var avgScores = [52, 65, 48, 55, 45]; // Mock averages

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: subjects,
        datasets: [{
          label: 'Average Mastery %',
          data: avgScores,
          backgroundColor: [
            'rgba(129,140,248,0.7)',
            'rgba(52,211,153,0.7)',
            'rgba(251,191,36,0.7)',
            'rgba(167,139,250,0.7)',
            'rgba(248,113,113,0.7)'
          ],
          borderColor: [
            '#818CF8', '#34D399', '#FBBF24', '#A78BFA', '#F87171'
          ],
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx2) { return ctx2.dataset.label + ': ' + ctx2.parsed.x + '%'; }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: { font: { family: 'Inter', size: 11 }, color: '#6B7280', callback: function(v) { return v + '%'; } },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            ticks: { font: { family: 'Inter', size: 12, weight: 600 }, color: '#D1D5DB' },
            grid: { display: false }
          }
        }
      }
    });
  }

  /* ---------- Weekly Insights ---------- */
  function renderInsights() {
    var container = document.getElementById('insightsContainer');
    container.replaceChildren();

    INSIGHTS.forEach(function(ins) {
      var card = document.createElement('div');
      card.className = 'insight-card';

      var icon = document.createElement('span');
      icon.className = 'insight-icon';
      icon.textContent = ins.icon;

      var title = document.createElement('h5');
      title.textContent = ins.title;

      var text = document.createElement('p');
      text.textContent = ins.text;

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(text);
      container.appendChild(card);
    });
  }

  /* ---------- Init ---------- */
  function init() {
    renderStudents();
    renderClassChart();
    renderInsights();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
