document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero h1');
    const inputWrapper = document.querySelector('.input-wrapper');
    const vibeInput = document.querySelector('#vibe-input');

    // Reveal animation
    setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 100);

    // Initial styles for animation
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    heroTitle.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';

    // Input interaction
    vibeInput.addEventListener('focus', () => {
        inputWrapper.style.boxShadow = '0 0 40px rgba(123, 97, 255, 0.2)';
    });

    vibeInput.addEventListener('blur', () => {
        inputWrapper.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    });

    // Form submission simulation
    const submitBtn = document.querySelector('.arrow-btn');
    if (submitBtn) {
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

    // Initialize Services Swiper
    const servicesSwiper = new Swiper('.services-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            }
        }
    });

    // Initialize Project Swiper
    const projectSwiper = new Swiper('.project-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
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

});
