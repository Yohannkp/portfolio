/* ===================================
   PERFORMANCE & OPTIMIZATIONS JS
   =================================== */

// Lazy Loading Images
const LazyImageLoader = {
  init() {
    this.setupIntersectionObserver();
    this.preloadCriticalImages();
  },

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  },

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.classList.add('lazy-loading');
    
    // Support WebP avec fallback
    if (this.supportsWebP()) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      this.tryLoadWebP(img, webpSrc, src);
    } else {
      this.loadWithFallback(img, src);
    }
  },

  tryLoadWebP(img, webpSrc, fallbackSrc) {
    const webpImg = new Image();
    webpImg.onload = () => {
      this.setImageSrc(img, webpSrc);
    };
    webpImg.onerror = () => {
      this.loadWithFallback(img, fallbackSrc);
    };
    webpImg.src = webpSrc;
  },

  loadWithFallback(img, src) {
    const newImg = new Image();
    newImg.onload = () => {
      this.setImageSrc(img, src);
    };
    newImg.onerror = () => {
      this.handleImageError(img);
    };
    newImg.src = src;
  },

  setImageSrc(img, src) {
    img.src = src;
    img.classList.remove('lazy-loading');
    img.classList.add('loaded');
    
    // Animation d'apparition
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      img.style.opacity = '1';
    }, 50);
  },

  handleImageError(img) {
    img.classList.remove('lazy-loading');
    img.classList.add('error');
    img.alt = 'Image non disponible';
    console.warn('Erreur de chargement image:', img.getAttribute('data-src'));
  },

  supportsWebP() {
    if (this._webpSupport !== undefined) return this._webpSupport;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    this._webpSupport = canvas.toDataURL('image/webp').indexOf('webp') !== -1;
    return this._webpSupport;
  },

  preloadCriticalImages() {
    // Précharger les images critiques above-the-fold
    const criticalImages = [
      './images/hero-bg.webp',
      './images/avatar.webp'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  },

  loadAllImages() {
    // Fallback pour navigateurs sans IntersectionObserver
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }
};

// Performance Monitoring
const PerformanceMonitor = {
  init() {
    this.measureCoreWebVitals();
    this.setupPerformanceObserver();
    this.monitorResourceLoading();
  },

  measureCoreWebVitals() {
    // Mesurer LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime.toFixed(2), 'ms');
        
        if (lastEntry.startTime > 2500) {
          console.warn('LCP trop élevé! Optimisation nécessaire.');
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP monitoring non supporté');
      }
    }

    // Mesurer CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS actuel:', clsValue.toFixed(4));
      
      if (clsValue > 0.1) {
        console.warn('CLS problématique! Layout shifts détectés.');
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.log('CLS monitoring non supporté');
    }
  },

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn('Long task détectée:', entry.duration.toFixed(2), 'ms');
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.log('Long task monitoring non supporté');
      }
    }
  },

  monitorResourceLoading() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      
      console.log('📊 Performance Report:');
      console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd.toFixed(2), 'ms');
      console.log('Page Load Complete:', navigation.loadEventEnd.toFixed(2), 'ms');
      console.log('Resources chargées:', resources.length);
      
      // Analyser les ressources lentes
      const slowResources = resources.filter(resource => resource.duration > 1000);
      if (slowResources.length > 0) {
        console.warn('⚠️ Ressources lentes détectées:');
        slowResources.forEach(resource => {
          console.warn(`${resource.name}: ${resource.duration.toFixed(2)}ms`);
        });
      }
    });
  }
};

// Optimisation des animations
const AnimationOptimizer = {
  init() {
    this.respectMotionPreferences();
    this.optimizeForDevice();
    this.setupIntersectionBasedAnimations();
  },

  respectMotionPreferences() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      console.log('⚡ Animations réduites (préférence utilisateur)');
    }
  },

  optimizeForDevice() {
    // Réduire les animations sur appareils moins puissants
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = navigator.deviceMemory || 4;
    
    if (hardwareConcurrency < 4 || deviceMemory < 4) {
      document.documentElement.classList.add('reduced-animations');
      console.log('⚡ Animations optimisées pour appareil faible puissance');
    }

    // Désactiver certaines animations sur mobile
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      document.documentElement.classList.add('mobile-optimized');
      console.log('📱 Optimisations mobile appliquées');
    }
  },

  setupIntersectionBasedAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      animationObserver.observe(el);
    });
  }
};

// Critical Resource Loading
const CriticalResourceLoader = {
  init() {
    this.preloadCriticalAssets();
    this.setupServiceWorker();
  },

  preloadCriticalAssets() {
    const criticalAssets = [
      { href: './css/cyberpunk-theme.css', as: 'style' },
      { href: './css/cyberpunk-animations.css', as: 'style' },
      { href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900', as: 'style' },
      { href: './js/cyberpunk-core.js', as: 'script' }
    ];

    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset.href;
      link.as = asset.as;
      if (asset.as === 'style') link.onload = () => link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  },

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            console.log('✅ Service Worker enregistré:', registration.scope);
          })
          .catch(error => {
            console.log('❌ Erreur Service Worker:', error);
          });
      });
    }
  }
};

// Optimisation du scroll
const ScrollOptimizer = {
  init() {
    this.setupPassiveListeners();
    this.debounceScrollEvents();
  },

  setupPassiveListeners() {
    // Utiliser des event listeners passifs pour les performances
    const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
    passiveEvents.forEach(event => {
      document.addEventListener(event, (e) => {
        // Handler passif
      }, { passive: true });
    });
  },

  debounceScrollEvents() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Actions optimisées après scroll
        this.updateScrollProgress();
      }, 10);
    }, { passive: true });
  },

  updateScrollProgress() {
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }
};

// Initialisation globale des optimisations
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initialisation des optimisations performance...');
  
  LazyImageLoader.init();
  PerformanceMonitor.init();
  AnimationOptimizer.init();
  CriticalResourceLoader.init();
  ScrollOptimizer.init();
  
  console.log('✅ Optimisations performance initialisées');
});

// Export pour utilisation modulaire
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LazyImageLoader,
    PerformanceMonitor,
    AnimationOptimizer,
    CriticalResourceLoader,
    ScrollOptimizer
  };
}
