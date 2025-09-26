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


  const animatedNodes = document.querySelectorAll('[data-animate], [data-animate-child]');

  if (animatedNodes.length) {
    if (prefersReducedMotion) {
      animatedNodes.forEach((node) => {
        node.classList.add('is-visible');
      });
    } else {
      const animateObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const target = entry.target;
            const delay = Number(target.dataset.animateDelay || 0);
            if (!Number.isNaN(delay) && delay > 0) {
              target.style.transitionDelay = `${delay}ms`;
            }
            target.classList.add('is-visible');
            observer.unobserve(target);
          });
        },
        { threshold: 0.25 }
      );

      animatedNodes.forEach((node) => {
        animateObserver.observe(node);
      });
    }
  }

  const floatingName = document.querySelector('[data-floating-name]');
  const floatingAnchor = document.querySelector('[data-floating-anchor]');
  const floatingDock = document.querySelector('[data-floating-dock]');
  const timelineSection = document.getElementById('timeline');

  if (floatingName && floatingAnchor) {
    if (prefersReducedMotion) {
      floatingName.remove();
    } else {
      let floatingState = 'anchor';
      let rafId;

      const setFloatingPosition = (target, options = {}) => {
        if (!target) return;
        const targetRect = target.getBoundingClientRect();
        const bubbleRect = floatingName.getBoundingClientRect();
        const bubbleWidth = bubbleRect.width || 1;
        const bubbleHeight = bubbleRect.height || 1;
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        const offsetX = options.offsetX ?? 0;
        const offsetY = options.offsetY ?? 24;
        let x;
        switch (options.align) {
          case 'left':
            x = scrollX + targetRect.left - bubbleWidth - offsetX;
            break;
          case 'right':
            x = scrollX + targetRect.right + offsetX;
            break;
          default:
            x = scrollX + targetRect.left + targetRect.width / 2 - bubbleWidth / 2 + offsetX;
            break;
        }

        let y;
        switch (options.vertical) {
          case 'center':
            y = scrollY + targetRect.top + targetRect.height / 2 - bubbleHeight / 2 + offsetY;
            break;
          case 'below':
            y = scrollY + targetRect.bottom + offsetY;
            break;
          default:
            y = scrollY + targetRect.top - bubbleHeight - offsetY;
            break;
        }

        floatingName.style.setProperty('--floating-x', `${Math.round(x)}px`);
        floatingName.style.setProperty('--floating-y', `${Math.round(y)}px`);
        floatingName.style.setProperty('--floating-scale', options.scale ?? 1);
      };

      const syncFloating = () => {
        const compact = window.innerWidth < 768;
        if (floatingState === 'dock' && floatingDock) {
          setFloatingPosition(floatingDock, {
            align: compact ? 'center' : 'left',
            vertical: compact ? 'below' : 'center',
            offsetX: compact ? 0 : 24,
            offsetY: compact ? 12 : 0,
            scale: compact ? 1 : 0.9,
          });
        } else {
          setFloatingPosition(floatingAnchor, {
            offsetY: 28,
            scale: window.innerWidth < 768 ? 1 : 1.05,
          });
        }

        floatingName.classList.add('is-ready');
      };

      const queueFloating = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
          rafId = null;
          syncFloating();
        });
      };

      queueFloating();
      window.addEventListener('resize', queueFloating, { passive: true });
      window.addEventListener('scroll', queueFloating, { passive: true });

      if (timelineSection && floatingDock) {
        const dockObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const nextState = entry.isIntersecting ? 'dock' : 'anchor';
              if (nextState !== floatingState) {
                floatingState = nextState;
                queueFloating();
              }
            });
          },
          { threshold: 0.55 }
        );

        dockObserver.observe(timelineSection);
      }
    }
  }
});
