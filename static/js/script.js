document.addEventListener('DOMContentLoaded', function () {

    // This is the main entry point. Once the HTML document is fully loaded and parsed,
    // this function runs and calls all the initialization functions for the different
    // interactive components on the page.
    initMobileMenu();
    initNavScroll();
    // initTypingEffect();
    // initSnakeGame();
    initSwiper();
    initScrollAnimations();
    initHeroAuroraEffect();
    initScrollToTop();
    initContactForm();
    initExperienceTimeline();

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
    // function initTypingEffect() {
    //     const codeEl = document.getElementById('code-snippet');
    //     if (!codeEl) return;

    //     // Your new, improved code lines!
    //     const codeLines = [
    //         '<span class="text-brand-blue-dark">def</span> <span class="text-brand-yellow">ignite_vision</span>(<span class="text-brand-yellow-light">idea</span>):',
    //         '    <span class="text-green-400">"""</span>',
    //         '    <span class="text-gray-400">🔍 From concept to code.</span>',
    //         '    <span class="text-gray-400">💡 Powered by Python.</span>',
    //         '    <span class="text-gray-400">🧠 Enhanced by ML.</span>',
    //         '    <span class="text-green-400">"""</span>',
    //         '    <span class="text-white">model</span> = <span class="text-brand-blue">infuse_with_intelligence</span>(idea)',
    //         '    <span class="text-white">app</span> = <span class="text-brand-blue">deploy_with_django</span>(model)',
    //         '    <span class="text-brand-blue-dark">return</span> <span class="text-green-400">f"{app} — Where smart ideas become real products."</span>'
    //     ];

    //     let currentLine = 0, currentChar = 0;

    //     function typeCode() {
    //         if (currentLine >= codeLines.length) {
    //             // Animation finished, show the full code with a blinking cursor
    //             codeEl.innerHTML = codeLines.join('<br>') + '<span class="typing-cursor"></span>';
    //             return;
    //         }
    //         if (currentChar < codeLines[currentLine].length) {
    //             // Type the next character
    //             codeEl.innerHTML = codeLines.slice(0, currentLine).join('<br>') + '<br>' + codeLines[currentLine].substring(0, currentChar + 1);
    //             currentChar++;
    //             setTimeout(typeCode, 25); // Speed of typing
    //         } else {
    //             // Finished a line, move to the next one
    //             currentLine++;
    //             currentChar = 0;
    //             setTimeout(typeCode, 200); // Pause between lines
    //         }
    //     }
    //     typeCode();
    // }


// static/js/script.js

    /**
     * Initializes and runs the enhanced interactive Snake game.
     */
    // function initSnakeGame() {
    //     // --- DOM Elements ---
    //     const canvas = document.getElementById('snake-canvas');
    //     if (!canvas) return;
    //     const ctx = canvas.getContext('2d');
        
    //     const instructionsEl = document.getElementById('game-instructions');
    //     const gameOverEl = document.getElementById('game-over-screen');
    //     const pausedEl = document.getElementById('game-paused-screen');
    //     const restartButton = document.getElementById('restart-button');
    //     const scoreEl = document.getElementById('score');
    //     const finalScoreEl = document.getElementById('final-score');
    //     const inGameScoreDisplay = document.getElementById('ingame-score-display');


    //     // --- Game Theming and Configuration ---
    //     const THEME_COLORS = {
    //         background: '#171717',
    //         food: '#4ade80', // Tailwind green-400
    //         snakeHead: '#FFD43B', // brand-yellow
    //         snakeBody: '#4B8BBE', // brand-blue-dark
    //         snakeEye: '#171717',
    //     };
    //     const GameState = {
    //         INSTRUCTIONS: 'instructions',
    //         RUNNING: 'running',
    //         PAUSED: 'paused',
    //         GAMEOVER: 'gameover',
    //     };
    //     let tileSize = 20;

    //     // --- Responsive Sizing ---
    //     let tileCountX, tileCountY;
    //     function setCanvasSize() {
    //         const container = canvas.parentElement;
    //         const style = getComputedStyle(container);
    //         const containerWidth = container.clientWidth - (parseInt(style.paddingLeft) + parseInt(style.paddingRight));
            
    //         tileCountX = Math.floor(containerWidth / tileSize);
    //         const aspectRatio = window.innerWidth < 640 ? (3/4) : (1/2); 
    //         tileCountY = Math.floor(tileCountX * aspectRatio);

    //         canvas.width = tileCountX * tileSize;
    //         canvas.height = tileCountY * tileSize;
    //     }

    //     // --- Game State ---
    //     let gameState, snake, food, direction, score, gameSpeed, lastUpdateTime, foodBlinkState;

    //     function resetGame() {
    //         // NEW: Initialize snake with a length of 3
    //         const startX = Math.floor(tileCountX / 2);
    //         const startY = Math.floor(tileCountY / 2);
    //         snake = [
    //             { x: startX, y: startY },
    //             { x: startX - 1, y: startY },
    //             { x: startX - 2, y: startY },
    //         ];
            
    //         spawnFood();
    //         direction = { x: 0, y: 0 }; // Start stationary
    //         score = 0;
    //         gameSpeed = 150; 
    //         lastUpdateTime = 0;
    //         foodBlinkState = true;
            
    //         updateUI(GameState.INSTRUCTIONS);
    //     }
        
    //     function gameLoop(currentTime) {
    //         window.requestAnimationFrame(gameLoop); 
    //         if (gameState !== GameState.RUNNING) return;
    //         const elapsed = currentTime - lastUpdateTime;
    //         if (elapsed > gameSpeed) {
    //             lastUpdateTime = currentTime;
    //             update();
    //             draw();
    //         }
    //     }

    //     function update() {
    //         if (direction.x === 0 && direction.y === 0) return;

    //         const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    //         if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
    //             return updateUI(GameState.GAMEOVER);
    //         }

    //         for (let i = 1; i < snake.length; i++) {
    //             if (head.x === snake[i].x && head.y === snake[i].y) {
    //                 return updateUI(GameState.GAMEOVER);
    //             }
    //         }
            
    //         snake.unshift(head);

    //         if (head.x === food.x && head.y === food.y) {
    //             score++;
    //             scoreEl.textContent = score;
    //             spawnFood();
    //             if (score % 5 === 0 && gameSpeed > 60) {
    //                 gameSpeed -= 10;
    //             }
    //         } else {
    //             snake.pop();
    //         }
    //     }

    //     // --- Advanced Drawing Functions ---
    //     function draw() {
    //         ctx.fillStyle = THEME_COLORS.background;
    //         ctx.fillRect(0, 0, canvas.width, canvas.height);
    //         drawFood();
    //         drawSnake();
    //     }

    //     function drawFood() {
    //         foodBlinkState = !foodBlinkState;
    //         if (!foodBlinkState) return;
    //         ctx.fillStyle = THEME_COLORS.food;
    //         ctx.beginPath();
    //         ctx.arc(food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 2, tileSize / 2.5, 0, 2 * Math.PI);
    //         ctx.fill();
    //     }
        
    //     function drawSnake() {
    //         for (let i = 0; i < snake.length; i++) {
    //             const segment = snake[i];
    //             const prev = snake[i + 1] || segment;
                
    //             // NEW: Alternating color logic for snake body
    //             if (i === 0) {
    //                 ctx.fillStyle = THEME_COLORS.snakeHead;
    //             } else {
    //                 // Odd segments are blue, even segments are yellow (head color)
    //                 ctx.fillStyle = (i % 2 !== 0) ? THEME_COLORS.snakeBody : THEME_COLORS.snakeHead;
    //             }
                
    //             ctx.beginPath();
    //             ctx.moveTo(segment.x * tileSize, segment.y * tileSize + tileSize / 2);
    //             ctx.arcTo(segment.x * tileSize, segment.y * tileSize, segment.x * tileSize + tileSize / 2, segment.y * tileSize, tileSize / 2);
    //             ctx.arcTo(segment.x * tileSize + tileSize, segment.y * tileSize, segment.x * tileSize + tileSize, segment.y * tileSize + tileSize / 2, tileSize / 2);
    //             ctx.arcTo(segment.x * tileSize + tileSize, segment.y * tileSize + tileSize, segment.x * tileSize + tileSize / 2, segment.y * tileSize + tileSize, tileSize / 2);
    //             ctx.arcTo(segment.x * tileSize, segment.y * tileSize + tileSize, segment.x * tileSize, segment.y * tileSize + tileSize / 2, tileSize / 2);
    //             ctx.closePath();
    //             ctx.fill();

    //             if (i < snake.length - 1) {
    //                 ctx.fillRect(
    //                     (segment.x + prev.x) / 2 * tileSize, 
    //                     (segment.y + prev.y) / 2 * tileSize, 
    //                     tileSize, 
    //                     tileSize
    //                 );
    //             }
    //         }
            
    //         const head = snake[0];
    //         const eyeSize = tileSize / 5;
    //         ctx.fillStyle = THEME_COLORS.snakeEye;
    //         let eyeDir = (direction.x === 0 && direction.y === 0) ? {x: 1, y: 0} : direction; // Default look right

    //         if (eyeDir.x === 1) { // Right
    //             ctx.fillRect(head.x * tileSize + tileSize/2, head.y * tileSize + eyeSize, eyeSize, eyeSize);
    //             ctx.fillRect(head.x * tileSize + tileSize/2, head.y * tileSize + 3 * eyeSize, eyeSize, eyeSize);
    //         } else if (eyeDir.x === -1) { // Left
    //             ctx.fillRect(head.x * tileSize + eyeSize, head.y * tileSize + eyeSize, eyeSize, eyeSize);
    //             ctx.fillRect(head.x * tileSize + eyeSize, head.y * tileSize + 3 * eyeSize, eyeSize, eyeSize);
    //         } else if (eyeDir.y === 1) { // Down
    //             ctx.fillRect(head.x * tileSize + eyeSize, head.y * tileSize + tileSize/2, eyeSize, eyeSize);
    //             ctx.fillRect(head.x * tileSize + 3*eyeSize, head.y * tileSize + tileSize/2, eyeSize, eyeSize);
    //         } else if (eyeDir.y === -1) { // Up
    //             ctx.fillRect(head.x * tileSize + eyeSize, head.y * tileSize + eyeSize, eyeSize, eyeSize);
    //             ctx.fillRect(head.x * tileSize + 3*eyeSize, head.y * tileSize + eyeSize, eyeSize, eyeSize);
    //         }
    //     }

    //     function spawnFood() {
    //         food = {
    //             x: Math.floor(Math.random() * tileCountX),
    //             y: Math.floor(Math.random() * tileCountY)
    //         };
    //         for (const segment of snake) {
    //             if (segment.x === food.x && segment.y === food.y) {
    //                 return spawnFood();
    //             }
    //         }
    //     }

    //     function updateUI(newState) {
    //         gameState = newState;
    //         instructionsEl.classList.add('hidden');
    //         gameOverEl.classList.add('hidden');
    //         pausedEl.classList.add('hidden');
    //         inGameScoreDisplay.classList.add('hidden');

    //         switch (newState) {
    //             case GameState.INSTRUCTIONS:
    //                 instructionsEl.classList.remove('hidden');
    //                 break;
    //             case GameState.RUNNING:
    //                 inGameScoreDisplay.classList.remove('hidden');
    //                 scoreEl.textContent = score;
    //                 break;
    //             case GameState.PAUSED:
    //                 pausedEl.classList.remove('hidden');
    //                 break;
    //             case GameState.GAMEOVER:
    //                 gameOverEl.classList.remove('hidden');
    //                 finalScoreEl.textContent = score;
    //                 break;
    //         }
    //     }

    //     function handleKeydown(e) {
    //         if (e.code === 'Space') {
    //             e.preventDefault();
    //             if (gameState === GameState.RUNNING) updateUI(GameState.PAUSED);
    //             else if (gameState === GameState.PAUSED) updateUI(GameState.RUNNING);
    //             return;
    //         }

    //         if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    //             e.preventDefault();
                
    //             // Prevent setting direction if snake is stationary to avoid reversing on first move
    //             if (direction.x === 0 && direction.y === 0) {
    //                 if (e.key === 'ArrowLeft') return; // Can't start by going into its own body
    //             }

    //             if (gameState === GameState.PAUSED || gameState === GameState.INSTRUCTIONS) {
    //                 updateUI(GameState.RUNNING);
    //             }
    //             if (gameState === GameState.GAMEOVER) return;

    //             const key = e.key;
    //             if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    //             if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    //             if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    //             if (key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
    //         }
    //     }

    //     document.addEventListener('keydown', handleKeydown);
    //     restartButton.addEventListener('click', () => {
    //         resetGame();
    //         draw();
    //     });
    //     window.addEventListener('resize', () => {
    //         setCanvasSize();
    //         resetGame();
    //         draw();
    //     });
        
    //     // --- Initial Setup ---
    //     setCanvasSize();
    //     resetGame();
    //     draw();
    //     window.requestAnimationFrame(gameLoop); 
    // }
    


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
     * Handles the contact form submission using AJAX for Netlify Forms.
     * This prevents a page reload, provides instant user feedback, and leverages
     * Netlify's built-in form handling.
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const submitButton = document.getElementById('submit-button');
        const resultDiv = document.getElementById('form-result');

        if (!form || !submitButton || !resultDiv) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission

            const formData = new FormData(form);

            // Provide user feedback
            resultDiv.innerHTML = '<p class="text-brand-yellow">Sending...</p>';
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50', 'cursor-not-allowed');

            // Prepare data for Netlify
            const urlEncodedData = new URLSearchParams(formData).toString();

            // ** THIS IS THE CORRECTED PART FOR NETLIFY **
            // The request is sent to the current page's path ("/").
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: urlEncodedData
            })
                .then((response) => {
                    if (response.ok) {
                        resultDiv.innerHTML = `<p class="text-green-400">Thanks! Your message has been sent.</p>`;
                        form.reset();
                    } else {
                        // If the server responds with an error
                        throw new Error('Form submission failed.');
                    }
                })
                .catch(error => {
                    console.error(error);
                    resultDiv.innerHTML = '<p class="text-red-400">Oops! Something went wrong.</p>';
                })
                .finally(() => {
                    // Re-enable the button and clear the message
                    submitButton.disabled = false;
                    submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
                    setTimeout(() => {
                        resultDiv.innerHTML = '';
                    }, 5000);
                });
        });
    }

    /**
     * IDEA 3 (FIXED): "Drawing" Experience Timeline Animation.
     * Uses an Intersection Observer to detect when the 'Experience' section is
     * visible, then adds a class to trigger the CSS animation that "draws" the
     * vertical timeline bar.
     */
    function initExperienceTimeline() {
        const experienceSection = document.getElementById('experience');
        if (!experienceSection) return;

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add the trigger class to the section
                    experienceSection.classList.add('timeline-in-view');
                    // We only need to do this once, so we can unobserve
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of the section is visible
        });

        timelineObserver.observe(experienceSection);
    }
});


// snake-game highscore
function getHighScore() {
    const score = localStorage.getItem('snakeHighScore') || '0';
    return parseInt(score, 10);
}

function setHighScore(score) {
    localStorage.setItem('snakeHighScore', score);
}