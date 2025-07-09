document.addEventListener('DOMContentLoaded', function () {

    // Initialize all components
    initMobileMenu();
    initNavScroll();
    initTypingEffect();
    initSwiper();
    initScrollAnimations();
    initHeroAuroraEffect();
    initScrollToTop();

    // --- COMPONENT INITIALIZATIONS ---

    function initMobileMenu() {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        const openIcon = document.getElementById('menu-open-icon');
        const closeIcon = document.getElementById('menu-close-icon');

        if (!button) return;

        const toggleMenu = () => {
            menu.classList.toggle('hidden');
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        };

        button.addEventListener('click', toggleMenu);
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!menu.classList.contains('hidden')) toggleMenu();
            });
        });
    }

    function initNavScroll() {
        window.addEventListener('scroll', () => {
            document.querySelector('nav').classList.toggle('shadow-lg', window.scrollY > 50);
        });
    }

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
                codeEl.innerHTML = codeLines.join('<br>') + '<span class="typing-cursor"></span>';
                return;
            }
            if (currentChar < codeLines[currentLine].length) {
                codeEl.innerHTML = codeLines.slice(0, currentLine).join('<br>') + '<br>' + codeLines[currentLine].substring(0, currentChar + 1);
                currentChar++;
                setTimeout(typeCode, 25);
            } else {
                currentLine++;
                currentChar = 0;
                setTimeout(typeCode, 200);
            }
        }
        typeCode();
    }

    function initSwiper() {
        if (typeof Swiper === 'undefined') return;
        new Swiper('.swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
        });
    }

    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationClasses = entry.target.dataset.animationClasses || 'animate__animated animate__fadeInUp';
                    entry.target.classList.add(...animationClasses.split(' '));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('[data-observer-target]').forEach(el => observer.observe(el));
    }

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
});