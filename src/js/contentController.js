import { client } from './sanityClient.js';

class ContentController {
  constructor() {
    this.projectsContainer = document.querySelector('#featured_projects .swiper-wrapper');
    this.experienceContainer = document.querySelector('#experience .timeline-container');
    this.init();
  }

  async init() {

    // 2. Try fetching dynamic content, but handle errors gracefully
    try {
      const [projects, experiences] = await Promise.all([
        client.fetch('*[_type == "project"] | order(_createdAt asc)'),
        client.fetch('*[_type == "experience"] | order(startDate desc)')
      ]);

      this.handleProjects(projects);
      this.handleExperience(experiences);

    } catch (error) {
      console.error("Sanity fetch failed. Using fallback content for all sections.", error);
      this.renderFallbackProjects();
      this.renderFallbackExperience();
    }
  }

  handleProjects(projects) {
    if (this.projectsContainer) {
      if (projects && projects.length > 0) {
        this.renderDynamicProjects(projects);
      } else {
        this.renderFallbackProjects();
      }
      this.reinitializeProjectsSwiper();
    }
  }

  handleExperience(experiences) {
    if (this.experienceContainer) {
      if (experiences && experiences.length > 0) {
        this.renderDynamicExperience(experiences);
      } else {
        this.renderFallbackExperience();
      }
    }
  }

  // --- FALLBACK RENDERERS ---
  renderFallbackProjects() {
    console.log("Using fallback static content for Projects.");
    if (!this.projectsContainer) return;
    // UPDATED: The fallback data now includes repoUrl and liveUrl to match the new card structure
    const fallbackProjects = [
      { title: 'AI Sports Betting Bot', imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=AI+Sports+Bot', category: 'Python', description: 'Backend for ML predictions using XGBoost & neural networks. Built RESTful APIs for serving results with high accuracy predictions.', tech: ['Python', 'Django', 'RESTful APIs', 'XGBoost'], repoUrl: 'https://github.com/Mubin-Shaikh', liveUrl: '#' },
      { title: 'Hospital Management System', imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=Hospital+System', category: 'Healthcare', description: 'Contributed to a modular, enterprise-scale system for a healthcare provider, covering scheduling, records, and reporting.', tech: ['Python', 'Django', 'PostgreSQL'], repoUrl: 'https://github.com/Mubin-Shaikh', liveUrl: null },
      { title: 'B2B Web Platforms', imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=B2B+Platform', category: 'B2B', description: 'Developed features for 3+ B2B platforms in healthcare & e-commerce. Built responsive UIs and integrated third-party APIs.', tech: ['JavaScript', 'Bootstrap', 'API Integration'], repoUrl: 'https://github.com/Mubin-Shaikh', liveUrl: null },
      { title: 'E-commerce Backend API', imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=E-Commerce+API', category: 'E-commerce', description: 'Designed a RESTful API with DRF for an e-commerce site, handling users, products, and orders with secure authentication.', tech: ['Django', 'DRF', 'PostgreSQL'], repoUrl: 'https://github.com/Mubin-Shaikh', liveUrl: null },
      { title: 'Cloud Deployment Automation', imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=Cloud+Automation', category: 'DevOps', description: 'Scripts to automate deploying Django apps to AWS EC2, including S3 integration and CI/CD pipelines.', tech: ['Python', 'AWS', 'Boto3'], repoUrl: 'https://github.com/Mubin-Shaikh', liveUrl: null },
      { title: 'Data Analysis Pipeline', imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=Data+Pipeline', category: 'Data Science', description: 'Web scraping tool to gather data, processed with Pandas, and visualized to highlight key trends and insights.', tech: ['Python', 'Pandas', 'Web Scraping'], repoUrl: 'https://github.com/Mubin-Shaikh', liveUrl: null }
    ];
    this.projectsContainer.innerHTML = fallbackProjects.map(p => this.createProjectSlide(p)).join('');
  }

  renderFallbackExperience() {
    console.log("Using fallback static content for Experience.");
    if (!this.experienceContainer) return;
    const fallbackExperience = [
      { title: 'Software Engineer', company: 'Sevina Technologies', startDate: '2024-04', endDate: null, description: 'Architecting and deploying end-to-end <span class="text-brand-yellow font-semibold">AI/ML solutions for predictive sports analytics and financial trading signals.</span> Pioneering automation initiatives by leveraging modern AI frameworks to streamline internal workflows.', icon: 'fa-briefcase' },
      { title: 'Junior Python Developer', company: 'Linescripts Software Pvt Ltd', startDate: '2022-11', endDate: '2024-04', description: 'Engineered and delivered full-stack features for multiple enterprise-grade applications across the <span class="text-brand-yellow">e-commerce and healthcare</span> sectors, specializing in building scalable backend systems with Django.', icon: 'fa-code' },
      { title: 'Master of Computer Application', company: 'Savitribai Phule University of Pune', startDate: '2018', endDate: '2021', description: 'Achieved a First-Class distinction (A Grade) with an <span class="text-brand-yellow font-semibold">8.01 CGPA</span>. Focused on core computer science concepts, including data structures, algorithms, and software design patterns.', icon: 'fa-graduation-cap', isEducation: true }
    ];
    this.experienceContainer.innerHTML = `<div class="timeline-bar" aria-hidden="true"></div>` + fallbackExperience.map((exp, index) => this.createExperienceItem(exp, index)).join('');
  }

  // --- DYNAMIC RENDERERS ---
  renderDynamicProjects(projects) {
    const urlFor = (source) => `https://cdn.sanity.io/images/9koh6yu9/production/${source.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
    this.projectsContainer.innerHTML = projects.map(p => {
      const projectData = {
        title: p.title,
        imgSrc: p.mainImage ? urlFor(p.mainImage) : 'https://placehold.co/600x400',
        category: p.category || 'Code',
        description: p.description,
        tech: p.technologies || [],
        liveUrl: p.liveSiteUrl,
        repoUrl: p.repositoryUrl
      };
      return this.createProjectSlide(projectData);
    }).join('');
  }

  renderDynamicExperience(experiences) {
    this.experienceContainer.innerHTML = `<div class="timeline-bar" aria-hidden="true"></div>` + experiences.map((exp, index) => {
      const expData = {
        title: exp.jobTitle,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        icon: exp.isEducation ? 'fa-graduation-cap' : 'fa-briefcase',
        isEducation: exp.isEducation
      };
      return this.createExperienceItem(expData, index);
    }).join('');
  }

  reinitializeProjectsSwiper() {
    const swiperController = window.portfolioApp?.getController('projectsSwiper');
    swiperController?.initializeSwiper();
  }

  // --- CREATION HELPERS ---
  createProjectSlide(project) {
    const techBadges = project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('');
    const image = project.imgSrc || 'https://placehold.co/600x400/0a0a0a/ffffff?text=Project';
    const categoryIcon = {
      'Python': 'fab fa-python', 'Healthcare': 'fas fa-hospital', 'B2B': 'fas fa-building',
      'E-commerce': 'fas fa-shopping-cart', 'DevOps': 'fas fa-cloud', 'Data Science': 'fas fa-chart-line'
    }[project.category] || 'fas fa-code';

    // This is the new, more professional HTML structure for the project cards
    return `
      <div class="swiper-slide h-auto" role="group" aria-label="Project: ${project.title}">
          <article class="project-card group">
              <figure class="project-image-container">
                  <img src="${image}" alt="${project.title} Project" class="project-image">
                  <figcaption class="project-category-badge">
                      <i class="${categoryIcon} mr-2" aria-hidden="true"></i>${project.category}
                  </figcaption>
              </figure>

              <div class="project-card-body">
                  <header class="project-card-header">
                      <h3 class="text-xl font-bold text-white font-heading">${project.title}</h3>
                      <div class="project-links">
                          ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn" aria-label="View source code for ${project.title} on GitHub"><i class="fab fa-github"></i></a>` : ''}
                          ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn" aria-label="View live demo of ${project.title}"><i class="fas fa-external-link-alt"></i></a>` : ''}
                      </div>
                  </header>
                  <p class="text-neutral-400 my-4 text-sm flex-grow">${project.description}</p>
                  <footer class="project-tech-badges" role="list" aria-label="Technologies used">
                      ${techBadges}
                  </footer>
              </div>
          </article>
      </div>`;
  }

  createExperienceItem(exp, index) {
    const isLeft = index % 2 !== 0;
    const formatDate = (dateStr) => {
      if (!dateStr || !dateStr.includes('-')) return dateStr; // Handle year-only dates like "2018"
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    const dateRange = exp.endDate
      ? `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
      : `${formatDate(exp.startDate)} - Present`;

    return `
      <article class="timeline-item gsap-timeline-item relative flex items-start ${isLeft ? 'md:flex-row-reverse md:space-x-reverse' : ''} md:space-x-8">
        <div class="hidden md:block w-1/2 ${isLeft ? 'text-left pl-8' : 'text-right'} pt-1">
          <div class="inline-block bg-neutral-700/50 px-3 py-1 rounded-full">
            <time class="font-bold text-brand-yellow font-mono">${dateRange}</time>
          </div>
        </div>
        <div class="timeline-dot ${exp.isEducation ? 'bg-brand-yellow' : ''}" aria-hidden="true">
          <i class="fas ${exp.icon} ${exp.isEducation ? 'text-neutral-900' : 'text-white'}"></i>
        </div>
        <div class="w-full md:w-1/2 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'} ml-16 md:ml-0">
          <div class="glassmorphism-card">
            <h3 class="text-xl font-bold text-white font-heading">${exp.title}</h3>
            <p class="text-brand-blue-light font-semibold mb-2">${exp.company}</p>
            <div class="md:hidden mb-2">
              <time class="inline-block bg-neutral-700/50 px-2 py-1 rounded text-brand-yellow text-xs font-mono">${dateRange}</time>
            </div>
            <p class="text-neutral-300 text-sm">${exp.description}</p>
          </div>
        </div>
      </article>
    `;
  }

}

export const contentController = new ContentController();