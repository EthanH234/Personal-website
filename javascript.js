document.addEventListener(function () {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Function to show a specific slide
    function showSlide(index) {
        // 1. Remove 'active' class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // 2. Add 'active' class to the target slide
        slides[index].classList.add('active');
    }

    // Previous Button handler
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    });

    // Next Button handler
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    });

    // Initialize the carousel
    showSlide(currentSlide);
});