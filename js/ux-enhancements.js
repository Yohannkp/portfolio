/* ===========================================
   PHASE 2: INTERACTIONS JAVASCRIPT AVANCÉES
   Navigation moderne & micro-interactions
   =========================================== */

class UXEnhancementManager {
  constructor() {
    this.init();
  }

  init() {
    this.initEnhancedNavigation();
    this.initAdvancedCards();
    this.initMicroAnimations();
    this.initThemeSystem();
    this.initScrollEffects();
    this.initCursorEffects();
    this.initMagneticElements();
  }

  /* ===============================
     NAVIGATION AMÉLIORÉE
     =============================== */

  initEnhancedNavigation() {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('#hamburger');
    const mobileMenu = document.querySelector('#mobile-menu');
    
    // Header intelligent qui se cache/montre selon le scroll
    let lastScrollTop = 0;
    let scrollTimer = null;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Ajouter la classe scrolled après 50px
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Cacher/montrer le header selon la direction du scroll
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }

      lastScrollTop = scrollTop;

      // Mettre à jour les indicateurs de progression
      this.updateReadingProgress();
    });

    // Navigation active basée sur la position de scroll
    this.initActiveNavigation();

    // Menu mobile amélioré
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
      });

      // Fermer le menu en cliquant sur un lien
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.classList.remove('menu-open');
        });
      });
    }
  }

  initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
      rootMargin: '-50px 0px -50px 0px',
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${id}"]`);
        
        if (entry.isIntersecting && navLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  updateReadingProgress() {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const progress = (visibleHeight / Math.min(sectionHeight, viewportHeight)) * 100;
        
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${id}"]`);
        
        if (navLink) {
          navLink.style.setProperty('--progress', `${progress}%`);
          
          if (progress > 10) {
            navLink.classList.add('reading');
          } else {
            navLink.classList.remove('reading');
          }
        }
      }
    });
  }

  /* ===============================
     CARTES AVANCÉES
     =============================== */

  initAdvancedCards() {
    // Cartes avec effet parallax
    this.initParallaxCards();
    
    // Cartes flip
    this.initFlipCards();
    
    // Cartes magnétiques
    this.initMagneticCards();
  }

  initParallaxCards() {
    const cards = document.querySelectorAll('.project-card, .card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        card.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateZ(20px)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
      // Auto-flip au bout de 3 secondes si pas d'interaction
      let autoFlipTimer = setTimeout(() => {
        card.classList.add('auto-flipped');
      }, 3000);
      
      card.addEventListener('mouseenter', () => {
        clearTimeout(autoFlipTimer);
      });
      
      card.addEventListener('mouseleave', () => {
        setTimeout(() => {
          card.classList.remove('auto-flipped');
        }, 1000);
      });
    });
  }

  initMagneticCards() {
    const magneticCards = document.querySelectorAll('.card, .cyber-button');
    
    magneticCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const moveX = x * force * 0.3;
          const moveY = y * force * 0.3;
          
          card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  /* ===============================
     MICRO-ANIMATIONS
     =============================== */

  initMicroAnimations() {
    // Animation de typing pour les titres
    this.initTypingEffect();
    
    // Animations de hover avancées
    this.initHoverAnimations();
    
    // Animations de révélation au scroll
    this.initScrollReveal();
  }

  initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
      const text = element.textContent;
      const speed = parseInt(element.dataset.speed) || 50;
      
      element.textContent = '';
      element.classList.add('typing-effect');
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        } else {
          element.classList.remove('typing-effect');
        }
      };
      
      // Démarrer l'animation quand l'élément entre dans la vue
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeWriter();
            observer.unobserve(element);
          }
        });
      });
      
      observer.observe(element);
    });
  }

  initHoverAnimations() {
    const animatedElements = document.querySelectorAll('.cyber-button, .nav-link, .logo-header');
    
    animatedElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.animationPlayState = 'running';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.animationPlayState = 'paused';
      });
    });
  }

  /* ===============================
     SYSTÈME DE THÈMES
     =============================== */

  initThemeSystem() {
    this.createThemeSelector();
    this.loadSavedTheme();
  }

  createThemeSelector() {
    const themeSelector = document.createElement('div');
    themeSelector.className = 'theme-selector';
    themeSelector.innerHTML = `
      <div class="theme-option theme-default" data-theme="default" title="Thème par défaut"></div>
      <div class="theme-option theme-matrix" data-theme="matrix" title="Thème Matrix"></div>
      <div class="theme-option theme-neon" data-theme="neon" title="Thème Neon City"></div>
      <div class="theme-option theme-synthwave" data-theme="synthwave" title="Thème Synthwave"></div>
      <div class="theme-option theme-blade-runner" data-theme="blade-runner" title="Thème Blade Runner"></div>
    `;
    
    document.body.appendChild(themeSelector);
    
    // Gérer les clics sur les options de thème
    themeSelector.addEventListener('click', (e) => {
      const themeOption = e.target.closest('.theme-option');
      if (themeOption) {
        const theme = themeOption.dataset.theme;
        this.switchTheme(theme);
      }
    });
  }

  switchTheme(theme) {
    // Retirer tous les thèmes existants
    document.body.classList.remove('theme-matrix', 'theme-neon', 'theme-synthwave', 'theme-blade-runner');
    
    // Ajouter le nouveau thème (sauf pour le thème par défaut)
    if (theme !== 'default') {
      document.body.classList.add(`theme-${theme}`);
    }
    
    // Mettre à jour les options actives
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    
    // Sauvegarder le thème
    localStorage.setItem('selectedTheme', theme);
    
    // Animation de transition
    document.body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    this.switchTheme(savedTheme);
  }

  /* ===============================
     EFFETS DE SCROLL
     =============================== */

  initScrollEffects() {
    const revealElements = document.querySelectorAll('section, .card, .project-card');
    
    // Ajouter les classes de révélation
    revealElements.forEach((element, index) => {
      const delay = index % 3;
      if (delay === 0) element.classList.add('scroll-reveal');
      else if (delay === 1) element.classList.add('scroll-reveal-left');
      else element.classList.add('scroll-reveal-right');
    });
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    
    revealElements.forEach(element => observer.observe(element));
  }

  /* ===============================
     EFFETS DE CURSEUR
     =============================== */

  initCursorEffects() {
    // Créer le curseur personnalisé
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Suivre la souris
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Animation fluide du curseur
    const animateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Effets sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .card, .cyber-button');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
      });
    });
  }

  /* ===============================
     ÉLÉMENTS MAGNÉTIQUES
     =============================== */

  initMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic, .cyber-button, .logo-header');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.15;
        const moveY = y * 0.15;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ===============================
     MÉTHODES UTILITAIRES
     =============================== */

  // Ajouter une classe avec animation
  addClassWithAnimation(element, className, duration = 300) {
    element.style.transition = `all ${duration}ms ease`;
    element.classList.add(className);
    
    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  }

  // Créer une animation de particules
  createParticleEffect(x, y, color = '#9D4EDD') {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 4px;
      height: 4px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: particle-float 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  // Ajouter les keyframes pour les particules
  addParticleStyles() {
    if (!document.getElementById('particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes particle-float {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(${Math.random() * 200 - 100}px, -100px) scale(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

/* ===============================
   GESTIONNAIRE DE PERFORMANCE
   =============================== */

class UXPerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeAnimations();
    this.enableReducedMotion();
    this.lazyLoadAnimations();
  }

  optimizeAnimations() {
    // Désactiver les animations sur les appareils à faible performance
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-animations');
    }
    
    // Optimiser les animations avec will-change
    const animatedElements = document.querySelectorAll('.card, .nav-link, .cyber-button');
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
    });
  }

  enableReducedMotion() {
    // Respecter les préférences d'accessibilité
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
      
      // Désactiver les animations CSS
      const style = document.createElement('style');
      style.textContent = `
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  lazyLoadAnimations() {
    // Charger les animations seulement quand nécessaire
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-ready');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right')
      .forEach(element => observer.observe(element));
  }
}

/* ===============================
   INITIALISATION
   =============================== */

// Initialiser les améliorations UX/UI
document.addEventListener('DOMContentLoaded', () => {
  const uxManager = new UXEnhancementManager();
  const performanceManager = new UXPerformanceManager();
  
  // Ajouter les styles pour les particules
  uxManager.addParticleStyles();
  
  console.log('🚀 Phase 2: UX/UI Enhancements loaded successfully!');
});

// Exporter pour utilisation externe
window.UXEnhancementManager = UXEnhancementManager;
window.UXPerformanceManager = UXPerformanceManager;
