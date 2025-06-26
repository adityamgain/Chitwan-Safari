document.addEventListener('DOMContentLoaded', function() {
    // Toggle between images and videos
    const showImagesBtn = document.getElementById('show-images');
    const showVideosBtn = document.getElementById('show-videos');
    const imagesContainer = document.getElementById('images-container');
    const videosContainer = document.getElementById('videos-container');
    const toggleButtons = document.querySelector('.toggle-buttons');

    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const imageCounter = document.getElementById('image-counter');

    // Media items
    const mediaItems = document.querySelectorAll('.media-item');
    let currentImageIndex = 0;
    const images = Array.from(document.querySelectorAll('#images-container img'));

    // Toggle functionality
    function toggleMedia(showImages) {
        if (showImages) {
            imagesContainer.classList.remove('hidden');
            videosContainer.classList.add('hidden');
            showImagesBtn.classList.add('active');
            showVideosBtn.classList.remove('active');
            toggleButtons.classList.remove('video-active');
            showImagesBtn.setAttribute('aria-selected', 'true');
            showVideosBtn.setAttribute('aria-selected', 'false');
        } else {
            imagesContainer.classList.add('hidden');
            videosContainer.classList.remove('hidden');
            showImagesBtn.classList.remove('active');
            showVideosBtn.classList.add('active');
            toggleButtons.classList.add('video-active');
            showImagesBtn.setAttribute('aria-selected', 'false');
            showVideosBtn.setAttribute('aria-selected', 'true');
        }
    }

    showImagesBtn.addEventListener('click', () => toggleMedia(true));
    showVideosBtn.addEventListener('click', () => toggleMedia(false));

    // Lightbox functionality
    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxImg.alt = images[currentImageIndex].alt;
        updateCounter();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightbox.setAttribute('aria-hidden', 'true');
    }

    function navigate(direction) {
        currentImageIndex += direction;
        if (currentImageIndex >= images.length) currentImageIndex = 0;
        if (currentImageIndex < 0) currentImageIndex = images.length - 1;

        lightboxImg.src = images[currentImageIndex].src;
        lightboxImg.alt = images[currentImageIndex].alt;
        updateCounter();
    }

    function updateCounter() {
        imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }

    // Event listeners for media items
    mediaItems.forEach((item, index) => {
        if (item.querySelector('img')) {
            item.addEventListener('click', () => openLightbox(index));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            e.preventDefault();
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigate(-1);
                    break;
                case 'ArrowRight':
                    navigate(1);
                    break;
            }
        }
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('src');
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px'
        });

        lazyImages.forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    }
});