document.addEventListener('DOMContentLoaded', function () {

    // This is the main entry point. Once the HTML document is fully loaded and parsed,
    // this function runs and calls all the initialization functions for the different
    // interactive components on the page.
    initMobileMenu();
    initNavScroll();
    initTypingEffect();
    initSwiper();
    initScrollAnimations();
    initHeroAuroraEffect();
    initScrollToTop();
    initContactForm();

    // --- COMPONENT INITIALIZATIONS ---

    /**
     * Handles the logic for the mobile navigation menu.
     * It toggles the menu's visibility and swaps the open/close icons when the
     * menu button is clicked. It also ensures the menu closes when a link is clicked.
     */
    function initMobileMenu() {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        const openIcon = document.getElementById('menu-open-icon');
        const closeIcon = document.getElementById('menu-close-icon');

        if (!button || !menu || !openIcon || !closeIcon) return; // Defensive check

        const toggleMenu = () => {
            menu.classList.toggle('hidden');
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        };

        button.addEventListener('click', toggleMenu);

        // Add event listener to each link inside the mobile menu
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // If the menu is open, close it
                if (!menu.classList.contains('hidden')) {
                    toggleMenu();
                }
            });
        });
    }

    /**
     * Adds a subtle shadow to the main navigation bar when the user scrolls down.
     * This adds depth and visually separates the sticky nav from the page content.
     */
    function initNavScroll() {
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (nav) {
                // Toggles the 'shadow-lg' class if scrollY is greater than 50, removes it otherwise.
                nav.classList.toggle('shadow-lg', window.scrollY > 50);
            }
        });
    }

    /**
     * Creates a typewriter animation for the code snippet in the hero section.
     * It types out each line of code character by character for a dynamic effect.
     */
    function initTypingEffect() {
        const codeEl = document.getElementById('code-snippet');
        if (!codeEl) return;

        const codeLines = [
            '<span class="text-brand-blue-dark">def</span> <span class="text-brand-yellow">ignite_vision</span>(<span class="text-brand-yellow-light">idea</span>):',
            '    <span class="text-gray-500"># Crafting intelligent web solutions with Python, Django & ML</span>',
            '    insights = <span class="text-white">weave_ml_magic</span>(idea)',
            '    app = <span class="text-white">sculpt_django_platform</span>(insights)',
            '    <span class="text-brand-blue-dark">return</span> <span class="text-green-400">f"{app}: Where ideas meet innovation!"</span>'
        ];
        let currentLine = 0, currentChar = 0;

        function typeCode() {
            if (currentLine >= codeLines.length) {
                // Animation finished, show the full code with a blinking cursor
                codeEl.innerHTML = codeLines.join('<br>') + '<span class="typing-cursor"></span>';
                return;
            }
            if (currentChar < codeLines[currentLine].length) {
                // Type the next character
                codeEl.innerHTML = codeLines.slice(0, currentLine).join('<br>') + '<br>' + codeLines[currentLine].substring(0, currentChar + 1);
                currentChar++;
                setTimeout(typeCode, 25); // Speed of typing
            } else {
                // Finished a line, move to the next one
                currentLine++;
                currentChar = 0;
                setTimeout(typeCode, 200); // Pause between lines
            }
        }
        typeCode();
    }

    /**
     * Initializes the Swiper.js library for the featured projects carousel.
     * Configures the slider to be responsive, autoplay, and include navigation/pagination.
     */
    function initSwiper() {
        if (typeof Swiper === 'undefined') {
            console.error('Swiper library is not loaded.');
            return;
        };
        new Swiper('.swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            // Responsive breakpoints
            breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
        });
    }

    /**
     * Uses the Intersection Observer API to trigger CSS animations on elements
     * as they scroll into the viewport. This is a performant way to handle scroll-based animations.
     */
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get animation classes from data attribute, or use a default
                    const animationClasses = entry.target.dataset.animationClasses || 'animate__animated animate__fadeInUp';
                    entry.target.classList.add(...animationClasses.split(' '));
                    // Stop observing the element once it has been animated
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        // Observe all elements with the 'data-observer-target' attribute
        document.querySelectorAll('[data-observer-target]').forEach(el => observer.observe(el));
    }

    /**
     * Creates an interactive aurora/spotlight effect in the hero section that follows the mouse.
     * It updates CSS Custom Properties, which are used by the CSS to position the background gradient.
     */
    function initHeroAuroraEffect() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        hero.addEventListener('mousemove', e => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hero.style.setProperty('--mouse-x', `${x}px`);
            hero.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    /**
     * Manages the "Scroll to Top" button.
     * The button appears when the user scrolls down a certain amount and, when clicked,
     * smoothly scrolls the page back to the top.
     */
    function initScrollToTop() {
        const button = document.getElementById('scroll-to-top');
        if (!button) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.classList.remove('opacity-0', '-translate-y-4');
            } else {
                button.classList.add('opacity-0', '-translate-y-4');
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * Handles the contact form submission using AJAX to prevent a page reload.
     * It sends the form data to Web3Forms, disables the submit button during the request,
     * and displays success or error messages to the user.
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const submitButton = document.getElementById('submit-button');
        const resultDiv = document.getElementById('form-result');

        if (!form || !submitButton || !resultDiv) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission (page reload)
            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            // Provide immediate feedback to the user
            resultDiv.innerHTML = '<p class="text-brand-yellow">Sending...</p>';
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50', 'cursor-not-allowed');

            // Send the data to the Web3Forms API endpoint
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    // On success, show the success message and clear the form
                    resultDiv.innerHTML = `<p class="text-green-400">${jsonResponse.message}</p>`;
                    form.reset();
                } else {
                    // On error, show the error message from the server
                    console.error(jsonResponse);
                    resultDiv.innerHTML = `<p class="text-red-400">${jsonResponse.message}</p>`;
                }
            })
            .catch(error => {
                // Handle network errors
                console.error(error);
                resultDiv.innerHTML = '<p class="text-red-400">Something went wrong!</p>';
            })
            .finally(() => {
                // This block runs regardless of success or failure
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');

                // Clear the result message after 5 seconds
                setTimeout(() => {
                    resultDiv.innerHTML = '';
                }, 5000);
            });
        });
    }
});