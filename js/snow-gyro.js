const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 150; // Number of snowflakes
const mouse = { x: -1000, y: -1000 }; // Initial mouse position off-screen

// Device Orientation Gravity
let gravityX = 0;

// --- DEBUG PANEL START ---
const debugDiv = document.createElement('div');
debugDiv.style.cssText = "position:fixed; top:60px; left:10px; color:#0f0; background:rgba(0,0,0,0.7); padding:8px; z-index:10000; font-family:monospace; font-size:12px; pointer-events:none; border-radius:4px;";
debugDiv.innerHTML = "Sensors: Init...";
// Ensure body exists
if (document.body) {
    document.body.appendChild(debugDiv);
} else {
    window.addEventListener('DOMContentLoaded', () => document.body.appendChild(debugDiv));
}

function updateDebug(msg) {
    debugDiv.innerHTML = msg;
}
// --- DEBUG PANEL END ---


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
    const gamma = event.gamma; // Left/Right tilt (-90 to 90)
    const beta = event.beta;   // Front/Back tilt (-180 to 180)

    if (gamma !== null && beta !== null) {
        // Increase sensitivity: divide by 10 instead of 20
        gravityX = gamma / 10; 
        updateDebug(`Tilt: ${gamma.toFixed(1)}°<br>GravX: ${gravityX.toFixed(2)}`);
    } else {
        updateDebug("Sensor data null");
    }
}

// Request permission for iOS 13+
function requestMotionPermission() {
    updateDebug("Tap detected. Requesting...");
    
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                updateDebug(`Permission: ${permissionState}`);
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            })
            .catch(err => {
                updateDebug(`Error: ${err}`);
                console.error(err);
            });
    } else {
        // Non-iOS or older iOS
        updateDebug("Non-iOS request (ignored)");
        window.addEventListener('deviceorientation', handleOrientation);
    }
    
    // Remove listeners only if permission was granted or not needed?
    // Let's keep them if it failed, so user can try again? 
    // Usually only first user interaction counts.
}

// Listeners
window.addEventListener('click', requestMotionPermission);
window.addEventListener('touchstart', requestMotionPermission);

// Try to auto-start (Android/Desktop)
if (typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        updateDebug("Auto-starting sensors...");
        window.addEventListener('deviceorientation', handleOrientation);
    } else {
        updateDebug("Waiting for Tap (iOS)...");
    }
} else {
    updateDebug("DeviceOrientation NOT supported");
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
        
        // Apply Gravity from Gyro
        this.x += this.vx + gravityX;

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

        // Reset if out of bounds
        // Increased horizontal bounds to account for strong wind
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