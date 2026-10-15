/**
 * EduSetu Global Theme Manager
 * Supports instant, persistent switching between 'dark' (Midnight Navy default)
 * and 'light' (Clean SaaS modern light) across all platform pages without reload.
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'edusetu_theme';
  var DEFAULT_THEME = 'dark';

  function getSavedTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (e) {
      console.warn('Theme storage inaccessible:', e);
    }
    return DEFAULT_THEME;
  }

  function applyTheme(theme) {
    var validTheme = (theme === 'light') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    if (document.body) {
      document.body.setAttribute('data-theme', validTheme);
    }
    document.documentElement.style.colorScheme = validTheme;

    try {
      localStorage.setItem(STORAGE_KEY, validTheme);
    } catch (e) {}

    updateToggleButtons(validTheme);

    // Dispatch global event for pages that have canvas / charts (like mastery-map or dashboard)
    window.dispatchEvent(new CustomEvent('edusetu:themechanged', {
      detail: { theme: validTheme }
    }));

    return validTheme;
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    var next = (current === 'light') ? 'dark' : 'light';
    return applyTheme(next);
  }

  function updateToggleButtons(currentTheme) {
    var isLight = currentTheme === 'light';

    // 1. All standard theme-toggle-btn buttons
    var buttons = document.querySelectorAll('.theme-toggle-btn, [data-theme-toggle], #landingThemeToggle, #themeToggleBtn, #mobileThemeToggle');
    buttons.forEach(function(btn) {
      btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      btn.setAttribute('title', isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme');
      
      var sun = btn.querySelector('.theme-toggle-icon-light');
      var moon = btn.querySelector('.theme-toggle-icon-dark');
      if (sun && moon) {
        if (isLight) {
          sun.style.display = 'inline-flex';
          moon.style.display = 'none';
        } else {
          sun.style.display = 'none';
          moon.style.display = 'inline-flex';
        }
      }
    });

    // 2. Profile Appearance Switcher (#appearanceToggle)
    var profileSwitch = document.getElementById('appearanceToggle');
    if (profileSwitch) {
      var circle = profileSwitch.querySelector('.toggle-switch-circle');
      if (isLight) {
        profileSwitch.style.background = '#3B82F6';
        if (circle) circle.style.transform = 'translateX(20px)';
        profileSwitch.setAttribute('data-state', 'light');
      } else {
        profileSwitch.style.background = 'rgba(255, 255, 255, 0.15)';
        if (circle) circle.style.transform = 'translateX(0)';
        profileSwitch.setAttribute('data-state', 'dark');
      }
    }
  }

  function initToggles() {
    var toggles = document.querySelectorAll('.theme-toggle-btn, [data-theme-toggle], #landingThemeToggle, #themeToggleBtn, #mobileThemeToggle');
    toggles.forEach(function(btn) {
      if (!btn.__themeBound) {
        btn.__themeBound = true;
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
        });
      }
    });

    var profileSwitch = document.getElementById('appearanceToggle');
    if (profileSwitch && !profileSwitch.__themeBound) {
      profileSwitch.__themeBound = true;
      profileSwitch.style.cursor = 'pointer';
      profileSwitch.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      });
    }

    updateToggleButtons(document.documentElement.getAttribute('data-theme') || getSavedTheme());
  }

  // Execute immediately to eliminate any flash of wrong theme
  var initialTheme = getSavedTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
  if (document.body) {
    document.body.setAttribute('data-theme', initialTheme);
  }

  // Bind toggles when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggles);
  } else {
    initToggles();
  }

  // Public API
  window.EduSetuTheme = {
    getTheme: function() {
      return document.documentElement.getAttribute('data-theme') || getSavedTheme();
    },
    setTheme: applyTheme,
    toggleTheme: toggleTheme,
    initToggles: initToggles,
    updateToggleButtons: updateToggleButtons
  };
})();
