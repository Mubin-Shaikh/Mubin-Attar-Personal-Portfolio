/**
 * Modern Portfolio JavaScript - 2025 Edition
 * Enhanced with scroll animations, smooth interactions, and accessibility
 */

// ===== UTILITY FUNCTIONS =====
const utils = {
  // Debounce function for performance optimization
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top <= windowHeight * (1 - threshold) &&
      rect.bottom >= windowHeight * threshold &&
      rect.left <= windowWidth * (1 - threshold) &&
      rect.right >= windowWidth * threshold
    );
  },

  // Smooth scroll to element
  smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000);
    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  },

  // Announce to screen readers
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
};

// ===== NAVIGATION CONTROLLER =====
class NavigationController {
  constructor() {
    this.nav = document.querySelector('.nav-backdrop');
    this.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.menuOpenIcon = document.getElementById('menu-open-icon');
    this.menuCloseIcon = document.getElementById('menu-close-icon');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollSpy();
    this.setupSmoothScroll();
  }

  setupEventListeners() {
    // Mobile menu toggle
    if (this.mobileMenuButton) {
      this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this.toggleMobileMenu();
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.mobileMenu.contains(e.target) && !this.mobileMenuButton.contains(e.target)) {
        this.toggleMobileMenu();
      }
    });

    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.toggleMobileMenu();
      }
    });

    // Scroll event for navbar styling
    window.addEventListener('scroll', utils.throttle(() => {
      this.updateNavbarOnScroll();
    }, 16));
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.isMenuOpen) {
      this.mobileMenu.classList.remove('hidden');
      this.menuOpenIcon.classList.add('hidden');
      this.menuCloseIcon.classList.remove('hidden');
      this.mobileMenuButton.setAttribute('aria-expanded', 'true');
      utils.announceToScreenReader('Menu opened');
    } else {
      this.mobileMenu.classList.add('hidden');
      this.menuOpenIcon.classList.remove('hidden');
      this.menuCloseIcon.classList.add('hidden');
      this.mobileMenuButton.setAttribute('aria-expanded', 'false');
      utils.announceToScreenReader('Menu closed');
    }
  }

  updateNavbarOnScroll() {
    if (window.scrollY > 100) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  setupScrollSpy() {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveNavLink(entry.target.id);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  updateActiveNavLink(activeId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          utils.smoothScrollTo(targetElement, 80);
          utils.announceToScreenReader(`Navigated to ${targetElement.querySelector('h1, h2, h3')?.textContent || targetId}`);
        }
      });
    });
  }
}

// ===== SCROLL ANIMATION CONTROLLER =====
class ScrollAnimationController {
  constructor() {
    this.observerTargets = document.querySelectorAll('[data-observer-target]');
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    this.observerTargets.forEach(target => {
      observer.observe(target);
    });
  }

  animateElement(element) {
    const animationClasses = element.dataset.animationClasses;
    const delay = element.dataset.animationDelay || 0;

    setTimeout(() => {
      if (animationClasses) {
        element.classList.add(...animationClasses.split(' '));
      } else {
        element.classList.add('animate-fade-in-up');
      }
    }, delay);
  }
}

// ===== PROJECTS SWIPER CONTROLLER =====
class ProjectsSwiperController {
  constructor() {
    this.swiperContainer = document.querySelector('.swiper');
    this.init();
  }

  init() {
    if (this.swiperContainer && typeof Swiper !== 'undefined') {
      this.initializeSwiper();
    }
  }

  initializeSwiper() {
    new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      a11y: {
        prevSlideMessage: 'Previous project',
        nextSlideMessage: 'Next project',
        paginationBulletMessage: 'Go to project {{index}}',
      },
    });
  }
}

// ===== CONTACT FORM CONTROLLER =====
class ContactFormController {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitButton = document.getElementById('submit-button');
    this.resultDiv = document.getElementById('form-result');
    this.init();
  }

  init() {
    if (this.form) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.setSubmitState(true);
    
    try {
      const formData = new FormData(this.form);
      
      // Simulate form submission (replace with actual endpoint)
      await this.simulateFormSubmission(formData);
      
      this.showResult('success', 'Message sent successfully! I\'ll get back to you soon.');
      this.form.reset();
      utils.announceToScreenReader('Message sent successfully');
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showResult('error', 'Failed to send message. Please try again or contact me directly.');
      utils.announceToScreenReader('Failed to send message');
    } finally {
      this.setSubmitState(false);
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      isValid = false;
    }

    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
      errorMessage = 'Name must be at least 2 characters long';
      isValid = false;
    }

    // Message validation
    if (fieldName === 'message' && value && value.length < 10) {
      errorMessage = 'Message must be at least 10 characters long';
      isValid = false;
    }

    this.showFieldError(field, errorMessage);
    return isValid;
  }

  showFieldError(field, message) {
    const errorId = `${field.name}-error`;
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'text-red-400 text-sm mt-1';
      errorElement.setAttribute('aria-live', 'polite');
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.classList.toggle('sr-only', !message);
    
    if (message) {
      field.classList.add('border-red-400');
      field.setAttribute('aria-describedby', errorId);
    } else {
      field.classList.remove('border-red-400');
      field.removeAttribute('aria-describedby');
    }
  }

  clearFieldError(field) {
    const errorId = `${field.name}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.add('sr-only');
    }
    
    field.classList.remove('border-red-400');
    field.removeAttribute('aria-describedby');
  }

  setSubmitState(isSubmitting) {
    const buttonText = this.submitButton.querySelector('span:not(.opacity-60)') || this.submitButton;
    const icon = this.submitButton.querySelector('i');
    
    if (isSubmitting) {
      this.submitButton.disabled = true;
      this.submitButton.classList.add('opacity-75', 'cursor-not-allowed');
      buttonText.textContent = 'Sending...';
      if (icon) {
        icon.className = 'fas fa-spinner fa-spin mr-2';
      }
      document.getElementById('submit-status').textContent = 'Sending message...';
    } else {
      this.submitButton.disabled = false;
      this.submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
      buttonText.textContent = 'Send Message';
      if (icon) {
        icon.className = 'fas fa-paper-plane mr-2 group-hover:translate-x-1 transition-transform duration-300';
      }
      document.getElementById('submit-status').textContent = '';
    }
  }

  showResult(type, message) {
    this.resultDiv.className = `text-center h-auto p-3 rounded ${
      type === 'success' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
    }`;
    this.resultDiv.textContent = message;
    
    setTimeout(() => {
      this.resultDiv.className = 'text-center h-6';
      this.resultDiv.textContent = '';
    }, 5000);
  }

  async simulateFormSubmission(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, you would send the data to your backend
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   body: formData
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    
    console.log('Form data:', Object.fromEntries(formData));
  }
}

// ===== SCROLL TO TOP CONTROLLER =====
class ScrollToTopController {
  constructor() {
    this.button = document.getElementById('scroll-to-top');
    this.init();
  }

  init() {
    if (this.button) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', utils.throttle(() => {
      this.toggleButtonVisibility();
    }, 100));

    // Scroll to top when clicked
    this.button.addEventListener('click', () => {
      utils.smoothScrollTo(document.body, 0);
      utils.announceToScreenReader('Scrolled to top of page');
    });
  }

  toggleButtonVisibility() {
    if (window.scrollY > 500) {
      this.button.classList.remove('hidden');
    } else {
      this.button.classList.add('hidden');
    }
  }
}

// ===== GAME HIGH SCORE CONTROLLER =====
class GameHighScoreController {
  constructor() {
    this.storageKey = 'snake-game-high-score';
    this.init();
  }

  init() {
    // Make functions available globally for PyScript
    window.getHighScore = () => this.getHighScore();
    window.setHighScore = (score) => this.setHighScore(score);
  }

  getHighScore() {
    try {
      return parseInt(localStorage.getItem(this.storageKey)) || 0;
    } catch (error) {
      console.warn('Could not access localStorage:', error);
      return 0;
    }
  }

  setHighScore(score) {
    try {
      const currentHigh = this.getHighScore();
      if (score > currentHigh) {
        localStorage.setItem(this.storageKey, score.toString());
        utils.announceToScreenReader(`New high score: ${score}`);
      }
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.monitorPageLoad();
    this.monitorScrollPerformance();
  }

  monitorPageLoad() {
    window.addEventListener('load', () => {
      // Use Performance API if available
      if ('performance' in window) {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Report Core Web Vitals if available
        if ('web-vital' in window) {
          this.reportWebVitals();
        }
      }
    });
  }

  monitorScrollPerformance() {
    let scrollCount = 0;
    let lastScrollTime = performance.now();

    window.addEventListener('scroll', utils.throttle(() => {
      scrollCount++;
      const currentTime = performance.now();
      
      // Log if scroll performance seems poor
      if (currentTime - lastScrollTime > 50) {
        console.warn('Slow scroll detected:', currentTime - lastScrollTime, 'ms');
      }
      
      lastScrollTime = currentTime;
    }, 16));
  }

  reportWebVitals() {
    // This would integrate with web-vitals library if included
    // getCLS(console.log);
    // getFID(console.log);
    // getFCP(console.log);
    // getLCP(console.log);
    // getTTFB(console.log);
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityController {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupReducedMotion();
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for interactive elements
    document.addEventListener('keydown', (e) => {
      // Skip to main content with Ctrl+/
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  setupFocusManagement() {
    // Ensure focus is visible and properly managed
    document.addEventListener('focusin', (e) => {
      // Add focus indicator class if needed
      e.target.classList.add('focus-visible');
    });

    document.addEventListener('focusout', (e) => {
      // Remove focus indicator class
      e.target.classList.remove('focus-visible');
    });
  }

  setupReducedMotion() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduce-motion');
    }

    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
    });
  }
}

// ===== THEME CONTROLLER =====
class ThemeController {
  constructor() {
    this.init();
  }

  init() {
    this.setupColorSchemeDetection();
  }

  setupColorSchemeDetection() {
    // Detect and respond to system color scheme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });

    // Set initial state
    if (darkModeQuery.matches) {
      document.body.classList.add('dark-mode');
    }
  }
}

// ===== MAIN APPLICATION CONTROLLER =====
class PortfolioApp {
  constructor() {
    this.controllers = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeControllers());
    } else {
      this.initializeControllers();
    }
  }

  initializeControllers() {
    try {
      // Initialize all controllers
      this.controllers.navigation = new NavigationController();
      this.controllers.scrollAnimation = new ScrollAnimationController();
      this.controllers.projectsSwiper = new ProjectsSwiperController();
      this.controllers.contactForm = new ContactFormController();
      this.controllers.scrollToTop = new ScrollToTopController();
      this.controllers.gameHighScore = new GameHighScoreController();
      this.controllers.performance = new PerformanceMonitor();
      this.controllers.accessibility = new AccessibilityController();
      this.controllers.theme = new ThemeController();

      console.log('Portfolio app initialized successfully');
      utils.announceToScreenReader('Portfolio loaded successfully');
      
    } catch (error) {
      console.error('Error initializing portfolio app:', error);
    }
  }

  // Public method to get controller instances
  getController(name) {
    return this.controllers[name];
  }
}

// ===== INITIALIZE APPLICATION =====
const portfolioApp = new PortfolioApp();

// Make app available globally for debugging
window.portfolioApp = portfolioApp;

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Lazy loading for images
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Service Worker registration for PWA capabilities
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
  setupLazyLoading();
  // registerServiceWorker(); // Uncomment if you have a service worker
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // In production, you might want to send this to an error reporting service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // In production, you might want to send this to an error reporting service
});

// ===== EXPORT FOR MODULE SYSTEMS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioApp, utils };
}

