const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 150;
const mouse = { x: -1000, y: -1000 };

// Device Orientation Gravity
let gravityX = 0;

// --- DEBUG PANEL ---
const debugDiv = document.createElement('div');
debugDiv.style.cssText = "position:fixed; top:60px; left:10px; color:#0f0; background:rgba(0,0,0,0.7); padding:8px; z-index:10000; font-family:monospace; font-size:12px; pointer-events:none; border-radius:4px;";
debugDiv.innerHTML = "Init v2...";
if (document.body) {
    document.body.appendChild(debugDiv);
} else {
    window.addEventListener('DOMContentLoaded', () => document.body.appendChild(debugDiv));
}

function updateDebug(msg) {
    debugDiv.innerHTML = msg;
}
// -------------------

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Handle Orientation
function handleOrientation(event) {
    const gamma = event.gamma;
    if (gamma !== null) {
        gravityX = gamma / 10; 
        updateDebug(`G: ${gamma.toFixed(1)} | GX: ${gravityX.toFixed(2)}`);
    }
}

// Permission Request
function requestMotionPermission() {
    updateDebug("Tap received. Requesting...");
    
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                updateDebug(`Perm: ${state}`);
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            })
            .catch(err => {
                updateDebug(`Err: ${err.message}`);
            });
    } else {
        // Non-iOS
        updateDebug("Android/PC (No perm needed)");
        window.addEventListener('deviceorientation', handleOrientation);
    }
}

// iOS: Use 'click' only. 'touchstart' is risky for permission requests.
// Using {once:true} so it runs only on the first tap.
window.addEventListener('click', requestMotionPermission, { once: true });

// Android/PC: Try auto-start immediately
if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    updateDebug("Auto-start...");
    window.addEventListener('deviceorientation', handleOrientation);
} else {
    // If requestPermission exists (iOS), tell user to tap
    updateDebug("Tap screen to start!");
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
        this.x += this.vx + gravityX; // Add gravity

        // Mouse interaction
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
