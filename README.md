# Mubin Attar - Software Engineer & AI/ML Enthusiast Portfolio

This is a modern, dark-themed portfolio website for **Mubin Attar**, a Software Engineer specializing in Python, Django, and AI/ML. It showcases my skills, projects, and experience with a professional, Python-inspired design using blue (`#306998`) and yellow (`#FFD43B`) accents.

**Live Demo:** [**mubinattar.netlify.app**](http://mubinattar.netlify.app/)

## ✨ Features

- **Modern Python Theme:** Dark mode aesthetic with code snippets and a custom snake icon.
- **Fully Responsive Design:** Adapts seamlessly to desktops, tablets, and mobile devices.
- **Dynamic Animations:** Smooth scroll-triggered animations, interactive hover effects, and a live-typing hero section.
- **Interactive Project Slider:** A touch-friendly, slidable gallery showcasing key projects, powered by Swiper.js.
- **Comprehensive Sections:**
  - **About:** A brief introduction to my skills and passion.
  - **Expertise:** A breakdown of my technical capabilities.
  - **Projects:** An interactive showcase of my work.
  - **Experience:** A professional timeline of my career.
  - **Contact:** An easy way to get in touch.
- **Built with Modern Tools:** Crafted with HTML, Tailwind CSS, and vanilla JavaScript for a lightweight and fast experience.

## 🚀 Setup

To run this project locally, follow these steps:

1.  **Clone the Repository:**
    ```sh
    git clone https://github.com/Mubin-Shaikh/portfolio.git
    ```
    *(Note: This uses your actual GitHub username and a suggested repo name. Adjust if needed.)*

2.  **Navigate to the Directory:**
    ```sh
    cd portfolio
    ```

3.  **Run Locally:**
    Simply open the `index.html` file in your web browser. For the best experience, use a local server extension like **Live Server** in VS Code.

## 🌐 Hosting on GitHub Pages

You can easily host your own version of this portfolio on GitHub Pages.

1.  **Push to your GitHub:**
    Create a new repository on GitHub. Then, initialize and push your local project. Replace `your-username/your-repo-name` with your details.
    ```sh
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/your-username/your-repo-name.git
    git push -u main
    ```

2.  **Enable GitHub Pages:**
    - Go to your repository's **Settings** tab.
    - Navigate to the **Pages** section in the left sidebar.
    - Under "Build and deployment", select **main** as the source branch and `/ (root)` as the folder.
    - Your site will be live at `https://your-username.github.io/your-repo-name`.

## 🎨 Customization

This portfolio is designed to be easily customizable:

- **Content:** All content (About Me, Experience, Projects) is directly editable within the `index.html` file. Simply find the relevant section and update the text.
- **Contact Information:** Update your email and social media links (GitHub, LinkedIn) in the **Contact** and **Footer** sections.
- **Projects:** Add, remove, or edit project cards inside the `<div class="swiper-wrapper">` in the **Featured Projects** section.
- **Styling:** Colors and fonts can be easily changed in the `<script>` tag within the `<head>` where the `tailwind.config` is defined.

## 📝 License

This project is licensed under the **MIT License**.