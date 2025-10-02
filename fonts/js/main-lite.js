const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const backToTop = document.querySelector('[data-back-to-top]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeNav();
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        closeNav();
      }
    });
  }

  const setYear = () => {
    const yearHolder = document.querySelector('[data-year]');
    if (yearHolder) {
      yearHolder.textContent = new Date().getFullYear();
    }
  };

  setYear();

  if (backToTop) {
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
  }

  if (header) {
    const updateHeader = () => {
      const elevated = window.scrollY > 16;
      header.classList.toggle('is-elevated', elevated);
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }
});
