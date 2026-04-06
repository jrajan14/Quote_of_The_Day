// Flying objects animation class
class FlyingObject {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 6 + 2; // 2-8px
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.2 + (Math.random() > 0.7 ? 0.5 : -0.3);
        this.opacity = Math.random() * 0.5 + 0.2;
        
        // Different shapes: 0 = circle, 1 = star-like, 2 = diamond
        this.type = Math.floor(Math.random() * 3);
        
        // Colors based on gradient theme
        const hues = [280, 320, 200, 150, 50];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
        this.color = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.rotationSpeed;

        // Wrap around edges
        if (this.x < -50) this.x = this.canvas.width + 50;
        if (this.x > this.canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = this.canvas.height + 50;
        if (this.y > this.canvas.height + 50) this.y = -50;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.beginPath();

        if (this.type === 0) {
            // Circle
            this.ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            // Add glow
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = `hsla(${this.hue}, 80%, 65%, 0.6)`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        } 
        else if (this.type === 1) {
            // Star/sparkle
            const spikes = 4;
            const outerRadius = this.size;
            const innerRadius = this.size * 0.5;
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (Math.PI * 2 * i) / (spikes * 2);
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        } 
        else {
            // Diamond
            this.ctx.moveTo(0, -this.size);
            this.ctx.lineTo(this.size, 0);
            this.ctx.lineTo(0, this.size);
            this.ctx.lineTo(-this.size, 0);
            this.ctx.closePath();
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
}

// Initialize flying objects
let objects = [];
let canvas, ctx;
let animationId;

function initFlyingObjects() {
    canvas = document.getElementById('floatingCanvas');
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create 75 flying objects
    const objectCount = 75;
    objects = [];
    for (let i = 0; i < objectCount; i++) {
        objects.push(new FlyingObject(canvas, ctx));
    }
    
    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let obj of objects) {
            obj.update();
            obj.draw();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Quote management
let quotesDatabase = [];

// Load quotes from quotes.json (the 4th file)
async function loadQuotes() {
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) {
            throw new Error('Could not load quotes.json');
        }
        const data = await response.json();
        quotesDatabase = data.quotes;
        
        // If quotes loaded successfully, pick a random quote
        if (quotesDatabase.length > 0) {
            displayRandomQuote();
        } else {
            // Fallback quotes if file is empty
            useFallbackQuotes();
        }
    } catch (error) {
        console.warn('Error loading quotes.json, using fallback quotes:', error);
        useFallbackQuotes();
    }
}

// Fallback quotes in case the JSON file is missing
function useFallbackQuotes() {
    quotesDatabase = [
        { text: "The only limit is your imagination.", author: "Anonymous" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { text: "Dream it. Wish it. Do it.", author: "Unknown" },
        { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
        { text: "Happiness depends upon ourselves.", author: "Aristotle" },
        { text: "Act as if what you do makes a difference. It does.", author: "William James" },
        { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
        { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
        { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" }
    ];
    displayRandomQuote();
}

// Display a random quote with animation effect
function displayRandomQuote() {
    if (!quotesDatabase || quotesDatabase.length === 0) {
        document.getElementById('quoteText').innerText = "No quotes available. Add some to quotes.json!";
        document.getElementById('quoteAuthor').innerText = "— editor";
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotesDatabase.length);
    const quote = quotesDatabase[randomIndex];
    
    const quoteElement = document.getElementById('quoteText');
    const authorElement = document.getElementById('quoteAuthor');
    
    // Add a smooth fade-out/in effect
    quoteElement.style.opacity = '0';
    authorElement.style.opacity = '0';
    
    setTimeout(() => {
        quoteElement.innerText = quote.text;
        authorElement.innerText = `— ${quote.author}`;
        quoteElement.style.opacity = '1';
        authorElement.style.opacity = '1';
        
        // Trigger floating particles effect on quote change
        createParticleBurst();
    }, 200);
}

// Particle burst effect when quote changes
function createParticleBurst() {
    const container = document.querySelector('.glass-container');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = `hsl(${Math.random() * 60 + 280}, 80%, 65%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        container.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 80 + 20;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let opacity = 1;
        let x = 0, y = 0;
        let life = 1;
        
        function animateParticle() {
            x += vx * 0.02;
            y += vy * 0.02;
            life -= 0.02;
            opacity = life * 0.8;
            particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            particle.style.opacity = opacity;
            
            if (life > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(animateParticle);
    }
}

// Event listener for the new quote button
document.addEventListener('DOMContentLoaded', () => {
    // Initialize flying objects
    initFlyingObjects();
    
    // Load quotes from JSON file
    loadQuotes();
    
    // Set up button click event
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', () => {
            displayRandomQuote();
            
            // Add a little haptic feedback (vibration if supported)
            if (navigator.vibrate) navigator.vibrate(50);
            
            // Extra animation: briefly scale the button
            newQuoteBtn.style.transform = 'scale(0.97)';
            setTimeout(() => {
                newQuoteBtn.style.transform = '';
            }, 150);
        });
    }
});

// Optional: add dynamic floating objects with mouse interaction (subtle)
document.addEventListener('mousemove', (e) => {
    if (!canvas) return;
    // create a gentle parallax effect for the floating objects container
    const moveX = (e.clientX - window.innerWidth / 2) * 0.002;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.002;
    if (objects.length > 0) {
        // subtle shift for objects based on mouse - adds whimsical feel
        objects.forEach((obj, idx) => {
            if (idx % 10 === 0) {
                obj.speedX += (moveX * 0.001);
                obj.speedY += (moveY * 0.001);
                // limit speed
                if (obj.speedX > 2) obj.speedX = 2;
                if (obj.speedX < -2) obj.speedX = -2;
                if (obj.speedY > 1.5) obj.speedY = 1.5;
                if (obj.speedY < -1.5) obj.speedY = -1.5;
            }
        });
    }
});

// Preload animation for canvas when tab becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && canvas && ctx) {
        // Refresh canvas context
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let obj of objects) {
            obj.draw();
        }
    }
});