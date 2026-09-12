/* ============================================================
   EduSetu — Shared JavaScript Utilities
   Navbar, scroll effects, data initialization, helpers
   ============================================================ */

(function() {
  'use strict';

  /* ---------- Initialize mock data on first visit ---------- */
  function initializeMockData() {
    if (localStorage.getItem('edusetu_initialized')) return;

    // Confidence score history (last 4 weeks)
    var confidenceHistory = [
      { week: 'Week 1', score: 45 },
      { week: 'Week 2', score: 55 },
      { week: 'Week 3', score: 62 },
      { week: 'Week 4', score: 71 }
    ];
    localStorage.setItem('edusetu_confidence_history', JSON.stringify(confidenceHistory));

    // Chat ratings for confidence score
    var chatRatings = { gotIt: 15, kindOf: 8, confused: 4 };
    localStorage.setItem('edusetu_chat_ratings', JSON.stringify(chatRatings));

    // User preferences
    var userPrefs = {
      name: 'Aarav Sharma',
      grade: 8,
      language: 'en',
      role: 'student',
      subjects: ['math', 'science', 'english', 'socialScience', 'hindi']
    };
    localStorage.setItem('edusetu_user_prefs', JSON.stringify(userPrefs));

    // Quiz history for dashboard
    var quizHistory = [
      { concept: 'Fractions', subject: 'math', score: 80, date: '2025-04-01', misconceptions: [] },
      { concept: 'Photosynthesis', subject: 'science', score: 60, date: '2025-04-03', misconceptions: ['organelle-pigment-confusion'] },
      { concept: 'Algebraic Expressions', subject: 'math', score: 40, date: '2025-04-05', misconceptions: ['sign-error', 'term-combination-error'] },
      { concept: 'Active & Passive Voice', subject: 'english', score: 55, date: '2025-04-07', misconceptions: ['tense-shift-error'] },
      { concept: 'Ratios & Proportions', subject: 'math', score: 55, date: '2025-04-08', misconceptions: ['ratio-reversal'] }
    ];
    localStorage.setItem('edusetu_quiz_history', JSON.stringify(quizHistory));

    localStorage.setItem('edusetu_initialized', 'true');
  }

  /* ---------- Get user prefs ---------- */
  function getUserPrefs() {
    var stored = localStorage.getItem('edusetu_user_prefs');
    if (stored) {
      try { return JSON.parse(stored); } catch(e) { /* fall through */ }
    }
    return { name: 'Student', grade: 8, language: 'en', role: 'student', subjects: ['math', 'science', 'english'] };
  }

  /* ---------- Get confidence score ---------- */
  function getConfidenceScore() {
    var stored = localStorage.getItem('edusetu_chat_ratings');
    if (stored) {
      try {
        var r = JSON.parse(stored);
        var total = (r.gotIt || 0) + (r.kindOf || 0) + (r.confused || 0);
        if (total === 0) return 0;
        return Math.round(((r.gotIt || 0) / total) * 100);
      } catch(e) { return 0; }
    }
    return 0;
  }

  /* ---------- Navbar scroll effect ---------- */
  function setupNavbar() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Mobile menu toggle
    var toggle = document.querySelector('.menu-toggle');
    var links = document.querySelector('.navbar-links');
    if (toggle && links) {
      toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
      });

      // Close on link click
      var navLinks = links.querySelectorAll('a');
      for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function() {
          toggle.classList.remove('active');
          links.classList.remove('open');
        });
      }
    }

    // Mark active page
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var allLinks = document.querySelectorAll('.navbar-links a');
    for (var j = 0; j < allLinks.length; j++) {
      var href = allLinks[j].getAttribute('href');
      if (href === currentPage) {
        allLinks[j].classList.add('active');
      }
    }
  }

  /* ---------- Intersection Observer for reveal animations ---------- */
  function setupRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  function setupSmoothScroll() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var targetId = link.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ---------- Counter animation (for landing page stats) ---------- */
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var prefix = el.getAttribute('data-prefix') || '';
          var duration = 2000;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out quad
            var eased = 1 - (1 - progress) * (1 - progress);
            var current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ---------- URL parameter helper ---------- */
  function getUrlParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  /* ---------- Format a concept ID to display name ---------- */
  function formatConceptName(id) {
    return id.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  }

  /* ---------- Create safe DOM element with text ---------- */
  function createEl(tag, className, textContent) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
  }

  /* ---------- Initialize everything on DOM ready ---------- */
  function init() {
    initializeMockData();
    setupNavbar();
    setupRevealAnimations();
    setupSmoothScroll();
    animateCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- Expose utilities globally ---------- */
  window.EduSetu = {
    getUserPrefs: getUserPrefs,
    getConfidenceScore: getConfidenceScore,
    getUrlParam: getUrlParam,
    formatConceptName: formatConceptName,
    createEl: createEl,
    initializeMockData: initializeMockData
  };

})();
