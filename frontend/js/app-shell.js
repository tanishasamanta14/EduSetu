/* ============================================================
   EduSetu — App Shell Controller & Global Authentication Guard
   Unified navigation, active route handling, user profile syncing,
   mobile drawer behavior, and STRICT access control across all app views.
   Without a verified login, users are immediately redirected to login.html.
   ============================================================ */

(function() {
  'use strict';

  // Current page detection
  const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
  const query = window.location.search || '';

  function redirectToLogin() {
    try {
      localStorage.removeItem('edusetu_user_token');
      localStorage.removeItem('edusetu_user_prefs');
    } catch (e) {}

    // Public pages do not redirect
    if (currentPath === 'login.html' || currentPath === 'register.html' || currentPath === 'index.html') {
      return;
    }

    const redirectTarget = encodeURIComponent(currentPath + query);
    window.location.replace('login.html?redirect=' + redirectTarget);
  }

  // 1. Enforce Authentication Immediately (Auth Guard)
  async function enforceAuth() {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });

      if (!res.ok) {
        redirectToLogin();
        return;
      }

      const json = await res.json();
      if (!json.success || !json.data || !json.data.user) {
        redirectToLogin();
        return;
      }

      // User is verified and authenticated
      updateUserUI(json.data.user);
    } catch (err) {
      console.warn('[EduSetu Shell] Auth verification failed:', err);
      redirectToLogin();
    }
  }

  // Run Auth Guard immediately on script evaluation
  enforceAuth();

  function initAppShell() {
    setupActiveNav();
    setupMobileSidebar();
    setupUserProfileMenu();
    setupGlobalSearch();
  }

  /* 2. Mark Active Navigation Item */
  function setupActiveNav() {
    const navItems = document.querySelectorAll('.app-sidebar-nav .nav-item');

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'dashboard.html'))) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /* 3. Mobile Sidebar Open / Close */
  function setupMobileSidebar() {
    const sidebar = document.querySelector('.app-sidebar');
    const toggleBtn = document.getElementById('sidebarMobileToggle');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    let overlay = document.querySelector('.sidebar-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    function openSidebar() {
      if (sidebar) sidebar.classList.add('open');
      overlay.classList.add('active');
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
  }

  /* 4. User Profile Dropdown & Logout */
  function setupUserProfileMenu() {
    const profilePill = document.getElementById('userProfilePill');
    const profileDropdown = document.getElementById('userProfileDropdown');
    const logoutBtn = document.getElementById('shellLogoutBtn');

    if (profilePill && profileDropdown) {
      profilePill.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
      });

      document.addEventListener('click', function(e) {
        if (!profileDropdown.contains(e.target) && !profilePill.contains(e.target)) {
          profileDropdown.classList.remove('show');
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (err) {}
        try {
          localStorage.removeItem('edusetu_user_token');
          localStorage.removeItem('edusetu_user_prefs');
        } catch (e) {}
        window.location.replace('login.html');
      });
    }

    // Notifications toggle
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notifDropdown.classList.toggle('show');
      });
      document.addEventListener('click', function(e) {
        if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
          notifDropdown.classList.remove('show');
        }
      });
    }
  }

  /* 5. Global Search Handler */
  function setupGlobalSearch() {
    const searchForm = document.getElementById('topbarSearchForm');
    const searchInput = document.getElementById('topbarSearchInput');

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = 'explore.html?q=' + encodeURIComponent(query);
        }
      });
    }
  }

  function updateUserUI(user) {
    if (!user) return;
    const name = user.name || user.email?.split('@')[0] || 'Student';
    const email = user.email || '';
    const role = (user.role || 'student').charAt(0).toUpperCase() + (user.role || 'student').slice(1);

    // Get initials
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'S';

    // Update Topbar
    const avatarEls = document.querySelectorAll('.user-avatar-circle');
    avatarEls.forEach(el => { el.textContent = initials; });

    const nameEls = document.querySelectorAll('.user-meta-name, .dropdown-header-name');
    nameEls.forEach(el => { el.textContent = name; });

    const roleEls = document.querySelectorAll('.user-meta-role');
    roleEls.forEach(el => { el.textContent = role; });

    const emailEls = document.querySelectorAll('.dropdown-header-email');
    emailEls.forEach(el => { el.textContent = email; });

    // Custom event for page scripts that need user data
    window.dispatchEvent(new CustomEvent('edusetu:userloaded', { detail: { name, email, role, user } }));
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppShell);
  } else {
    initAppShell();
  }

  window.EduSetuShell = {
    enforceAuth: enforceAuth,
    updateUserUI: updateUserUI
  };
})();
