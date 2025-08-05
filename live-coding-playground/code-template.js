/**
 * Code Templates - Pre-built templates for the live coding platform
 */

const CodeTemplates = {
    basic: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic HTML Page</title>
</head>
<body>
    <div class="container">
        <h1>Hello World!</h1>
        <p>This is a basic HTML page. Start editing to see your changes live!</p>
        <button onclick="greet()">Click me!</button>
        
        <div class="feature-box">
            <h2>Features</h2>
            <ul>
                <li>Real-time preview</li>
                <li>Syntax highlighting</li>
                <li>Auto-save</li>
            </ul>
        </div>
    </div>
</body>
</html>`,
        css: `/* Basic styling for your HTML page */
body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

h1 {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

h2 {
    color: #34495e;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
}

p {
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

button {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

button:active {
    transform: translateY(0);
}

.feature-box {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    margin-top: 2rem;
    border-left: 4px solid #3498db;
}

ul {
    margin: 0;
    padding-left: 1.5rem;
}

li {
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

/* Responsive design */
@media (max-width: 600px) {
    .container {
        padding: 1rem;
        margin: 10px;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    button {
        width: 100%;
    }
}`,
        js: `// Basic JavaScript functionality
function greet() {
    const messages = [
        'Hello from JavaScript! 🚀',
        'Welcome to Live Coding! ✨',
        'Keep coding and learning! 💻',
        'You\\'re doing great! 🎉',
        'Time to build something amazing! 🔥'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    alert(randomMessage);
    
    console.log('🎯 Button clicked!');
    console.log('📝 Message shown:', randomMessage);
    
    // Add some visual feedback
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Clicked! ✓';
    button.style.background = 'linear-gradient(135deg, #27ae60, #229954)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }, 1000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Page loaded successfully!');
    console.log('💡 Try clicking the button above!');
    console.log('🔧 Edit the HTML, CSS, or JavaScript to see live changes!');
    
    // Add a welcome animation
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.6s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Add some interactive features
let clickCount = 0;

function trackInteraction() {
    clickCount++;
    console.log(\`🎮 Total interactions: \${clickCount}\`);
    
    if (clickCount === 5) {
        console.log('🏆 You\\'ve clicked 5 times! You\\'re getting the hang of this!');
    } else if (clickCount === 10) {
        console.log('🌟 10 clicks! You\\'re really exploring the interface!');
    }
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        trackInteraction();
    }
});`
    },

    interactive: {
        html: `<div class="app">
    <header class="app-header">
        <h1>🎮 Interactive Demo</h1>
        <p>A fully interactive demo with animations and real-time feedback</p>
    </header>

    <main class="app-content">
        <section class="counter-section">
            <h2>Smart Counter</h2>
            <div class="counter-display">
                <span id="count">0</span>
            </div>
            <div class="button-group">
                <button class="btn btn-success" onclick="increment()">
                    <i class="icon">+</i>
                    Increment
                </button>
                <button class="btn btn-danger" onclick="decrement()">
                    <i class="icon">-</i>
                    Decrement
                </button>
                <button class="btn btn-secondary" onclick="reset()">
                    <i class="icon">↻</i>
                    Reset
                </button>
            </div>
            <div class="stats">
                <div class="stat">
                    <span class="stat-label">Total clicks:</span>
                    <span id="totalClicks">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Highest value:</span>
                    <span id="highestValue">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Current streak:</span>
                    <span id="streak">0</span>
                </div>
            </div>
        </section>

        <section class="color-section">
            <h2>Color Mixer</h2>
            <div class="color-controls">
                <div class="slider-group">
                    <label for="red">Red: <span id="redValue">128</span></label>
                    <input type="range" id="red" min="0" max="255" value="128" oninput="updateColor()">
                </div>
                <div class="slider-group">
                    <label for="green">Green: <span id="greenValue">128</span></label>
                    <input type="range" id="green" min="0" max="255" value="128" oninput="updateColor()">
                </div>
                <div class="slider-group">
                    <label for="blue">Blue: <span id="blueValue">128</span></label>
                    <input type="range" id="blue" min="0" max="255" value="128" oninput="updateColor()">
                </div>
            </div>
            <div class="color-preview" id="colorPreview">
                <div class="color-info">
                    <p>RGB: <span id="rgbValue">rgb(128, 128, 128)</span></p>
                    <p>HEX: <span id="hexValue">#808080</span></p>
                </div>
            </div>
        </section>

        <section class="animation-section">
            <h2>Animation Playground</h2>
            <div class="animation-controls">
                <button class="btn btn-primary" onclick="animateBox('bounce')">Bounce</button>
                <button class="btn btn-primary" onclick="animateBox('rotate')">Rotate</button>
                <button class="btn btn-primary" onclick="animateBox('shake')">Shake</button>
                <button class="btn btn-primary" onclick="animateBox('pulse')">Pulse</button>
            </div>
            <div class="animation-box" id="animationBox">
                <span>Animate Me!</span>
            </div>
        </section>
    </main>
</div>`,
        css: `.app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 2rem;
    margin: 0;
}

.app-header {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
}

.app-header h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    animation: fadeInDown 1s ease-out;
}

.app-header p {
    font-size: 1.2rem;
    opacity: 0.9;
    animation: fadeInUp 1s ease-out 0.3s both;
}

.app-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

section {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    animation: fadeInUp 0.8s ease-out;
}

h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
}

/* Counter Section */
.counter-display {
    text-align: center;
    margin: 2rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

#count {
    font-size: 4rem;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    display: block;
    transition: all 0.3s ease;
}

.button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    min-width: 120px;
    justify-content: center;
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.btn:active {
    transform: translateY(-1px);
}

.btn-success {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
}

.btn-danger {
    background: linear-gradient(135deg, #dc3545, #fd79a8);
    color: white;
}

.btn-secondary {
    background: linear-gradient(135deg, #6c757d, #495057);
    color: white;
}

.btn-primary {
    background: linear-gradient(135deg, #007bff, #6610f2);
    color: white;
}

.icon {
    font-size: 1.2rem;
    font-weight: bold;
}

.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
}

.stat {
    text-align: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-label {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.stat span:last-child {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
}

/* Color Section */
.color-controls {
    margin-bottom: 2rem;
}

.slider-group {
    margin-bottom: 1rem;
}

.slider-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
}

input[type="range"] {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: #e9ecef;
    outline: none;
    -webkit-appearance: none;
    appearance: none; /* Added for compatibility */
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.color-preview {
    height: 150px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.color-info {
    background: rgba(255, 255, 255, 0.9);
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    backdrop-filter: blur(10px);
}

.color-info p {
    margin: 0.5rem 0;
    font-weight: 600;
}

/* Animation Section */
.animation-controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    justify-content: center;
}

.animation-box {
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
    margin: 2rem auto;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.animation-box:hover {
    transform: scale(1.05);
}

/* Animations */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    60% { transform: translateY(-15px); }
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.bounce-animation { animation: bounce 1s ease; }
.rotate-animation { animation: rotate 1s ease; }
.shake-animation { animation: shake 0.8s ease; }
.pulse-animation { animation: pulse 1s ease; }

/* Responsive Design */
@media (max-width: 768px) {
    .app {
        padding: 1rem;
    }
    
    .app-header h1 {
        font-size: 2rem;
    }
    
    .app-content {
        grid-template-columns: 1fr;
    }
    
    .button-group {
        flex-direction: column;
        align-items: center;
    }
    
    .btn {
        width: 100%;
        max-width: 200px;
    }
    
    .animation-controls {
        flex-direction: column;
        align-items: center;
    }
}`,
        js: `// Interactive Demo - Advanced JavaScript functionality
let counter = 0;
let totalClicks = 0;
let highestValue = 0;
let streak = 0;
let lastAction = '';

// Counter functions
function updateDisplay() {
    const countElement = document.getElementById('count');
    const totalClicksElement = document.getElementById('totalClicks');
    const highestValueElement = document.getElementById('highestValue');
    const streakElement = document.getElementById('streak');
    
    countElement.textContent = counter;
    totalClicksElement.textContent = totalClicks;
    highestValueElement.textContent = highestValue;
    streakElement.textContent = streak;
    
    // Add bounce animation
    countElement.classList.add('bounce-animation');
    setTimeout(() => {
        countElement.classList.remove('bounce-animation');
    }, 1000);
    
    // Update color based on value
    if (counter > 0) {
        countElement.style.color = '#27ae60';
    } else if (counter < 0) {
        countElement.style.color = '#e74c3c';
    } else {
        countElement.style.color = 'white';
    }
    
    // Update background gradient based on counter
    const display = countElement.parentElement;
    const hue = Math.abs(counter * 10) % 360;
    display.style.background = \`linear-gradient(135deg, hsl(\${hue}, 70%, 60%), hsl(\${hue + 30}, 70%, 50%))\`;
}

function increment() {
    counter++;
    totalClicks++;
    
    if (counter > highestValue) {
        highestValue = counter;
    }
    
    // Update streak
    if (lastAction === 'increment') {
        streak++;
    } else {
        streak = 1;
        lastAction = 'increment';
    }
    
    updateDisplay();
    console.log('📈 Counter incremented to:', counter);
    
    // Special effects for milestones
    if (counter % 10 === 0 && counter > 0) {
        console.log('🎉 Milestone reached:', counter);
        showCelebration();
    }
    
    if (streak >= 5) {
        console.log('🔥 Increment streak:', streak);
    }
}

function decrement() {
    counter--;
    totalClicks++;
    
    // Update streak
    if (lastAction === 'decrement') {
        streak++;
    } else {
        streak = 1;
        lastAction = 'decrement';
    }
    
    updateDisplay();
    console.log('📉 Counter decremented to:', counter);
    
    if (streak >= 5) {
        console.log('❄️ Decrement streak:', streak);
    }
}

function reset() {
    counter = 0;
    totalClicks = 0;
    highestValue = 0;
    streak = 0;
    lastAction = '';
    updateDisplay();
    console.log('🔄 Counter reset to 0');
    console.log('🆕 All stats reset!');
}

function showCelebration() {
    // Create celebration effect
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 100);
    }
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkle 2s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 2000);
}

// Color mixer functions
function updateColor() {
    const red = document.getElementById('red').value;
    const green = document.getElementById('green').value;
    const blue = document.getElementById('blue').value;
    
    // Update value displays
    document.getElementById('redValue').textContent = red;
    document.getElementById('greenValue').textContent = green;
    document.getElementById('blueValue').textContent = blue;
    
    // Create RGB and HEX values
    const rgbValue = \`rgb(\${red}, \${green}, \${blue})\`;
    const hexValue = '#' + [red, green, blue].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    
    // Update preview
    const preview = document.getElementById('colorPreview');
    preview.style.backgroundColor = rgbValue;
    
    // Update info
    document.getElementById('rgbValue').textContent = rgbValue;
    document.getElementById('hexValue').textContent = hexValue.toUpperCase();
    
    console.log('🎨 Color updated:', { rgb: rgbValue, hex: hexValue });
}

// Animation functions
function animateBox(animationType) {
    const box = document.getElementById('animationBox');
    
    // Remove any existing animation classes
    box.className = 'animation-box';
    
    // Add new animation class
    setTimeout(() => {
        box.classList.add(\`\${animationType}-animation\`);
    }, 10);
    
    // Remove animation class after completion
    setTimeout(() => {
        box.classList.remove(\`\${animationType}-animation\`);
    }, 1200);
    
    console.log(\`🎭 Animation triggered: \${animationType}\`);
}

// Add sparkle animation CSS
const sparkleCSS = \`
@keyframes sparkle {
    0% {
        opacity: 1;
        transform: scale(0) rotate(0deg);
    }
    50% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
    }
    100% {
        opacity: 0;
        transform: scale(0) rotate(360deg);
    }
}
\`;

const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);

// Initialize the demo
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    updateColor();
    
    console.log('🚀 Interactive Demo initialized!');
    console.log('🎮 Try all the interactive features:');
    console.log('  • Counter with streak tracking');
    console.log('  • Color mixer with live preview');
    console.log('  • Animation playground');
    console.log('💡 Watch the console for real-time feedback!');
    
    // Add welcome animation
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add some fun easter eggs
let konami = [];
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konami.push(e.code);
    
    if (konami.length > konamiCode.length) {
        konami.shift();
    }
    
    if (konami.join(',') === konamiCode.join(',')) {
        console.log('🎮 KONAMI CODE ACTIVATED! 🎮');
        console.log('🌟 You found the easter egg!');
        
        // Trigger celebration
        for (let i = 0; i < 30; i++) {
            setTimeout(() => createSparkle(), i * 50);
        }
        
        konami = [];
    }
});`
    },

    bootstrap: {
        html: `<div class="container-fluid bg-primary text-white py-5">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6">
                <h1 class="display-4 fw-bold mb-3">Bootstrap Components</h1>
                <p class="lead mb-4">Interactive showcase of Bootstrap's most useful components with live functionality.</p>
                <button class="btn btn-light btn-lg me-3" onclick="showModal()">
                    <i class="bi bi-rocket-takeoff"></i> Launch Modal
                </button>
                <button class="btn btn-outline-light btn-lg" onclick="toggleAlert()">
                    <i class="bi bi-bell"></i> Toggle Alert
                </button>
            </div>
            <div class="col-lg-6 text-center">
                <i class="bi bi-bootstrap display-1 opacity-75"></i>
            </div>
        </div>
    </div>
</div>

<div class="container my-5">
    <div class="row g-4">
        <div class="col-md-8">
            <div class="card shadow-lg border-0">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0">
                        <i class="bi bi-gear-fill me-2"></i>Interactive Components
                    </h4>
                </div>
                <div class="card-body">
                    <div class="alert alert-success alert-dismissible fade show" role="alert" id="dynamicAlert">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        <strong>Success!</strong> This alert can be toggled and dismissed.
                        <button type="button" class="btn-close" onclick="toggleAlert()"></button>
                    </div>
                    
                    <div class="mb-4">
                        <h5>Progress Indicators</h5>
                        <div class="progress mb-2" style="height: 25px;">
                            <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                                 role="progressbar" style="width: 75%" id="progressBar">
                                75% Complete
                            </div>
                        </div>
                        <button class="btn btn-outline-primary btn-sm" onclick="animateProgress()">
                            <i class="bi bi-arrow-repeat"></i> Animate Progress
                        </button>
                    </div>
                    
                    <div class="mb-4">
                        <h5>Form Controls</h5>
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                            <input type="text" class="form-control" placeholder="Enter your name" id="nameInput">
                            <button class="btn btn-primary" onclick="greetUser()">Greet</button>
                        </div>
                        
                        <div class="mb-3">
                            <label for="themeSelect" class="form-label">Choose Theme:</label>
                            <select class="form-select" id="themeSelect" onchange="changeTheme()">
                                <option value="primary">Primary Blue</option>
                                <option value="success">Success Green</option>
                                <option value="warning">Warning Yellow</option>
                                <option value="danger">Danger Red</option>
                                <option value="info">Info Cyan</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h5>Button Variations</h5>
                        <div class="btn-group mb-2" role="group">
                            <button class="btn btn-primary" onclick="showToast('Primary clicked!')">Primary</button>
                            <button class="btn btn-success" onclick="showToast('Success clicked!')">Success</button>
                            <button class="btn btn-warning" onclick="showToast('Warning clicked!')">Warning</button>
                            <button class="btn btn-danger" onclick="showToast('Danger clicked!')">Danger</button>
                        </div>
                        
                        <div>
                            <button class="btn btn-outline-secondary me-2" onclick="showSpinner(this)">
                                <span class="spinner-border spinner-border-sm d-none me-2"></span>
                                Load with Spinner
                            </button>
                            <button class="btn btn-info" onclick="showDropdown()">
                                <i class="bi bi-list"></i> Toggle Dropdown
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card border-primary mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Features</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Responsive Grid
                            <span class="badge bg-primary rounded-pill">✓</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Interactive Components
                            <span class="badge bg-success rounded-pill">✓</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Custom Styling
                            <span class="badge bg-info rounded-pill">✓</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            JavaScript Integration
                            <span class="badge bg-warning rounded-pill">✓</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="card border-0 shadow">
                <div class="card-body text-center">
                    <i class="bi bi-heart-fill text-danger display-4 mb-3"></i>
                    <h5>Made with Bootstrap</h5>
                    <p class="text-muted">Responsive, mobile-first CSS framework</p>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                            More Options
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="showToast('Documentation clicked!')">
                                <i class="bi bi-book me-2"></i>Documentation
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="showToast('Examples clicked!')">
                                <i class="bi bi-collection me-2"></i>Examples
                            </a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#" onclick="showToast('Support clicked!')">
                                <i class="bi bi-question-circle me-2"></i>Support
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="demoModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">
                    <i class="bi bi-star-fill me-2"></i>Bootstrap Modal
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
                <i class="bi bi-check-circle text-success display-4 mb-3"></i>
                <h4>Congratulations!</h4>
                <p>You've successfully opened a Bootstrap modal with custom styling and animations.</p>
                <div class="mt-4">
                    <button class="btn btn-success me-2" onclick="closeModal()">
                        <i class="bi bi-check"></i> Awesome!
                    </button>
                    <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Toast Container -->
<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <i class="bi bi-bell-fill text-primary me-2"></i>
            <strong class="me-auto">Bootstrap</strong>
            <small>Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body" id="toastMessage">
            Hello, world! This is a toast message.
        </div>
    </div>
</div>`,
        css: `/* Custom Bootstrap Enhancements */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
}

/* Enhanced Cards */
.card {
    transition: all 0.3s ease;
    border-radius: 15px;
    overflow: hidden;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
}

.card-header {
    border-bottom: none;
    background: linear-gradient(135deg, var(--bs-primary), var(--bs-primary-dark, #0056b3)) !important;
}

/* Enhanced Buttons */
.btn {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    position: relative;
    overflow: hidden;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn:active {
    transform: translateY(0);
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.btn:hover::before {
    left: 100%;
}

/* Enhanced Progress Bar */
.progress {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.progress-bar {
    transition: width 0.6s ease;
    border-radius: 10px;
}

/* Enhanced Modal */
.modal-content {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
    border-bottom: none;
    padding: 2rem 2rem 1rem;
}

.modal-body {
    padding: 1rem 2rem 2rem;
}

/* Enhanced Alert */
.alert {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    border-left: 4px solid;
}

.alert-success {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
    border-left-color: var(--bs-success);
}

/* Enhanced Form Controls */
.form-control, .form-select {
    border-radius: 8px;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
    transform: translateY(-1px);
}

.input-group-text {
    border-radius: 8px 0 0 8px;
    border: 2px solid #e9ecef;
    border-right: none;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

/* Enhanced List Group */
.list-group-item {
    border: none;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    padding: 1rem 1.25rem;
}

.list-group-item:hover {
    background-color: #f8f9fa;
    transform: translateX(5px);
}

.list-group-item:last-child {
    border-bottom: none;
}

/* Enhanced Dropdown */
.dropdown-menu {
    border: none;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    border-radius: 12px;
    padding: 0.5rem 0;
    animation: fadeInUp 0.3s ease;
}

.dropdown-item {
    padding: 0.75rem 1.5rem;
    transition: all 0.2s ease;
}

.dropdown-item:hover {
    background: linear-gradient(135deg, var(--bs-primary), var(--bs-primary-dark, #0056b3));
    color: white;
    transform: translateX(5px);
}

/* Enhanced Toast */
.toast {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    backdrop-filter: blur(10px);
}

.toast-header {
    border-bottom: 1px solid rgba(0,0,0,0.05);
    background: rgba(255,255,255,0.95);
}

/* Badge Enhancements */
.badge {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-radius: 20px;
}

/* Custom Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.pulse-animation {
    animation: pulse 0.6s ease;
}

/* Responsive Enhancements */
@media (max-width: 768px) {
    .btn-group {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    
    .btn-group .btn {
        border-radius: 8px !important;
        margin-bottom: 0.5rem;
    }
    
    .modal-dialog {
        margin: 1rem;
    }
    
    .container-fluid .container {
        padding: 1rem;
    }
}

/* Custom Theme Colors */
.bg-primary-gradient {
    background: linear-gradient(135deg, var(--bs-primary), var(--bs-primary-dark, #0056b3)) !important;
}

.bg-success-gradient {
    background: linear-gradient(135deg, var(--bs-success), var(--bs-success-dark, #1e7e34)) !important;
}

.bg-warning-gradient {
    background: linear-gradient(135deg, var(--bs-warning), var(--bs-warning-dark, #d39e00)) !important;
}

.bg-danger-gradient {
    background: linear-gradient(135deg, var(--bs-danger), var(--bs-danger-dark, #bd2130)) !important;
}

.bg-info-gradient {
    background: linear-gradient(135deg, var(--bs-info), var(--bs-info-dark, #117a8b)) !important;
}`,
        js: `// Bootstrap Components JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    console.log('🅱️ Bootstrap demo initialized!');
    console.log('🎯 Try all the interactive components!');
});

// Modal functions
function showModal() {
    const modal = new bootstrap.Modal(document.getElementById('demoModal'));
    modal.show();
    console.log('📱 Modal opened');
}

function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('demoModal'));
    if (modal) {
        modal.hide();
    }
    console.log('📱 Modal closed');
}

// Alert functions
function toggleAlert() {
    const alert = document.getElementById('dynamicAlert');
    if (alert.classList.contains('show')) {
        alert.classList.remove('show');
        console.log('🚨 Alert hidden');
    } else {
        alert.classList.add('show');
        console.log('🚨 Alert shown');
    }
}

// Progress bar animation
function animateProgress() {
    const progressBar = document.getElementById('progressBar');
    const randomWidth = Math.floor(Math.random() * 100) + 1;
    
    progressBar.style.width = randomWidth + '%';
    progressBar.textContent = randomWidth + '% Complete';
    
    // Change color based on progress
    progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
    if (randomWidth < 30) {
        progressBar.classList.add('bg-danger');
    } else if (randomWidth < 70) {
        progressBar.classList.add('bg-warning');
    } else {
        progressBar.classList.add('bg-success');
    }
    
    console.log('📊 Progress updated to:', randomWidth + '%');
}

// User greeting function
function greetUser() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    if (name) {
        showToast(\`Hello, \${name}! Welcome to Bootstrap! 👋\`);
        console.log('👋 Greeted user:', name);
        nameInput.value = '';
    } else {
        showToast('Please enter your name first! 😊');
        nameInput.focus();
    }
}

// Theme changing function
function changeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect.value;
    
    // Update card header
    const cardHeader = document.querySelector('.card-header');
    cardHeader.className = \`card-header bg-\${selectedTheme} text-white\`;
    
    // Update primary button
    const primaryBtn = document.querySelector('.btn-primary');
    if (primaryBtn) {
        primaryBtn.className = \`btn btn-\${selectedTheme}\`;
    }
    
    // Add visual feedback
    themeSelect.classList.add('pulse-animation');
    setTimeout(() => {
        themeSelect.classList.remove('pulse-animation');
    }, 600);
    
    showToast(\`Theme changed to \${selectedTheme}! 🎨\`);
    console.log('🎨 Theme changed to:', selectedTheme);
}

// Toast notification function
function showToast(message) {
    const toastElement = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastMessage');
    
    toastBody.textContent = message;
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    console.log('🍞 Toast shown:', message);
}

// Spinner function
function showSpinner(button) {
    const spinner = button.querySelector('.spinner-border');
    const originalText = button.innerHTML;
    
    // Show spinner
    spinner.classList.remove('d-none');
    button.disabled = true;
    
    setTimeout(() => {
        // Hide spinner
        spinner.classList.add('d-none');
        button.disabled = false;
        showToast('Loading completed! ✅');
        console.log('⏳ Spinner demo completed');
    }, 2000);
}

// Dropdown function
function showDropdown() {
    const dropdown = new bootstrap.Dropdown(document.getElementById('dropdownMenuButton'));
    dropdown.toggle();
    console.log('📋 Dropdown toggled');
}

// Add some interactive enhancements
document.addEventListener('click', function(e) {
    // Add ripple effect to buttons
    if (e.target.classList.contains('btn')) {
        createRipple(e);
    }
});

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = \`\${diameter}px\`;
    circle.style.left = \`\${event.clientX - button.offsetLeft - radius}px\`;
    circle.style.top = \`\${event.clientY - button.offsetTop - radius}px\`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Add ripple CSS
const rippleCSS = \`
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
\`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize with welcome message
setTimeout(() => {
    showToast('Welcome to Bootstrap Components Demo! 🎉');
}, 1000);`
    },

    react: {
        html: `<div id="root"></div>`,
        css: `.react-app {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 2rem;
}

.app-header {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
}

.app-title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    animation: fadeInDown 1s ease-out;
}

.app-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    animation: fadeInUp 1s ease-out 0.3s both;
}

.todo-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    animation: fadeInUp 0.8s ease-out 0.5s both;
}

.todo-form {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.todo-input {
    flex: 1;
    padding: 1rem;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.todo-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    transform: translateY(-1px);
}

.add-btn {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.add-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

.add-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.todo-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.stat-item {
    text-align: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.stat-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stat-number {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
    display: block;
}

.stat-label {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.25rem;
}

.todo-filters {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.5rem 1rem;
    background: #e9ecef;
    color: #495057;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.filter-btn.active {
    background: #007bff;
    color: white;
    transform: scale(1.05);
}

.filter-btn:hover {
    background: #007bff;
    color: white;
}

.todo-list {
    min-height: 200px;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    transition: all 0.3s ease;
    animation: slideIn 0.3s ease;
}

.todo-item:hover {
    background: #f8f9fa;
}

.todo-item:last-child {
    border-bottom: none;
}

.todo-checkbox {
    margin-right: 1rem;
    transform: scale(1.2);
    cursor: pointer;
}

.todo-text {
    flex: 1;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #6c757d;
    opacity: 0.7;
}

.todo-date {
    font-size: 0.8rem;
    color: #666;
    margin-right: 1rem;
}

.todo-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-btn {
    color: #007bff;
}

.edit-btn:hover {
    background: rgba(0, 123, 255, 0.1);
}

.delete-btn {
    color: #dc3545;
}

.delete-btn:hover {
    background: rgba(220, 53, 69, 0.1);
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #6c757d;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.clear-completed {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #6c757d, #495057);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
}

.clear-completed:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 117, 125, 0.4);
}

.clear-completed:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.todo-priority {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
    flex-shrink: 0;
}

.priority-high { background-color: #dc3545; }
.priority-medium { background-color: #ffc107; }
.priority-low { background-color: #28a745; }

.edit-input {
    flex: 1;
    padding: 0.5rem;
    border: 2px solid #007bff;
    border-radius: 6px;
    font-size: 1rem;
    margin-right: 0.5rem;
}

.save-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
}

.cancel-btn {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-left: 0.5rem;
}

/* Animations */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .react-app {
        padding: 1rem;
    }
    
    .todo-container {
        padding: 1.5rem;
    }
    
    .app-title {
        font-size: 2rem;
    }
    
    .todo-form {
        flex-direction: column;
    }
    
    .add-btn {
        width: 100%;
        justify-content: center;
    }
    
    .todo-stats {
        grid-template-columns: 1fr 1fr;
    }
    
    .todo-filters {
        justify-content: center;
    }
    
    .todo-item {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .todo-actions {
        order: 3;
        width: 100%;
        justify-content: center;
    }
}`,
        js: `// React-style Todo App with Advanced Features
class TodoApp {
    constructor() {
        this.state = {
            todos: [
                { 
                    id: 1, 
                    text: 'Welcome to React-style Todo! 🎉', 
                    completed: false, 
                    priority: 'high',
                    createdAt: new Date(),
                    editing: false 
                },
                { 
                    id: 2, 
                    text: 'Try adding, editing, and completing todos', 
                    completed: false, 
                    priority: 'medium',
                    createdAt: new Date(Date.now() - 86400000),
                    editing: false 
                },
                { 
                    id: 3, 
                    text: 'Experience React-like state management', 
                    completed: true, 
                    priority: 'low',
                    createdAt: new Date(Date.now() - 172800000),
                    editing: false 
                }
            ],
            inputValue: '',
            nextId: 4,
            filter: 'all' // all, active, completed
        };
        
        this.render();
        this.bindEvents();
        console.log('⚛️ React-style Todo App initialized!');
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
        this.logStats();
    }
    
    addTodo() {
        const text = this.state.inputValue.trim();
        if (!text) return;
        
        const newTodo = {
            id: this.state.nextId,
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date(),
            editing: false
        };
        
        this.setState({
            todos: [...this.state.todos, newTodo],
            inputValue: '',
            nextId: this.state.nextId + 1
        });
        
        console.log('✅ Added todo:', text);
        this.showAnimation('add');
    }
    
    toggleTodo(id) {
        const todos = this.state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        
        this.setState({ todos });
        
        const todo = todos.find(t => t.id === id);
        console.log(todo.completed ? '✅ Completed:' : '🔄 Uncompleted:', todo.text);
        this.showAnimation(todo.completed ? 'complete' : 'uncomplete');
    }
    
    deleteTodo(id) {
        const todo = this.state.todos.find(t => t.id === id);
        const todos = this.state.todos.filter(todo => todo.id !== id);
        
        this.setState({ todos });
        console.log('🗑️ Deleted todo:', todo.text);
        this.showAnimation('delete');
    }
    
    editTodo(id) {
        const todos = this.state.todos.map(todo =>
            todo.id === id ? { ...todo, editing: true } : { ...todo, editing: false }
        );
        
        this.setState({ todos });
        console.log('✏️ Editing todo:', id);
        
        // Focus the edit input after render
        setTimeout(() => {
            const editInput = document.querySelector('.edit-input');
            if (editInput) editInput.focus();
        }, 10);
    }
    
    saveTodo(id, newText) {
        if (!newText.trim()) {
            this.deleteTodo(id);
            return;
        }
        
        const todos = this.state.todos.map(todo =>
            todo.id === id ? { ...todo, text: newText.trim(), editing: false } : todo
        );
        
        this.setState({ todos });
        console.log('💾 Saved todo:', newText.trim());
    }
    
    cancelEdit(id) {
        const todos = this.state.todos.map(todo =>
            todo.id === id ? { ...todo, editing: false } : todo
        );
        
        this.setState({ todos });
        console.log('❌ Cancelled editing:', id);
    }
    
    clearCompleted() {
        const completedCount = this.state.todos.filter(t => t.completed).length;
        const todos = this.state.todos.filter(todo => !todo.completed);
        
        this.setState({ todos });
        console.log(\`🧹 Cleared \${completedCount} completed todos\`);
        this.showAnimation('clear');
    }
    
    setFilter(filter) {
        this.setState({ filter });
        console.log(\`🔍 Filter changed to: \${filter}\`);
    }
    
    updateInput(value) {
        this.setState({ inputValue: value });
    }
    
    getFilteredTodos() {
        switch (this.state.filter) {
            case 'active':
                return this.state.todos.filter(t => !t.completed);
            case 'completed':
                return this.state.todos.filter(t => t.completed);
            default:
                return this.state.todos;
        }
    }
    
    getStats() {
        const total = this.state.todos.length;
        const completed = this.state.todos.filter(t => t.completed).length;
        const remaining = total - completed;
        
        return { total, completed, remaining };
    }
    
    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays === 0) return 'Today';
        if (diffDays <= 7) return \`\${diffDays} days ago\`;
        return date.toLocaleDateString();
    }
    
    showAnimation(type) {
        // Add visual feedback based on action type
        const container = document.querySelector('.todo-container');
        if (!container) return;
        
        container.style.transform = 'scale(1.02)';
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 150);
    }
    
    logStats() {
        const stats = this.getStats();
        console.log(\`📊 Stats - Total: \${stats.total}, Completed: \${stats.completed}, Remaining: \${stats.remaining}\`);
    }
    
    bindEvents() {
        // Handle Enter key in input
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.target.classList.contains('todo-input')) {
                    this.addTodo();
                } else if (e.target.classList.contains('edit-input')) {
                    const id = parseInt(e.target.dataset.id);
                    this.saveTodo(id, e.target.value);
                }
            } else if (e.key === 'Escape' && e.target.classList.contains('edit-input')) {
                const id = parseInt(e.target.dataset.id);
                this.cancelEdit(id);
            }
        });
    }
    
    render() {
        const stats = this.getStats();
        const filteredTodos = this.getFilteredTodos();
        
        const root = document.getElementById('root');
        root.innerHTML = \`
            <div class="react-app">
                <div class="app-header">
                    <h1 class="app-title">⚛️ React-Style Todo App</h1>
                    <p class="app-subtitle">Built with vanilla JavaScript using React patterns</p>
                </div>
                
                <div class="todo-container">
                    <div class="todo-form">
                        <input 
                            type="text" 
                            class="todo-input"
                            placeholder="What needs to be done?" 
                            value="\${this.state.inputValue}"
                            oninput="todoApp.updateInput(this.value)"
                        >
                        <button 
                            class="add-btn" 
                            onclick="todoApp.addTodo()" 
                            \${!this.state.inputValue.trim() ? 'disabled' : ''}
                        >
                            <span>➕</span>
                            Add Todo
                        </button>
                    </div>
                    
                    <div class="todo-stats">
                        <div class="stat-item">
                            <span class="stat-number">\${stats.total}</span>
                            <span class="stat-label">Total Tasks</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">\${stats.completed}</span>
                            <span class="stat-label">Completed</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">\${stats.remaining}</span>
                            <span class="stat-label">Remaining</span>
                        </div>
                    </div>
                    
                    <div class="todo-filters">
                        <button 
                            class="filter-btn \${this.state.filter === 'all' ? 'active' : ''}"
                            onclick="todoApp.setFilter('all')"
                        >
                            All (\${stats.total})
                        </button>
                        <button 
                            class="filter-btn \${this.state.filter === 'active' ? 'active' : ''}"
                            onclick="todoApp.setFilter('active')"
                        >
                            Active (\${stats.remaining})
                        </button>
                        <button 
                            class="filter-btn \${this.state.filter === 'completed' ? 'active' : ''}"
                            onclick="todoApp.setFilter('completed')"
                        >
                            Completed (\${stats.completed})
                        </button>
                    </div>
                    
                    <div class="todo-list">
                        \${filteredTodos.length === 0 ? \`
                            <div class="empty-state">
                                <div class="empty-icon">
                                    \${this.state.filter === 'completed' ? '🎉' : 
                                      this.state.filter === 'active' ? '📝' : '📋'}
                                </div>
                                <h3>\${this.state.filter === 'completed' ? 'No completed tasks!' :
                                      this.state.filter === 'active' ? 'No active tasks!' :
                                      'No todos yet!'}</h3>
                                <p>\${this.state.filter === 'completed' ? 'Complete some tasks to see them here.' :
                                      this.state.filter === 'active' ? 'All tasks are completed! 🎉' :
                                      'Add your first todo above to get started.'}</p>
                            </div>
                        \` : filteredTodos.map(todo => \`
                            <div class="todo-item \${todo.completed ? 'completed' : ''}">
                                <div class="todo-priority priority-\${todo.priority}"></div>
                                <input 
                                    type="checkbox" 
                                    class="todo-checkbox"
                                    \${todo.completed ? 'checked' : ''}
                                    onchange="todoApp.toggleTodo(\${todo.id})"
                                >
                                \${todo.editing ? \`
                                    <input 
                                        type="text" 
                                        class="edit-input"
                                        value="\${todo.text}"
                                        data-id="\${todo.id}"
                                    >
                                    <button 
                                        class="save-btn"
                                        onclick="todoApp.saveTodo(\${todo.id}, document.querySelector('.edit-input').value)"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        class="cancel-btn"
                                        onclick="todoApp.cancelEdit(\${todo.id})"
                                    >
                                        Cancel
                                    </button>
                                \` : \`
                                    <span class="todo-text">\${todo.text}</span>
                                    <span class="todo-date">\${this.formatDate(todo.createdAt)}</span>
                                    <div class="todo-actions">
                                        <button 
                                            class="action-btn edit-btn" 
                                            onclick="todoApp.editTodo(\${todo.id})"
                                            title="Edit todo"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            class="action-btn delete-btn" 
                                            onclick="todoApp.deleteTodo(\${todo.id})"
                                            title="Delete todo"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                \`}
                            </div>
                        \`).join('')}
                    </div>
                    
                    \${stats.completed > 0 ? \`
                        <button 
                            class="clear-completed" 
                            onclick="todoApp.clearCompleted()"
                        >
                            🧹 Clear Completed (\${stats.completed})
                        </button>
                    \` : ''}
                </div>
            </div>
        \`;
        
        // Apply transitions to new elements
        this.applyTransitions();
    }
    
    applyTransitions() {
        // Add entrance animations to todo items
        const todoItems = document.querySelectorAll('.todo-item');
        todoItems.forEach((item, index) => {
            item.style.animation = \`slideIn 0.3s ease \${index * 0.1}s both\`;
        });
    }
}

// Initialize the Todo App
const todoApp = new TodoApp();

// Make it globally accessible for HTML event handlers
window.todoApp = todoApp;

// Add some advanced features
class TodoEnhancements {
    static init() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'a':
                        e.preventDefault();
                        todoApp.setFilter('all');
                        break;
                    case 'p':
                        e.preventDefault();
                        todoApp.setFilter('active');
                        break;
                    case 'd':
                        e.preventDefault();
                        todoApp.setFilter('completed');
                        break;
                }
            }
        });
        
        // Add auto-save functionality
        let autoSaveTimer;
        const originalSetState = todoApp.setState.bind(todoApp);
        todoApp.setState = function(newState) {
            originalSetState(newState);
            
            // Auto-save after 2 seconds of inactivity
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                localStorage.setItem('react-todos', JSON.stringify(this.state.todos));
                console.log('💾 Auto-saved todos to localStorage');
            }, 2000);
        };
        
        // Load saved todos
        try {
            const savedTodos = localStorage.getItem('react-todos');
            if (savedTodos) {
                const todos = JSON.parse(savedTodos);
                todoApp.setState({ 
                    todos: todos.map(todo => ({
                        ...todo,
                        createdAt: new Date(todo.createdAt)
                    }))
                });
                console.log('📂 Loaded saved todos from localStorage');
            }
        } catch (error) {
            console.warn('Failed to load saved todos:', error);
        }
        
        console.log('🔧 Todo enhancements loaded!');
        console.log('⌨️ Keyboard shortcuts: Ctrl+A (All), Ctrl+P (Active), Ctrl+D (Completed)');
    }
}

// Initialize enhancements
TodoEnhancements.init();

console.log('⚛️ React-style Todo App initialized!');
console.log('🚀 Try adding, editing, completing, and filtering todos!');
console.log('💡 This demonstrates React patterns with vanilla JavaScript');
console.log('🎯 Features: State management, component lifecycle, event handling, and more!');`
    }
};

// Export templates for use in live coding platform
if (typeof window !== 'undefined') {
    window.CodeTemplates = CodeTemplates;
}