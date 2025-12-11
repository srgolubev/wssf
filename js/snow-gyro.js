const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 150; // Number of snowflakes
const mouse = { x: -1000, y: -1000 }; // Initial mouse position off-screen

// Device Orientation Gravity
let gravityX = 0;
let gravityY = 0;

// Resize canvas to full screen
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Track mouse position
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Handle Device Orientation
function handleOrientation(event) {
    // gamma is the left-to-right tilt in degrees, where right is positive
    // beta is the front-to-back tilt in degrees, where front is positive
    
    // Normalize values roughly between -1 and 1
    const gamma = event.gamma; // Left/Right tilt (-90 to 90)
    const beta = event.beta;   // Front/Back tilt (-180 to 180)

    if (gamma !== null) {
        // Limit gravity effect
        gravityX = gamma / 20; // Divide to make movement smoother
    }
    
    // Optional: Add vertical gravity control (uncomment if you want snow to fall UP when phone is upside down)
    // if (beta !== null) {
    //     gravityY = (beta - 45) / 20; // 45 is roughly holding phone at angle
    // }
}

// Request permission for iOS 13+
function requestMotionPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            })
            .catch(console.error);
    } else {
        // Non-iOS devices usually allow this by default
        window.addEventListener('deviceorientation', handleOrientation);
    }
    
    // Remove listener after first interaction
    window.removeEventListener('click', requestMotionPermission);
    window.removeEventListener('touchstart', requestMotionPermission);
}

// Add listeners for permission on first interaction
window.addEventListener('click', requestMotionPermission);
window.addEventListener('touchstart', requestMotionPermission);

// Try to add listener immediately for non-iOS devices
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
        this.vx = (Math.random() - 0.5) * 1; // Horizontal velocity
        this.vy = 1 + Math.random() * 2; // Vertical velocity (fall speed)
        this.size = 1 + Math.random() * 2; // Size of snowflake
        this.opacity = 0.5 + Math.random() * 0.5;
        this.friction = 0.98;
    }

    update() {
        // Gravity + Device Tilt
        this.y += this.vy;
        
        // Add device gravity to horizontal movement
        this.x += this.vx + gravityX;

        // Mouse interaction (Repel)
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDistance = 150; // Interaction radius

        if (distance < forceDistance) {
            const force = (forceDistance - distance) / forceDistance;
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * force * 5; // Push strength
            const pushY = Math.sin(angle) * force * 5;

            this.vx += pushX;
            this.vy += pushY;
        }

        // Apply friction to return to normal speed
        this.vx *= this.friction;
        
        // Ensure snow keeps falling down eventually, even with interaction
        if (this.vy < 1) this.vy += 0.05;

        // Reset if out of bounds (extended bounds for tilt)
        if (this.y > height + 10 || this.x > width + 50 || this.x < -50) {
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

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Snowflake());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Check for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    animate();
}
