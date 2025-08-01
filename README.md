# Mubin Attar – Professional Portfolio [2025 Edition]

Welcome to the source code for my personal developer portfolio. This project is a modern, Python-themed showcase built with a full-stack architecture. It features a blazing-fast Vite-powered frontend and a headless Sanity CMS for dynamic content management.

### ✨ [**Live Demo**](https://mubinattar.netlify.app/) ✨

---

## 📁 Table of Contents

- [Architectural Overview](#architectural-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Running the Project Locally](#running-the-project-locally)
- [Deployment](#deployment)
- [Contact](#contact)

---

## 🏗️ Architectural Overview

This repository is structured as a **monorepo**, consisting of two main parts:

1. **`pythonic_portfolio/`** – The frontend application built using **Vite**. A vanilla JavaScript-based UI focused on performance, clean design, and responsiveness. It dynamically pulls content from the CMS.
2. **`sanity-studio/`** – The backend **Sanity Studio** project. It powers content management for projects, experiences, blogs, and more through a real-time GraphQL/data API.

This decoupled, headless architecture enables seamless content updates without requiring a frontend redeploy — following best practices in modern web development.

---

## 🚀 Core Features

- **Dynamic Content Fetching**  
  Projects, blogs, and experiences are managed through Sanity CMS and consumed by the frontend via live queries or build-time fetch.

- **High-Performance Frontend**  
  Powered by Vite, the frontend loads quickly and supports modern development tooling.

- **Custom Python-Themed UI**  
  A developer-centric visual style with dark mode, code snippets, and terminal-inspired UI blocks.

- **Responsive & Accessible Design**  
  Built with Tailwind CSS for fluid responsiveness and includes keyboard, ARIA, and reduced-motion support.

- **Smooth Animations**  
  GSAP and Intersection Observer are used to power on-scroll transitions without compromising performance.

- **Developer Tooling**  
  Git-based version control, modular architecture, and npm-based dependency management ensure professional-grade maintainability.

---

## 🛠️ Tech Stack

| Layer         | Tools / Libraries                                                              |
|--------------|----------------------------------------------------------------------------------|
| **Frontend**  | HTML5, CSS3, JavaScript (ES6+ Modules)                                          |
| **Build Tool**| [Vite](https://vitejs.dev/)                                                     |
| **CMS**       | [Sanity.io](https://www.sanity.io/) (Headless, Real-time)                       |
| **Styling**   | Tailwind CSS (via CDN), Custom Properties, Fluid `clamp()` Typography           |
| **Animations**| [GSAP](https://greensock.com/gsap/), CSS Transitions                            |
| **Libraries** | Swiper.js (for carousels)                                                       |
| **Deployment**| Netlify                                                                         |

---

## 🧑‍💻 Running the Project Locally

To run the full stack locally, you'll need to set up both the frontend and the Sanity Studio backend.

### 📦 Prerequisites

- [Node.js v18+](https://nodejs.org/en/)
- npm (comes with Node)
- An OpenAI API key *(if you're using an AI chatbot or other API-based features)*
- A Sanity project (free account at [sanity.io](https://www.sanity.io/))

---

### 🔹 1. Frontend (`pythonic_portfolio`)

```bash
# Navigate into the frontend directory
cd pythonic_portfolio

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Access the site at: [http://localhost:5173](http://localhost:5173)

---

### 🔹 2. Backend (`sanity-studio`)

```bash
# Navigate to the CMS studio
cd sanity-studio

# Install dependencies
npm install

# Start the Sanity Studio
npm run dev
```

Sanity Studio will run at: [http://localhost:3333](http://localhost:3333)

---

## 🚚 Deployment

This project uses **Netlify** for automatic deployment. Here's how it works:

- **Content Updates**: Use the deployed Sanity Studio to add/edit content. Changes reflect instantly without redeploying the frontend.
- **Code Updates**: Push commits to the main branch in GitHub.
- **Netlify CI/CD**: Netlify detects changes and runs the Vite build process, deploying the static assets to its global CDN.

**Netlify Settings:**
- **Base directory**: `pythonic_portfolio`
- **Publish directory**: `pythonic_portfolio/dist`
- **Build command**: `npm run build`

---

## 📬 Contact

For questions, ideas, or collaboration:

- 📧 Email: [sk.mubinattar@gmail.com](mailto:sk.mubinattar@gmail.com)  
- 💼 LinkedIn: [linkedin.com/in/mubinattar](https://www.linkedin.com/in/mubinattar)