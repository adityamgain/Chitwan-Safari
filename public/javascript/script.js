document.addEventListener('DOMContentLoaded', function() {
    // Hero Carousel Functionality
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        const slides = document.querySelectorAll('.hero-slide');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        let currentSlide = 0;
        let slideInterval;

        // Create indicators
        slides.forEach((slide, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = document.querySelectorAll('.indicator');

        // Function to go to specific slide
        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');

            currentSlide = (index + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');

            // Reset timer when manually changing slides
            resetInterval();
        }

        // Next slide function
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        // Previous slide function
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Reset interval timer
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Event listeners for buttons
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        // Start the carousel
        resetInterval();

        // Pause on hover
        heroCarousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        heroCarousel.addEventListener('mouseleave', resetInterval);
    }
});


