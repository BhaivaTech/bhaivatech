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

});
