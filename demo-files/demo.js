// Demo JavaScript
// This code will be wrapped in an IIFE to prevent variable conflicts

const demoBtn = document.getElementById('demoBtn');
let clickCount = 0;

if (demoBtn) {
    demoBtn.addEventListener('click', function () {
        clickCount++;

        // Create a fun animation
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        demoBtn.style.background = randomColor;
        demoBtn.textContent = `Clicked ${clickCount} time${clickCount !== 1 ? 's' : ''}!`;

        // Add a celebration effect
        createConfetti();

        // Reset after 2 seconds
        setTimeout(() => {
            demoBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            demoBtn.textContent = 'Click Me Again!';
        }, 2000);
    });
}

function createConfetti() {
    const container = document.querySelector('.container');

    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';

        document.body.appendChild(confetti);

        // Animate falling
        let pos = -10;
        const interval = setInterval(() => {
            pos += 5;
            confetti.style.top = pos + 'px';
            confetti.style.opacity = (1 - pos / window.innerHeight).toString();

            if (pos > window.innerHeight) {
                clearInterval(interval);
                confetti.remove();
            }
        }, 20);
    }
}

// Log a message to show the script is working
console.log('✨ StackPack Demo Script Loaded!');
console.log('This script is wrapped in an IIFE to prevent variable conflicts.');
