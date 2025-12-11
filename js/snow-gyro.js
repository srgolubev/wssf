const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 150; // Number of snowflakes
const mouse = { x: -1000, y: -1000 }; // Initial mouse position off-screen

// Device Orientation Gravity
let gravityX = 0;

// --- UTILITY FUNCTIONS ---
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
const IS_MOBILE = isMobileDevice();
// --- END UTILITY FUNCTIONS ---


// Resize canvas to full screen
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Track mouse position (only for desktop)
if (!IS_MOBILE) {
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
}


// Handle Orientation
function handleOrientation(event) {
    const gamma = event.gamma; // Left/Right tilt (-90 to 90)
    if (gamma !== null) {
        gravityX = gamma / 10; // Increase sensitivity
    }
}

// Permission Request
function requestMotionPermission() {
    // Only try to request permission on iOS and if it's a function
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            })
            .catch(err => {
                console.error("Gyro permission error:", err);
            });
    } else {
        // Non-iOS or older iOS, just add listener
        window.addEventListener('deviceorientation', handleOrientation);
    }
    // Remove self after first interaction
    window.removeEventListener('click', requestMotionPermission);
}

// Listen for first interaction to request permission (if needed)
// This will cover the entire window/document body
window.addEventListener('click', requestMotionPermission, { once: true });


// Android/PC: Try auto-start immediately if no explicit permission needed
if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', handleOrientation);
}


class Snowflake {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.vx = (Math.random() - 0.5) * 1; 
        this.vy = 1 + Math.random() * 2; 
        this.size = 1 + Math.random() * 2; 
        this.opacity = 0.5 + Math.random() * 0.5;
        this.friction = 0.98;
    }

    update() {
        this.y += this.vy;
        this.x += this.vx + gravityX; // Apply Gravity from Gyro

        // Mouse interaction (Repel) - ONLY FOR DESKTOP
        if (!IS_MOBILE) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDistance = 150;

            if (distance < forceDistance) {
                const force = (forceDistance - distance) / forceDistance;
                const angle = Math.atan2(dy, dx);
                const pushX = Math.cos(angle) * force * 5; 
                const pushY = Math.sin(angle) * force * 5;
                this.vx += pushX;
                this.vy += pushY;
            }
        }

        this.vx *= this.friction;
        if (this.vy < 1) this.vy += 0.05;

        if (this.y > height + 10 || this.x > width + 100 || this.x < -100) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Snowflake());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) animate();