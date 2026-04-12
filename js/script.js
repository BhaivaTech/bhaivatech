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
    
    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('form-response');

    if (contactForm && formResponse) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Basic Validation
            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();
            
            if (!name || !email || !message) {
                showResponse('Please fill in all required fields.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showResponse('Please enter a valid email address.', 'error');
                return;
            }
            
            // Sending effect
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch('contact-process.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    showResponse(result.message, 'success');
                    contactForm.reset();
                } else {
                    showResponse(result.message || 'Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                showResponse('Failed to send message. Please check your connection.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    function showResponse(message, type) {
        formResponse.textContent = message;
        formResponse.style.display = 'block';
        formResponse.style.padding = '12px';
        formResponse.style.borderRadius = '8px';
        formResponse.style.fontSize = '14px';
        formResponse.style.fontWeight = '500';
        
        if (type === 'success') {
            formResponse.style.backgroundColor = '#EBF5FF';
            formResponse.style.color = '#0056D2';
        } else {
            formResponse.style.backgroundColor = '#FEE2E2';
            formResponse.style.color = '#991B1B';
        }
        
        // Hide after 5 seconds if success
        if (type === 'success') {
            setTimeout(() => {
                formResponse.style.display = 'none';
            }, 5000);
        }
    }

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
