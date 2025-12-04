document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Hero Logic: Image vs Text
    // We try to load the image. If it loads, we replace the text.
    // If it fails (onerror), we keep the text.
    const heroVisual = document.getElementById('hero-visual');
    const heroImageSrc = 'assets/images/hero-logo.png'; // Primary candidate

    if (heroVisual) {
        const img = new Image();
        img.src = heroImageSrc;
        img.alt = 'Зимний Фестиваль 2026';
        img.className = 'mx-auto max-w-xs md:max-w-md h-auto animate-fade-in'; // Tailwind classes

        img.onload = () => {
            // Image exists, clear text and append image
            heroVisual.innerHTML = '';
            heroVisual.appendChild(img);
        };

        img.onerror = () => {
            // Image does not exist, keep text (default state)
            console.log('Hero logo not found, using text fallback.');
        };
    }
    // Image Sequence Scrubbing (Canvas)
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

            console.log(`[Scrubber] Initialized for ${this.path}, expecting ${this.count} frames.`);

            // Handle resizing
            this.resize();
            window.addEventListener('resize', () => this.resize());

            // Start loading images
            this.loadImages();
        }

        resize() {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            // Set actual size in memory (scaled to account for extra pixel density)
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;

            // Normalize coordinate system to use css pixels.
            this.ctx.scale(dpr, dpr);

            // Redraw current frame if exists
            if (this.currentFrame >= 0 && this.images[this.currentFrame] && this.images[this.currentFrame].complete) {
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
                    // Draw the first frame immediately when it loads to avoid blank space
                    if (i === 1) {
                        this.update(0);
                    }

                    if (this.loadedCount === this.count) {
                        this.isLoaded = true;
                        console.log(`[Scrubber] All frames loaded for ${this.path}`);
                        this.update(0);
                    }
                };

                img.onerror = () => {
                    console.error(`[Scrubber] Failed to load frame: ${src}`);
                    // Still increment loadedCount to avoid hanging forever if one frame fails
                    this.loadedCount++;
                    if (this.loadedCount === this.count) {
                        this.isLoaded = true;
                        this.update(0);
                    }
                };

                img.src = src;
                this.images.push(img);
            }
        }

        update(progress) {
            // Allow drawing if at least the requested frame is loaded (simplified check)
            // Ideally we check if specific frame is loaded.

            // Map progress 0..1 to frame index 0..count-1
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
            if (!img) return;

            // Simulate object-fit: cover
            const canvasWidth = this.canvas.clientWidth;
            const canvasHeight = this.canvas.clientHeight;

            if (canvasWidth === 0 || canvasHeight === 0) return; // Element not visible

            const canvasRatio = canvasWidth / canvasHeight;
            const imgRatio = img.width / img.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawWidth = canvasWidth;
                drawHeight = drawWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) / 2;
            } else {
                drawHeight = canvasHeight;
                drawWidth = drawHeight * imgRatio;
                offsetY = 0;
                offsetX = (canvasWidth - drawWidth) / 2;
            }

            this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    }

    const scrollCanvases = document.querySelectorAll('.scroll-canvas');
    if (scrollCanvases.length > 0) {
        const scrubbers = Array.from(scrollCanvases).map(c => new ImageSequenceScrubber(c));

        const handleScroll = () => {
            scrubbers.forEach(scrubber => {
                const rect = scrubber.canvas.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementHeight = rect.height;

                const totalTravel = windowHeight + elementHeight;
                const distanceCovered = windowHeight - rect.top;
                let progress = distanceCovered / totalTravel;

                progress = Math.max(0, Math.min(1, progress));
                scrubber.update(progress);
            });
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleScroll);
        });

        // Initial check
        handleScroll();
    }
});
