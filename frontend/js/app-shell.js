/* ============================================================
   EduSetu — App Shell Controller
   Unified navigation, active route handling, user profile syncing,
   and mobile drawer behavior across all authenticated views.
   ============================================================ */

(function() {
  'use strict';

  function initAppShell() {
    setupActiveNav();
    setupMobileSidebar();
    setupUserProfileMenu();
    setupGlobalSearch();
    loadActiveUser();
  }

  /* 1. Mark Active Navigation Item */
  function setupActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
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

  /* 2. Mobile Sidebar Open / Close */
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

  /* 3. User Profile Dropdown & Logout */
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
        localStorage.removeItem('edusetu_user_token');
        localStorage.removeItem('edusetu_user_prefs');
        window.location.href = 'login.html';
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

  /* 4. Global Search Handler */
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

  /* 5. Fetch Active User Profile */
  async function loadActiveUser() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.user) {
          updateUserUI(json.data.user);
          return;
        }
      }

      // If unauthenticated in dev, check profile endpoint or fallback to default student
      const pRes = await fetch('/api/profile', { credentials: 'include' });
      if (pRes.ok) {
        const pJson = await pRes.json();
        if (pJson.success && pJson.data) {
          updateUserUI(pJson.data);
          return;
        }
      }

      // Check localStorage prefs
      const prefs = localStorage.getItem('edusetu_user_prefs');
      if (prefs) {
        updateUserUI(JSON.parse(prefs));
      } else {
        updateUserUI({ name: 'Tanisha Samanta', email: 'tanisha@example.com', role: 'Student' });
      }
    } catch (err) {
      updateUserUI({ name: 'Tanisha Samanta', email: 'tanisha@example.com', role: 'Student' });
    }
  }

  function updateUserUI(user) {
    const name = user.name || user.email?.split('@')[0] || 'Tanisha';
    const email = user.email || 'tanisha@example.com';
    const role = (user.role || 'student').charAt(0).toUpperCase() + (user.role || 'student').slice(1);

    // Get initials
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TS';

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
    loadActiveUser: loadActiveUser
  };
})();
