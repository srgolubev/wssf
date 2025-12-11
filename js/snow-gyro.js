const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 150; 
const mouse = { x: -1000, y: -1000 };

// Device Orientation Gravity
let gravityX = 0;

// --- UTILITY ---
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
const IS_MOBILE = isMobileDevice();

// Resize
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Mouse Track (Desktop Only)
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

// Orientation Handler
function handleOrientation(event) {
    const gamma = event.gamma; 
    if (gamma !== null) {
        gravityX = gamma / 20; 
    }
}

// Permission Request
function requestMotionPermission() {
    // Check if permission API exists (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    // Success! Remove listeners so we don't ask again
                    cleanupListeners();
                }
            })
            .catch(err => {
                console.error("Gyro permission failed/ignored:", err);
                // We do NOT remove listeners here, so user can tap again if they dismissed it
            });
    } else {
        // Non-iOS or older devices: just add the listener
        window.addEventListener('deviceorientation', handleOrientation);
        cleanupListeners();
    }
}

function cleanupListeners() {
    window.removeEventListener('click', requestMotionPermission);
    document.body.removeEventListener('click', requestMotionPermission);
    window.removeEventListener('touchstart', requestMotionPermission);
    // Reset cursor
    document.body.style.cursor = '';
}

// Add listeners to Window and Body to cover maximum area
// NOT using {once:true} to allow retries if first tap fails or is ignored
window.addEventListener('click', requestMotionPermission);
document.body.addEventListener('click', requestMotionPermission);

// iOS sometimes ignores clicks on non-interactive elements. 
// Adding cursor:pointer helps hint that the body is clickable.
if (IS_MOBILE) {
    document.body.style.cursor = 'pointer';
}

// Try auto-start (Android)
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
        this.x += this.vx + gravityX; 

        // Mouse interaction (Desktop only)
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

        // Reset if out of bounds
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
