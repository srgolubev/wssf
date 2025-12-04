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
    // Video Scroll Scrubbing
    const scrollVideos = document.querySelectorAll('.scroll-video');

    if (scrollVideos.length > 0) {
        const handleScroll = () => {
            scrollVideos.forEach(video => {
                // Ensure video metadata is loaded
                if (video.readyState < 1) return;

                const rect = video.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementHeight = rect.height;

                // Calculate progress:
                // 0 when element just enters from bottom
                // 1 when element just leaves to top
                const totalTravel = windowHeight + elementHeight;
                const distanceCovered = windowHeight - rect.top;
                let progress = distanceCovered / totalTravel;

                // Clamp progress between 0 and 1
                progress = Math.max(0, Math.min(1, progress));

                if (Number.isFinite(video.duration)) {
                    video.currentTime = video.duration * progress;
                }
            });
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleScroll);
        });

        // Initialize when metadata is loaded
        scrollVideos.forEach(video => {
            if (video.readyState >= 1) {
                handleScroll();
            } else {
                video.addEventListener('loadedmetadata', handleScroll);
            }
        });
    }
});
