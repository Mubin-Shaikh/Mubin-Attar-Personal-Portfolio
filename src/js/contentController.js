import { client } from './sanityClient.js';

class ContentController {
  constructor() {
    this.projectsContainer = document.querySelector('#featured_projects .swiper-wrapper');
    this.experienceContainer = document.querySelector('#experience .timeline-container');
    // We also need the skills container
    this.skillsContainer = document.querySelector('#technical_expertise .swiper-wrapper');
    this.init();
  }

  async init() {
    try {
      // Fetch all content in parallel for speed
      const [projects, experiences] = await Promise.all([
        this.fetchProjects(),
        this.fetchExperience()
      ]);

      // Render projects or fallback
      if (this.projectsContainer) {
        if (projects && projects.length > 0) {
          this.renderProjects(projects);
        } else {
          this.renderFallbackProjects();
        }
      }

      // Render experience or fallback
      if (this.experienceContainer) {
        if (experiences && experiences.length > 0) {
          this.renderExperience(experiences);
        } else {
          this.renderFallbackExperience();
        }
      }

    } catch (error) {
      console.error("Sanity fetch failed, using fallback content:", error);
      this.renderFallbackProjects();
      this.renderFallbackExperience();
    }
    
    // The skills scroller is always static, so we render it here
    if (this.skillsContainer) {
        this.renderSkills();
    }
  }

  // --- NEW: FALLBACK RENDERERS ---
  renderFallbackProjects() {
    console.log("Using fallback static content for Projects.");
    if (!this.projectsContainer) return;
    const fallbackProjectHTML = `
      <div class="swiper-slide h-auto">
        <article class="glassmorphism-card h-full border border-neutral-700 group">
          <div class="h-full flex flex-col">
            <div class="relative overflow-hidden rounded-t-xl">
              <img src="https://placehold.co/600x400/0a0a0a/306998?text=AI+Sports+Bot" alt="AI Sports Betting Bot Project" class="aspect-video w-full object-cover">
              <nav class="absolute inset-0 bg-black/70 flex items-center justify-center space-x-6 opacity-0 group-hover:opacity-100"><a href="https://github.com/Mubin-Shaikh" target="_blank" rel="noopener noreferrer" class="text-white hover:text-brand-yellow p-3"><i class="fab fa-github fa-2x"></i></a></nav>
              <div class="absolute top-4 left-4 bg-brand-blue/80 px-2 py-1 rounded text-white text-xs font-mono"><i class="fab fa-python mr-1"></i>Python</div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
              <h3 class="text-xl font-bold">AI Sports Betting Bot</h3>
              <p class="text-gray-400 mb-4 text-sm flex-grow">Backend for ML predictions using XGBoost & neural networks.</p>
            </div>
          </div>
        </article>
      </div>`;
    this.projectsContainer.innerHTML = fallbackProjectHTML;
    this.reinitializeSwiper();
  }

  renderFallbackExperience() {
    console.log("Using fallback static content for Experience.");
    if (!this.experienceContainer) return;
    this.experienceContainer.innerHTML = `
      <div class="timeline-bar" aria-hidden="true"></div>
      <article class="timeline-item relative flex items-start md:space-x-8">
        <div class="hidden md:block w-1/2 text-right pt-1"><div class="inline-block bg-neutral-700/50 px-3 py-1 rounded-full"><time class="font-bold text-brand-yellow font-mono">Apr 2024 - Present</time></div></div>
        <div class="timeline-dot"><i class="fas fa-briefcase text-white"></i></div>
        <div class="w-full md:w-1/2 md:pl-8 ml-16 md:ml-0">
          <div class="glassmorphism-card">
            <h3 class="text-xl font-bold text-white font-heading">Software Engineer</h3>
            <p class="text-brand-blue-light font-semibold mb-2">Sevina Technologies</p>
            <p class="text-neutral-300 text-sm">Architecting and deploying end-to-end AI/ML solutions for predictive sports analytics.</p>
          </div>
        </div>
      </article>`;
  }
  
  // --- DYNAMIC RENDERERS ---
  renderProjects(projects) {
    this.projectsContainer.innerHTML = projects.map(p => this.createProjectSlide(p)).join('');
    this.reinitializeSwiper();
  }

  renderExperience(experiences) {
    this.experienceContainer.innerHTML = '<div class="timeline-bar" aria-hidden="true"></div>';
    experiences.forEach((exp, index) => {
        this.experienceContainer.innerHTML += this.createExperienceItem(exp, index);
    });
  }

  // Helper to re-initialize swiper
  reinitializeSwiper() {
    if (window.portfolioApp && window.portfolioApp.getController('projectsSwiper')) {
        const swiperInstance = window.portfolioApp.getController('projectsSwiper');
        swiperInstance.initializeSwiper();
    }
  }

  // --- DATA FETCHING & HTML TEMPLATES (No changes needed here) ---
  async fetchProjects() { /* ... unchanged ... */ }
  createProjectSlide(project) { /* ... unchanged ... */ }
  async fetchExperience() { /* ... unchanged ... */ }
  createExperienceItem(exp, index) { /* ... unchanged ... */ }

  // --- NEW: STATIC SKILLS RENDERER ---
  renderSkills() {
    const skillsData = [
        { icon: 'fa-star', title: 'Core Python Expertise', lang: 'python', content: `# Deep understanding of Python's idioms...\n- Object-Oriented Programming...\n- Functional constructs...\n- ...` },
        { icon: 'fa-cogs', title: 'Backend & API Design', lang: 'python', content: `# Architecting scalable solutions...\n- Django & FastAPI...\n- RESTful API design...\n- ...` },
        // ... add all 8 skills here in this format
    ];
    this.skillsContainer.innerHTML = skillsData.map(skill => this.createSkillSlide(skill)).join('');
    // Manually trigger highlight.js because we are creating this content dynamically
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('#technical_expertise pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
  }

  createSkillSlide({icon, title, lang, content}) {
    return `
        <div class="swiper-slide h-auto">
            <article class="glassmorphism-card h-full">
                <div class="flex items-center gap-4 mb-3">
                    <div class="text-brand-yellow" aria-hidden="true"><i class="fas ${icon} fa-2x"></i></div>
                    <h3 class="text-xl font-bold text-white font-heading">${title}</h3>
                </div>
                <div class="code-wrapper">
                    <pre><code class="language-${lang}">${content.trim()}</code></pre>
                </div>
            </article>
        </div>
    `;
  }
}

export const contentController = new ContentController();