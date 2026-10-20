/* ===================================================================
   TSVC Member Portal — shared routing & interaction layer
   Preserves the original design; only adds navigation between pages,
   entrance animations, mobile menu, toasts, and form polish.
   =================================================================== */

(function () {
  'use strict';

  const PATH = window.location.pathname.split('/').pop() || 'TSVC-Member-Registration-Login.html';

  function $all(sel, root) {
    return (root || document).querySelectorAll(sel);
  }
  function pageName(href) {
    return href.split('/').pop().split('?')[0];
  }

  // ---------- Page entrance ----------
  document.body.classList.add('page');

  // Staggered entrance for elements marked .reveal
  function initReveals() {
    $all('.reveal').forEach((el, i) => {
      el.style.animationDelay = i * 0.07 + 's';
    });
  }

  // ---------- Highlight the nav link matching the current page ----------
  function setActiveNav() {
    $all('a.nav-link').forEach((a) => {
      const target = pageName(a.getAttribute('href'));
      a.classList.toggle('active', target === PATH);
    });
    $all('#mobile-menu a[data-nav]').forEach((a) => {
      const target = pageName(a.getAttribute('href'));
      a.classList.toggle('active', target === PATH);
    });
  }

  // ---------- Intercept real page links for a subtle fade-out ----------
  function setupNavLinks() {
    $all('a[data-nav]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        document.body.classList.add('page-fade-out');
        e.preventDefault();
        setTimeout(() => {
          window.location.href = href;
        }, 160);
      });
    });
  }

  // ---------- Mobile menu toggle ----------
  function setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const panel = document.getElementById('mobile-menu');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const open = panel.style.display === 'block';
      panel.style.display = open ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!open));
    });

    panel.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        panel.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        panel.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Toast notifications ----------
  function toast(message, duration) {
    let el = document.getElementById('tsvc-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'tsvc-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duration || 2600);
  }

  function setupToasts() {
    $all('[data-toast]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toast(btn.getAttribute('data-toast') || 'Action completed.');
      });
    });
  }

  // ---------- Form enhancements (login / register route to dashboard) ----------
  function setupForms() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = loginForm.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = 'Signing in…';
        btn.disabled = true;
        setTimeout(() => {
          window.location.href = 'TSVC-Member-Dashboard.html';
        }, 600);
      });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = registerForm.querySelector('button[type="submit"]');
        btn.innerHTML = 'Creating account…';
        btn.disabled = true;
        setTimeout(() => {
          window.location.href = 'TSVC-Member-Dashboard.html';
        }, 700);
      });
    }
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    initReveals();
    setActiveNav();
    setupNavLinks();
    setupMobileMenu();
    setupToasts();
    setupForms();
  });
})();
