document.addEventListener('DOMContentLoaded', () => {

    // --- Hero Animation ---
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroTitle.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }

    // --- Input Interaction ---
    const inputWrapper = document.querySelector('.input-wrapper');
    const vibeInput = document.querySelector('#vibe-input');

    if (vibeInput && inputWrapper) {
        vibeInput.addEventListener('focus', () => {
            inputWrapper.style.boxShadow = '0 0 40px rgba(123, 97, 255, 0.2)';
        });
        vibeInput.addEventListener('blur', () => {
            inputWrapper.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        });
    }

    // --- Form Submission ---
    const submitBtn = document.querySelector('.arrow-btn');
    if (submitBtn && vibeInput) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = vibeInput.value.trim();
            if (value) {
                vibeInput.value = '';
                vibeInput.placeholder = 'Generating design...';
                setTimeout(() => {
                    vibeInput.placeholder = 'What native mobile app shall we design?';
                }, 2000);
            }
        });
    }

    // --- Initialize Project Swiper ---
    if (typeof Swiper !== 'undefined' && document.querySelector('.project-swiper')) {
        try {
            const projectSwiper = new Swiper('.project-swiper', {
                slidesPerView: 1,
                spaceBetween: 24,
                loop: true,
                grabCursor: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                pagination: {
                    el: '.project-swiper .swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    }
                }
            });
        } catch (e) {
            console.error('Swiper initialization failed:', e);
        }
    }

    // --- Side Menu Toggle ---
    const hamburger = document.getElementById('hamburgerBtn');
    const sideMenu = document.getElementById('sideMenu');
    const sideOverlay = document.getElementById('sideMenuOverlay');
    const sideClose = document.getElementById('sideMenuClose');

    const openSideMenu = () => {
        if (hamburger) hamburger.classList.add('active');
        if (sideMenu) sideMenu.classList.add('active');
        if (sideOverlay) sideOverlay.classList.add('active');
        document.body.classList.add('menu-open');
    }

    const closeSideMenu = () => {
        if (hamburger) hamburger.classList.remove('active');
        if (sideMenu) sideMenu.classList.remove('active');
        if (sideOverlay) sideOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    if (hamburger && sideMenu) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (sideMenu.classList.contains('active')) {
                closeSideMenu();
            } else {
                openSideMenu();
            }
        });
    }

    if (sideOverlay) {
        sideOverlay.addEventListener('click', closeSideMenu);
    }

    if (sideClose) {
        sideClose.addEventListener('click', closeSideMenu);
    }

    // Close on link click
    const sideMenuLinks = document.querySelectorAll('.side-menu-nav a');
    sideMenuLinks.forEach(link => {
        link.addEventListener('click', closeSideMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSideMenu();
    });

    // Prevent propagation inside menu
    if (sideMenu) {
        sideMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // --- Active Link Logic ---
    const setActiveLink = () => {
        const currentPath = window.location.pathname;
        let page = currentPath.split("/").pop() || 'index.shtml';
        
        // Handle cases where the path might not have an extension or be a directory
        if (page === '' || page === '/') page = 'index.shtml';
        
        const allLinks = document.querySelectorAll('nav ul li a, .side-menu-nav ul li a, .footer-links li a');
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Check for exact match or index match
            if (href === page || 
                (page === 'index.shtml' && (href === 'index' || href === './' || href === 'index.shtml')) ||
                (href && page.startsWith(href.split('.')[0]))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    setActiveLink();

});
