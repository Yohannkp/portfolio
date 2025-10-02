import { onReady } from './domReady.js';

const closeNav = (nav, navToggle) => {
  if (!nav || !navToggle) return;
  nav.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

const initNav = () => {
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  if (!nav || !navToggle) return;

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    document.body.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeNav(nav, navToggle));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeNav(nav, navToggle);
    }
  });
};

const initHeader = () => {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const updateHeader = () => {
    const elevated = window.scrollY > 16;
    header.classList.toggle('is-elevated', elevated);
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
};

const initBackToTop = () => {
  const backToTop = document.querySelector('[data-back-to-top]');
  if (!backToTop) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggleVisibility = () => {
    if (window.scrollY > 360) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
};

const initFooterMeta = () => {
  const yearHolder = document.querySelector('[data-year]');
  if (yearHolder) {
    yearHolder.textContent = new Date().getFullYear();
  }
};

export const initNavigation = () => {
  onReady(() => {
    initNav();
    initHeader();
    initBackToTop();
    initFooterMeta();
  });
};
