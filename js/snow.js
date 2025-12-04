const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 150; // Number of snowflakes
const mouse = { x: -1000, y: -1000 }; // Initial mouse position off-screen

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
        // Gravity
        this.y += this.vy;
        this.x += this.vx;

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
        // Keep falling
        if (this.vy < 1) this.vy += 0.05;

        // Reset if out of bounds
        if (this.y > height || this.x > width || this.x < 0) {
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

animate();
