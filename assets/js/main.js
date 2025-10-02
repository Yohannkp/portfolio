// src/js/modules/domReady.js
var onReady = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

// src/js/modules/navigation.js
var closeNav = (nav, navToggle) => {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
};
var initNav = () => {
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  if (!nav || !navToggle) return;
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeNav(nav, navToggle));
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeNav(nav, navToggle);
    }
  });
};
var initHeader = () => {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const updateHeader = () => {
    const elevated = window.scrollY > 16;
    header.classList.toggle("is-elevated", elevated);
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
};
var initBackToTop = () => {
  const backToTop = document.querySelector("[data-back-to-top]");
  if (!backToTop) return;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toggleVisibility = () => {
    if (window.scrollY > 360) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  };
  window.addEventListener("scroll", toggleVisibility, { passive: true });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
};
var initFooterMeta = () => {
  const yearHolder = document.querySelector("[data-year]");
  if (yearHolder) {
    yearHolder.textContent = (/* @__PURE__ */ new Date()).getFullYear();
  }
};
var initNavigation = () => {
  onReady(() => {
    initNav();
    initHeader();
    initBackToTop();
    initFooterMeta();
  });
};

// src/js/modules/contentEnhancements.js
var ContentEnhancementManager = class {
  constructor() {
    this.currentTestimonial = 0;
    this.testimonials = [];
    this.stats = [];
    this.skills = [];
    this.timelineItems = [];
    this.init();
  }
  init() {
    this.initInteractiveTimeline();
    this.initAdvancedSkillsVisualizations();
    this.initTestimonialCarousel();
    this.initAnimatedStatistics();
    this.initInteractiveCharts();
    this.initScrollStory();
    this.initContentAnimations();
  }
  /* ===============================
     TIMELINE INTERACTIVE
     =============================== */
  initInteractiveTimeline() {
    const timeline = document.querySelector(".interactive-timeline");
    if (!timeline) return;
    const timelineItems = timeline.querySelectorAll(".timeline-item");
    const timelineProgress = timeline.querySelector(".timeline-progress");
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-50px"
    };
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          this.updateTimelineProgress();
        }
      });
    }, observerOptions);
    timelineItems.forEach((item) => {
      timelineObserver.observe(item);
      const node = document.createElement("div");
      node.className = "timeline-node";
      node.addEventListener("click", () => this.focusTimelineItem(item));
      item.appendChild(node);
    });
    window.addEventListener("scroll", () => this.updateTimelineProgress());
  }
  updateTimelineProgress() {
    const timeline = document.querySelector(".interactive-timeline");
    if (!timeline) return;
    const timelineProgress = timeline.querySelector(".timeline-progress");
    const timelineItems = timeline.querySelectorAll(".timeline-item.revealed");
    const totalItems = timeline.querySelectorAll(".timeline-item").length;
    const progress = timelineItems.length / totalItems * 100;
    timelineProgress.style.height = `${progress}%`;
  }
  focusTimelineItem(item) {
    document.querySelectorAll(".timeline-node").forEach((node2) => {
      node2.classList.remove("active");
    });
    const node = item.querySelector(".timeline-node");
    node.classList.add("active");
    item.scrollIntoView({ behavior: "smooth", block: "center" });
    this.createTimelineParticles(node);
  }
  createTimelineParticles(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 4px;
        height: 4px;
        background: var(--accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(particle);
      const angle = i / 8 * Math.PI * 2;
      const distance = 50;
      const targetX = centerX + Math.cos(angle) * distance;
      const targetY = centerY + Math.sin(angle) * distance;
      particle.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0)`, opacity: 0 }
      ], {
        duration: 800,
        easing: "ease-out"
      }).onfinish = () => particle.remove();
    }
  }
  /* ===============================
     VISUALISATIONS DE COMPÉTENCES AVANCÉES
     =============================== */
  initAdvancedSkillsVisualizations() {
    this.initSkillBars();
    this.initRadarChart();
    this.initSkillsMatrix();
  }
  initSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progress = entry.target;
          const percentage = progress.dataset.percentage || "0";
          setTimeout(() => {
            progress.style.width = `${percentage}%`;
          }, Math.random() * 500);
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    skillBars.forEach((bar) => skillObserver.observe(bar));
  }
  initRadarChart() {
    const radarContainer = document.querySelector(".radar-chart");
    if (!radarContainer) return;
    const skills = [
      { name: "Frontend", value: 90 },
      { name: "Backend", value: 85 },
      { name: "Mobile", value: 95 },
      { name: "DevOps", value: 75 },
      { name: "Data", value: 80 },
      { name: "UI/UX", value: 85 }
    ];
    this.createRadarChart(radarContainer, skills);
  }
  createRadarChart(container, skills) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("radar-svg");
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 120;
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const radius = maxRadius / levels * i;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", centerX);
      circle.setAttribute("cy", centerY);
      circle.setAttribute("r", radius);
      circle.classList.add("radar-grid");
      svg.appendChild(circle);
    }
    const angleStep = 2 * Math.PI / skills.length;
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", centerX);
      line.setAttribute("y1", centerY);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      line.classList.add("radar-axis");
      svg.appendChild(line);
      const labelX = centerX + Math.cos(angle) * (maxRadius + 20);
      const labelY = centerY + Math.sin(angle) * (maxRadius + 20);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", labelX);
      label.setAttribute("y", labelY);
      label.textContent = skill.name;
      label.classList.add("radar-label");
      svg.appendChild(label);
    });
    const dataPoints = skills.map((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const radius = skill.value / 100 * maxRadius;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });
    const pathData = dataPoints.map(
      (point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    ).join(" ") + " Z";
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.classList.add("radar-area");
    svg.appendChild(path);
    dataPoints.forEach((point, index) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", point.x);
      circle.setAttribute("cy", point.y);
      circle.classList.add("radar-point");
      circle.addEventListener("mouseenter", () => this.showSkillTooltip(skills[index], point));
      circle.addEventListener("mouseleave", () => this.hideSkillTooltip());
      svg.appendChild(circle);
    });
    container.appendChild(svg);
  }
  showSkillTooltip(skill, point) {
    const tooltip = document.createElement("div");
    tooltip.className = "skill-tooltip";
    tooltip.style.cssText = `
      position: fixed;
      left: ${point.x}px;
      top: ${point.y}px;
      background: rgba(18, 18, 27, 0.95);
      border: 1px solid var(--primary);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      color: var(--text);
      font-size: 0.875rem;
      z-index: 1000;
      pointer-events: none;
      transform: translate(-50%, -100%);
    `;
    tooltip.innerHTML = `<strong>${skill.name}</strong><br>${skill.value}%`;
    document.body.appendChild(tooltip);
  }
  hideSkillTooltip() {
    const tooltip = document.querySelector(".skill-tooltip");
    if (tooltip) tooltip.remove();
  }
  initSkillsMatrix() {
    const skillItems = document.querySelectorAll(".skill-item");
    skillItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, index * 100);
    });
  }
  /* ===============================
     CARROUSEL DE TÉMOIGNAGES
     =============================== */
  initTestimonialCarousel() {
    this.testimonials = [
      {
        content: "Yohann a d\xE9velopp\xE9 une application mobile exceptionnelle pour notre entreprise. Son expertise en Flutter et sa compr\xE9hension des besoins utilisateur ont fait la diff\xE9rence.",
        author: "Sarah Chen",
        position: "CEO, TechStart",
        avatar: "SC"
      },
      {
        content: "Un d\xE9veloppeur fullstack remarquable qui ma\xEEtrise parfaitement les technologies modernes. Livraison rapide et code de qualit\xE9 professionnelle.",
        author: "Marc Dubois",
        position: "CTO, InnovateLab",
        avatar: "MD"
      },
      {
        content: "Collaboration excellente sur notre projet d'IA. Yohann combine parfaitement d\xE9veloppement et data science pour cr\xE9er des solutions innovantes.",
        author: "Dr. Elena Rodriguez",
        position: "Head of AI, DataCorp",
        avatar: "ER"
      }
    ];
    this.createTestimonialCarousel();
    this.startTestimonialAutoplay();
  }
  createTestimonialCarousel() {
    const container = document.querySelector(".testimonials-carousel");
    if (!container) return;
    const track = container.querySelector(".testimonials-track");
    const controlsContainer = container.querySelector(".carousel-controls");
    track.innerHTML = this.testimonials.map((testimonial) => `
      <div class="testimonial-slide">
        <p class="testimonial-content">${testimonial.content}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${testimonial.avatar}</div>
          <div class="testimonial-info">
            <h4>${testimonial.author}</h4>
            <p>${testimonial.position}</p>
          </div>
        </div>
      </div>
    `).join("");
    controlsContainer.innerHTML = `
      <button class="carousel-btn carousel-prev">
        <i class="ri-arrow-left-line"></i>
      </button>
      <div class="carousel-indicators">
        ${this.testimonials.map(
      (_, index) => `<div class="carousel-indicator ${index === 0 ? "active" : ""}" data-index="${index}"></div>`
    ).join("")}
      </div>
      <button class="carousel-btn carousel-next">
        <i class="ri-arrow-right-line"></i>
      </button>
    `;
    container.querySelector(".carousel-prev").addEventListener("click", () => this.prevTestimonial());
    container.querySelector(".carousel-next").addEventListener("click", () => this.nextTestimonial());
    container.querySelectorAll(".carousel-indicator").forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToTestimonial(index));
    });
  }
  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    this.updateTestimonialCarousel();
  }
  prevTestimonial() {
    this.currentTestimonial = this.currentTestimonial === 0 ? this.testimonials.length - 1 : this.currentTestimonial - 1;
    this.updateTestimonialCarousel();
  }
  goToTestimonial(index) {
    this.currentTestimonial = index;
    this.updateTestimonialCarousel();
  }
  updateTestimonialCarousel() {
    const track = document.querySelector(".testimonials-track");
    const indicators = document.querySelectorAll(".carousel-indicator");
    if (track) {
      track.style.transform = `translateX(-${this.currentTestimonial * 100}%)`;
    }
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentTestimonial);
    });
  }
  startTestimonialAutoplay() {
    setInterval(() => {
      if (!document.querySelector(".testimonials-carousel:hover")) {
        this.nextTestimonial();
      }
    }, 5e3);
  }
  /* ===============================
     STATISTIQUES ANIMÉES
     =============================== */
  initAnimatedStatistics() {
    this.stats = [
      { number: 50, label: "Projets R\xE9alis\xE9s", icon: "ri-folder-line", suffix: "+" },
      { number: 3, label: "Ann\xE9es d'Exp\xE9rience", icon: "ri-time-line", suffix: "+" },
      { number: 15, label: "Technologies Ma\xEEtris\xE9es", icon: "ri-code-line", suffix: "+" },
      { number: 100, label: "Satisfaction Client", icon: "ri-heart-line", suffix: "%" }
    ];
    this.createStatCards();
    this.animateStatsOnScroll();
  }
  createStatCards() {
    const statsGrid = document.querySelector(".stats-grid");
    if (!statsGrid) return;
    statsGrid.innerHTML = this.stats.map((stat) => `
      <div class="stat-card">
        <div class="stat-icon">
          <i class="${stat.icon}"></i>
        </div>
        <div class="stat-number" data-target="${stat.number}" data-suffix="${stat.suffix}">0${stat.suffix}</div>
        <div class="stat-label">${stat.label}</div>
        <svg class="stat-progress-ring" width="120" height="120">
          <circle class="progress-ring-circle" cx="60" cy="60" r="45"></circle>
        </svg>
      </div>
    `).join("");
  }
  animateStatsOnScroll() {
    const statCards = document.querySelectorAll(".stat-card");
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateStatCard(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statCards.forEach((card) => statsObserver.observe(card));
  }
  animateStatCard(card) {
    const numberElement = card.querySelector(".stat-number");
    const target = parseInt(numberElement.dataset.target);
    const suffix = numberElement.dataset.suffix;
    const duration = 2e3;
    const startTime = performance.now();
    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(target * this.easeOutCubic(progress));
      numberElement.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };
    requestAnimationFrame(updateNumber);
  }
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  /* ===============================
     GRAPHIQUES INTERACTIFS
     =============================== */
  initInteractiveCharts() {
    this.createBarChart();
    this.createSkillsDistribution();
  }
  createBarChart() {
    const barChart = document.querySelector(".bar-chart");
    if (!barChart) return;
    const data = [
      { label: "Frontend", value: 90 },
      { label: "Backend", value: 85 },
      { label: "Mobile", value: 95 },
      { label: "DevOps", value: 75 },
      { label: "Data", value: 80 }
    ];
    barChart.innerHTML = data.map((item) => `
      <div class="bar" style="height: ${item.value}%" data-value="${item.value}">
        <div class="bar-value">${item.value}%</div>
        <div class="bar-label">${item.label}</div>
      </div>
    `).join("");
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".bar").forEach((bar, index) => {
            setTimeout(() => {
              bar.style.height = bar.dataset.value + "%";
            }, index * 200);
          });
          chartObserver.unobserve(entry.target);
        }
      });
    });
    chartObserver.observe(barChart);
  }
  createSkillsDistribution() {
    const skillsData = [
      { name: "Development", percentage: 40, color: "#9D4EDD" },
      { name: "Data Science", percentage: 25, color: "#00F5FF" },
      { name: "DevOps", percentage: 20, color: "#39FF14" },
      { name: "Design", percentage: 15, color: "#FF6B35" }
    ];
  }
  /* ===============================
     STORYTELLING AU SCROLL
     =============================== */
  initScrollStory() {
    const storyElements = document.querySelectorAll(".story-section");
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          this.triggerStoryAnimation(entry.target);
        }
      });
    }, { threshold: 0.6 });
    storyElements.forEach((element) => storyObserver.observe(element));
  }
  triggerStoryAnimation(element) {
    const step = element.querySelector(".story-step");
    if (step) {
      step.style.transform = "translateX(0)";
      step.style.opacity = "1";
    }
  }
  /* ===============================
     ANIMATIONS DE CONTENU
     =============================== */
  initContentAnimations() {
    this.initScrollReveal();
    this.initHoverEffects();
    this.initParallaxElements();
  }
  initScrollReveal() {
    const revealElements = document.querySelectorAll(
      ".fade-in-up, .slide-in-left, .slide-in-right, .scale-in"
    );
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach((element) => revealObserver.observe(element));
  }
  initHoverEffects() {
    const interactiveElements = document.querySelectorAll(
      ".timeline-content, .skill-category, .testimonial-slide, .stat-card"
    );
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        element.style.transform = "translateY(-5px) scale(1.02)";
      });
      element.addEventListener("mouseleave", () => {
        element.style.transform = "translateY(0) scale(1)";
      });
    });
  }
  initParallaxElements() {
    const parallaxElements = document.querySelectorAll(".timeline-track, .radar-chart");
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach((element) => {
        const rate = scrolled * -0.1;
        element.style.transform = `translateY(${rate}px)`;
      });
    });
  }
  /* ===============================
     MÉTHODES UTILITAIRES
     =============================== */
  createParticleExplosion(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: var(--primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(particle);
      const angle = i / count * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;
      particle.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${targetX - x}px, ${targetY - y}px) scale(0)`, opacity: 0 }
      ], {
        duration: 600 + Math.random() * 400,
        easing: "ease-out"
      }).onfinish = () => particle.remove();
    }
  }
  addStaggeredAnimation(elements, className, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(className);
      }, index * delay);
    });
  }
  observeElementsForAnimation(selector, callback, options = {}) {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: "0px",
      ...options
    });
    elements.forEach((element) => observer.observe(element));
    return observer;
  }
};
var ContentPerformanceManager = class {
  constructor() {
    this.init();
  }
  init() {
    this.optimizeAnimations();
    this.lazyLoadCharts();
    this.enableReducedMotion();
  }
  optimizeAnimations() {
    const animatedElements = document.querySelectorAll(".timeline-progress, .skill-progress");
    animatedElements.forEach((element) => {
      element.style.willChange = "transform, width";
    });
  }
  lazyLoadCharts() {
    const chartContainers = document.querySelectorAll(".radar-chart, .bar-chart");
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("chart-loaded");
          chartObserver.unobserve(entry.target);
        }
      });
    });
    chartContainers.forEach((container) => chartObserver.observe(container));
  }
  enableReducedMotion() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("reduced-motion");
      const style = document.createElement("style");
      style.textContent = `
        .reduced-motion .timeline-progress,
        .reduced-motion .skill-progress,
        .reduced-motion .radar-area {
          animation: none !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
};
function initContentEnhancements() {
  const boot = () => {
    new ContentEnhancementManager();
    new ContentPerformanceManager();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}

// src/js/main.js
var bootstrap = () => {
  initNavigation();
  initContentEnhancements();
};
bootstrap();
export {
  bootstrap
};
//# sourceMappingURL=main.js.map
