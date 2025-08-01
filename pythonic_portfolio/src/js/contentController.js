import { client } from './sanityClient.js';
// NEW: Import the official image URL builder from the package we just installed
import imageUrlBuilder from '@sanity/image-url';

// NEW: Create a builder instance that is connected to our Sanity client
const builder = imageUrlBuilder(client);

// NEW: Define the correct, robust urlFor function
function urlFor(source) {
  return builder.image(source);
}

class ContentController {
  constructor() {
    this.projectsContainer = document.querySelector('#featured_projects .swiper-wrapper');
    this.experienceContainer = document.querySelector('#experience .timeline-container');
    this.init();
  }

  async init() {
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
    // ... (This method remains unchanged)
    console.log("Using fallback static content for Projects.");
    if (!this.projectsContainer) return;
    
    const fallbackProjects = [
      { 
        title: 'AI Sports Betting Bot', 
        imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=AI+Sports+Bot', 
        category: 'Python', 
        description: 'Engineered a predictive ML backend using XGBoost and Django REST Framework. Architected RESTful APIs to serve high-accuracy betting signals, enabling data-driven decision-making.', 
        tech: ['Python', 'Django', 'RESTful APIs', 'XGBoost'], 
        repoUrl: 'https://github.com/Mubin-Shaikh', 
        liveUrl: '#' 
      },
      { 
        title: 'Hospital Management System', 
        imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=Hospital+System', 
        category: 'Healthcare', 
        description: 'Developed key modules for an enterprise-grade hospital management system in Python and Django. Delivered robust features for patient scheduling and medical records, improving operational efficiency for healthcare staff.', 
        tech: ['Python', 'Django', 'PostgreSQL'], 
        repoUrl: 'https://github.com/Mubin-Shaikh', 
        liveUrl: null 
      },
      { 
        title: 'E-commerce Backend API', 
        imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=E-Commerce+API', 
        category: 'E-commerce', 
        description: 'Architected a scalable RESTful API with Django REST Framework to power an e-commerce platform. Implemented secure, token-based authentication and optimized database queries for handling products, users, and orders.', 
        tech: ['Django', 'DRF', 'PostgreSQL'], 
        repoUrl: 'https://github.com/Mubin-Shaikh', 
        liveUrl: null 
      },
      { 
        title: 'Cloud Deployment Automation', 
        imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=Cloud+Automation', 
        category: 'DevOps', 
        description: 'Automated the deployment of Django applications to AWS EC2 using Python and Boto3 scripts. Integrated with S3 for static asset storage and configured a CI/CD pipeline, reducing manual deployment time by over 90%.', 
        tech: ['Python', 'AWS', 'Boto3'], 
        repoUrl: 'https://github.com/Mubin-Shaikh', 
        liveUrl: null 
      },
      { 
        title: 'B2B Web Platforms', 
        imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=B2B+Platform', 
        category: 'B2B', 
        description: 'Developed features for 3+ B2B platforms in healthcare & e-commerce. Built responsive UIs and integrated third-party APIs.', 
        tech: ['JavaScript', 'Bootstrap', 'API Integration'], 
        repoUrl: 'https://github.com/Mubin-Shaikh', 
        liveUrl: null 
      },
      { 
        title: 'Data Analysis Pipeline', 
        imgSrc: 'https://placehold.co/600x400/0a0a0a/306998?text=Data+Pipeline', 
        category: 'Data Science', 
        description: 'Web scraping tool to gather data, processed with Pandas, and visualized to highlight key trends and insights.', 
        tech: ['Python', 'Pandas', 'Web Scraping'], 
        repoUrl: 'https://github.com/Mubin-Shaikh', 
        liveUrl: null 
      }
    ];
    this.projectsContainer.innerHTML = fallbackProjects.map(p => this.createProjectSlide(p)).join('');
  }

  renderFallbackExperience() {
    // ... (This method remains unchanged)
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
    // REMOVED the faulty urlFor function from here

    this.projectsContainer.innerHTML = projects.map(p => {
      const projectData = {
        title: p.title,
        // UPDATED: Use the correct urlFor function and the local fallback
        imgSrc: p.mainImage ? urlFor(p.mainImage).width(600).url() : '/img/placeholder.jpg',
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
    // ... (This method remains unchanged)
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
    // ... (This method remains unchanged)
    const swiperController = window.portfolioApp?.getController('projectsSwiper');
    swiperController?.initializeSwiper();
  }

  // --- CREATION HELPERS ---
  createProjectSlide(project) {
    // ... (This method remains unchanged)
    const techBadges = project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('');
    const image = project.imgSrc || 'https://placehold.co/600x400/0a0a0a/ffffff?text=Project';
    const categoryIcon = {
      'Python': 'fab fa-python', 'Healthcare': 'fas fa-hospital', 'B2B': 'fas fa-building',
      'E-commerce': 'fas fa-shopping-cart', 'DevOps': 'fas fa-cloud', 'Data Science': 'fas fa-chart-line'
    }[project.category] || 'fas fa-code';

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
    const isRight = index % 2 === 0; // Even items (0, 2, 4) are on the right

    const formatDate = (dateStr) => {
      if (!dateStr || !dateStr.includes('-')) return dateStr;
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    
    const dateRange = exp.endDate
      ? `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
      : `${formatDate(exp.startDate)} - Present`;

    const contentHTML = `
      <div class="timeline-item__content">
        <div class="glassmorphism-card">
          <h3 class="text-xl font-bold text-white font-heading">${exp.title}</h3>
          <p class="text-brand-blue-light font-semibold mb-2">${exp.company}</p>
          <div class="md:hidden mb-2">
            <time class="inline-block bg-neutral-700/50 px-2 py-1 rounded text-brand-yellow text-xs font-mono">${dateRange}</time>
          </div>
          <p class="text-neutral-300 text-sm">${exp.description}</p>
        </div>
      </div>
    `;

    const spacerHTML = `
      <div class="timeline-item__spacer hidden md:block">
          <div class="inline-block bg-neutral-700/50 px-3 py-1 rounded-full">
            <time class="font-bold text-brand-yellow font-mono">${dateRange}</time>
          </div>
      </div>
    `;

    return `
      <article class="timeline-item gsap-timeline-item">
        ${isRight ? spacerHTML + '<div class="timeline-dot-wrapper">' : contentHTML + '<div class="timeline-dot-wrapper">'}
        <div class="timeline-dot ${exp.isEducation ? 'bg-brand-yellow' : ''}" aria-hidden="true">
          <i class="fas ${exp.icon} ${exp.isEducation ? 'text-neutral-900' : 'text-white'}"></i>
        </div>
        ${isRight ? '</div>' + contentHTML : '</div>' + spacerHTML}
      </article>
    `;
  }
}

export const contentController = new ContentController();