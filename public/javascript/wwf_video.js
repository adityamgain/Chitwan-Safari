
    document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.querySelector('.video-container iframe');

    const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
    const src = iframe.getAttribute('data-src');
    iframe.setAttribute('src', src);
    observer.unobserve(entry.target); // Stop observing after autoplay
}
});
}, {
    threshold: 0.5 // At least 50% of video visible
});

    observer.observe(iframe);
});
