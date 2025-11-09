document.addEventListener('DOMContentLoaded', () => {
    // Init a carousel for a given container element. Returns a cleanup function.
    function initCarousel(container, opts = {}) {
        const slides = Array.from(container.querySelectorAll('.carousel-slide'));
        if (slides.length === 0) return () => {};

        const prevButton = container.querySelector('.prev-button');
        const nextButton = container.querySelector('.next-button');
        let current = 0;
        let autoplay = null;

        function show(index) {
            slides.forEach((s, i) => s.classList.toggle('active', i === index));
        }

        function startAutoplay() {
            if (opts.autoplay === false) return;
            autoplay = setInterval(() => {
                current = (current + 1) % slides.length;
                show(current);
            }, opts.interval || 4000);
        }

        function stopAutoplay() {
            if (autoplay) { clearInterval(autoplay); autoplay = null; }
        }

        if (prevButton) prevButton.addEventListener('click', () => {
            current = (current - 1 + slides.length) % slides.length;
            show(current);
        });

        if (nextButton) nextButton.addEventListener('click', () => {
            current = (current + 1) % slides.length;
            show(current);
        });

        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);

        // init
        show(current);
        startAutoplay();

        // cleanup
        return () => {
            stopAutoplay();
            // NOTE: we don't remove click listeners here to keep it simple; if necessary we can track and remove them
        };
    }

    // Initialize all page carousels
    const carousels = document.querySelectorAll('.carousel-container');
    const carouselCleanups = [];
    carousels.forEach(c => carouselCleanups.push(initCarousel(c)));
    
        // Modal behavior for project cards
        const modal = document.getElementById('project-modal');
        const modalContent = modal ? modal.querySelector('.modal-content') : null;
        const modalClose = modal ? modal.querySelector('.modal-close') : null;

            let modalCarouselCleanup = null;

            function openModal(html) {
                if (!modal) return;
                // cleanup any previous modal carousel
                if (modalCarouselCleanup) { modalCarouselCleanup(); modalCarouselCleanup = null; }

                modalContent.innerHTML = html;

                // If modal contains a carousel-container (we inject one), initialize it
                const modalCarousel = modalContent.querySelector('.carousel-container');
                if (modalCarousel) {
                    modalCarouselCleanup = initCarousel(modalCarousel);
                }

                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                if (!modal) return;
                if (modalCarouselCleanup) { modalCarouselCleanup(); modalCarouselCleanup = null; }
                modal.setAttribute('aria-hidden', 'true');
                modalContent.innerHTML = '';
                document.body.style.overflow = '';
            }

            // Click on project card opens modal; if card has data-images, build a carousel inside the modal
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('click', () => {
                    const title = card.querySelector('h3') ? card.querySelector('h3').innerText : '';
                    const excerpt = card.querySelector('.card-excerpt') ? card.querySelector('.card-excerpt').innerText : '';
                    const dataImages = card.dataset.images; // comma-separated list

                    let html = `\n          <h2>${title}</h2>`;

                const detail = card.dataset.detail;

                if (dataImages) {
                        // Build a carousel with the provided images
                        const imgs = dataImages.split(',').map(s => s.trim()).filter(Boolean);
                        html += '\n          <div class="carousel-container">';
                        imgs.forEach((src, idx) => {
                            html += `\n            <div class="carousel-slide${idx===0 ? ' active' : ''}">`;
                            html += `\n              <img src="${src}" alt="${title} image ${idx+1}">`;
                            html += '\n            </div>';
                        });
                        html += '\n            <button class="prev-button" aria-label="Previous">&#10094;</button>';
                        html += '\n            <button class="next-button" aria-label="Next">&#10095;</button>';
                        html += '\n          </div>';
                                    html += `\n          <p>${excerpt}</p>`;
                                    html += `\n          <div class="modal-detail">${detail ? detail : ''}</div>`;
                    } else {
                        // Fallback: show single image from card (if present)
                        const imgEl = card.querySelector('img');
                        if (imgEl) html += `\n          <img src="${imgEl.src}" alt="${title}">`;
                                    html += `\n          <p>${excerpt}</p>`;
                                    html += `\n          <div class="modal-detail">${detail ? detail : ''}</div>`;
                    }

                    openModal(html);
                });
            });

        if (modalClose) modalClose.addEventListener('click', closeModal);

        // Close when clicking outside modal window
        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
});