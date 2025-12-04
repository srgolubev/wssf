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
});
