
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.activities-track');
    const cards = document.querySelectorAll('.activity-card');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    let currentIndex = 0;
    const cardCount = cards.length;
    let visibleCards = 4;
    let cardWidth = cards[0].offsetWidth + 32; // width + gap

    // Determine visible cards based on screen size
    function updateVisibleCards() {
    if (window.innerWidth <= 1200 && window.innerWidth > 768) {
    visibleCards = 3;
} else if (window.innerWidth <= 768 && window.innerWidth > 480) {
    visibleCards = 2;
} else if (window.innerWidth <= 480) {
    visibleCards = 1;
} else {
    visibleCards = 4;
}
}

    // Auto-slide every 5 seconds
    let autoSlide = setInterval(slideNext, 5000);

    function updateCardWidth() {
    cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(track).gap);
}

    function slideNext() {
    updateVisibleCards();
    currentIndex = (currentIndex + 1) % (cardCount - visibleCards + 1);
    updatePosition();
    resetAutoSlide();
}

    function slidePrev() {
    updateVisibleCards();
    currentIndex = (currentIndex - 1 + (cardCount - visibleCards + 1)) % (cardCount - visibleCards + 1);
    updatePosition();
    resetAutoSlide();
}

    function updatePosition() {
    updateCardWidth();
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

    function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(slideNext, 5000);
}

    nextBtn.addEventListener('click', slideNext);
    prevBtn.addEventListener('click', slidePrev);

    // Handle window resize
    window.addEventListener('resize', function() {
    updateVisibleCards();
    updateCardWidth();
    updatePosition();
});

    // Pause auto-slide on hover
    const carousel = document.querySelector('.activities-carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carousel.addEventListener('mouseleave', () => {
    resetAutoSlide();
});

    // Initialize
    updateVisibleCards();
    updateCardWidth();
});