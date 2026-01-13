// ===== Enhanced Cards Carousel with Auto-Scroll =====
const carouselTrack = document.querySelector('.cards-carousel-track');
const carouselCards = document.querySelectorAll('.carousel-card');

// Auto-scroll control
let isCarouselPaused = false;

// Pause on hover for each card
carouselCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        carouselTrack.classList.add('paused');
        isCarouselPaused = true;

        // Generate star particles on hover
        createStarParticles(card);
    });

    card.addEventListener('mouseleave', () => {
        carouselTrack.classList.remove('paused');
        isCarouselPaused = false;
    });

    // Click to view full size
    card.addEventListener('click', (e) => {
        if (e.target.closest('.card-container')) {
            const imgSrc = card.querySelector('img').src;
            openCardModal(imgSrc, card.dataset.cardName);
        }
    });

    // 3D tilt effect on mouse move
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.querySelector('.card-container').style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.querySelector('.card-container').style.transform =
            'rotateX(0deg) rotateY(0deg) scale(1)';
    });
});

// Create magical star particles
function createStarParticles(card) {
    const particlesContainer = card.querySelector('.card-particles');

    // Create multiple stars
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'magic-star';

            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 4 + 2;
            const duration = Math.random() * 1.5 + 1;
            const delay = Math.random() * 0.3;

            star.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, #ffffff, #ffd700);
                border-radius: 50%;
                box-shadow:
                    0 0 ${size * 3}px #ffffff,
                    0 0 ${size * 6}px #ffd700,
                    0 0 ${size * 9}px #ff8c00;
                opacity: 0;
                pointer-events: none;
                z-index: 10;
                animation: starBurst ${duration}s ease-out ${delay}s forwards;
            `;

            particlesContainer.appendChild(star);

            // Remove after animation
            setTimeout(() => {
                star.remove();
            }, (duration + delay) * 1000 + 100);
        }, i * 50);
    }
}

// Add star burst animation
const starBurstStyle = document.createElement('style');
starBurstStyle.textContent = `
    @keyframes starBurst {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        50% {
            transform: scale(2) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(3) rotate(360deg) translateY(-30px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(starBurstStyle);

// Open card modal with enhanced effects
function openCardModal(imgSrc, cardName) {
    const modal = document.createElement('div');
    modal.className = 'card-modal enhanced';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${cardName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-image-wrapper">
                <img src="${imgSrc}" alt="${cardName}">
                <canvas class="modal-particles-canvas"></canvas>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Animate particles in modal
    const canvas = modal.querySelector('.modal-particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            alpha: Math.random()
        });
    }

    function animateModalParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffd700';
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            p.alpha = Math.sin(Date.now() * 0.001 + p.x) * 0.5 + 0.5;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        if (document.body.contains(modal)) {
            requestAnimationFrame(animateModalParticles);
        }
    }

    animateModalParticles();

    // Close modal handlers
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });

    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });

    // Fade in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Keyboard controls for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.card-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }
});
