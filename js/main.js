document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // --- Hero Logic ---
    const heroVisual = document.getElementById('hero-visual');
    const heroImageSrc = 'assets/images/hero-logo.png';

    if (heroVisual) {
        const img = new Image();
        img.src = heroImageSrc;
        img.alt = 'Зимний Фестиваль 2026';
        img.className = 'mx-auto max-w-xs md:max-w-md h-auto animate-fade-in';
        img.onload = () => {
            heroVisual.innerHTML = '';
            heroVisual.appendChild(img);
        };
        img.onerror = () => console.log('Hero logo not found, using text fallback.');
    }

    // --- Accessibility Check ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // --- Scroll Logic ---
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    let activeScrubbers = [];

    // Helper: Calculate scroll progress
    const handleScroll = () => {
        activeScrubbers.forEach(item => {
            const element = item.element;
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementHeight = rect.height;
            
            // Simple visibility check
            if (rect.bottom < 0 || rect.top > windowHeight) return;

            const totalTravel = windowHeight + elementHeight;
            const distanceCovered = windowHeight - rect.top;
            let progress = distanceCovered / totalTravel;
            progress = Math.max(0, Math.min(1, progress));
            
            item.scrubber.update(progress);
        });
    };

    window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));

    if (isDesktop) {
        // Desktop: Initialize Video Scrubbers
        document.querySelectorAll('.scroll-video').forEach(video => {
            activeScrubbers.push({
                element: video,
                scrubber: new VideoScrubber(video)
            });
        });
        // Initial update
        handleScroll();
    } else {
        // Mobile: Lazy Load Canvas Scrubbers
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const canvas = entry.target;
                    if (!canvas.dataset.initialized) {
                        canvas.dataset.initialized = 'true';
                        const scrubber = new ImageSequenceScrubber(canvas);
                        activeScrubbers.push({
                            element: canvas,
                            scrubber: scrubber
                        });
                        // Trigger initial draw
                        scrubber.update(0);
                    }
                }
            });
        }, { rootMargin: '200px' });

        document.querySelectorAll('.scroll-canvas').forEach(c => observer.observe(c));
    }

    // --- Reveal on Scroll ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Animate once
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% up from bottom
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// --- Classes ---

class VideoScrubber {
    constructor(video) {
        this.video = video;
        this.duration = 0;
        
        const onMetadata = () => {
            this.duration = video.duration;
            console.log(`[VideoScrubber] Metadata loaded for ${video.src}, duration: ${this.duration}`);
            this.update(0); // Initial set
        };

        if (video.readyState >= 1) {
            onMetadata();
        } else {
            video.addEventListener('loadedmetadata', onMetadata);
            video.load(); // Force load to get metadata
        }
    }

    update(progress) {
        if (this.duration && Number.isFinite(this.duration)) {
            const time = this.duration * progress;
            if (Math.abs(this.video.currentTime - time) > 0.05) { // Update only if change is significant
                this.video.currentTime = time;
            }
        }
    }
}

class ImageSequenceScrubber {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.path = this.canvas.dataset.framesPath;
        this.count = parseInt(this.canvas.dataset.framesCount, 10);
        this.images = [];
        this.loadedCount = 0;
        this.isLoaded = false;
        this.currentFrame = -1;

        // Handle resizing
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Start loading
        this.loadImages();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);

        if (this.currentFrame >= 0 && this.images[this.currentFrame]?.complete) {
            this.draw(this.images[this.currentFrame]);
        }
    }

    loadImages() {
        for (let i = 1; i <= this.count; i++) {
            const img = new Image();
            const num = i.toString().padStart(3, '0');
            const src = `${this.path}/frame_${num}.webp`;

            img.onload = () => {
                this.loadedCount++;
                if (i === 1) this.update(0); // Draw first frame ASAP
                if (this.loadedCount === this.count) {
                    this.isLoaded = true;
                }
            };
            img.onerror = () => {
                this.loadedCount++;
                if (this.loadedCount === this.count) this.isLoaded = true;
            };
            img.src = src;
            this.images.push(img);
        }
    }

    update(progress) {
        let frameIndex = Math.floor(progress * (this.count - 1));
        frameIndex = Math.max(0, Math.min(this.count - 1, frameIndex));

        const img = this.images[frameIndex];
        if (img && img.complete && img.naturalWidth > 0) {
            if (frameIndex !== this.currentFrame) {
                this.currentFrame = frameIndex;
                this.draw(img);
            }
        }
    }

    draw(img) {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        if (!w || !h) return;

        const r = w / h;
        const ir = img.width / img.height;

        let dw, dh, ox, oy;
        if (r > ir) {
            dw = w;
            dh = dw / ir;
            ox = 0;
            oy = (h - dh) / 2;
        } else {
            dh = h;
            dw = dh * ir;
            oy = 0;
            ox = (w - dw) / 2;
        }

        this.ctx.clearRect(0, 0, w, h);
        this.ctx.drawImage(img, ox, oy, dw, dh);
    }
}