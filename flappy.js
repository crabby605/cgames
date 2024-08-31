const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    gravity: 0.2,
    lift: -10,
    velocity: 0,
    image: new Image(),
    isFalling: false
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpeed = 2;
let frame = 0;
let score = 0;
let gameOver = false;
let currentBackground = 'bg.png';
let lastBackgroundChange = Date.now();

const backgroundImages = {
    day: 'bg.png',
    night: 'bg_night.png'
};

bird.image.src = 'https://www.pngmart.com/files/12/Flappy-Bird-PNG-Image.png';

function drawBackground() {
    const img = new Image();
    img.src = currentBackground;
    img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

function setBackground() {
    const now = Date.now();
    if (now - lastBackgroundChange > 5 * 60 * 1000) { // 5 minutes
        currentBackground = currentBackground === backgroundImages.day ? backgroundImages.night : backgroundImages.day;
        lastBackgroundChange = now;
    }
    drawBackground();
}

function drawBird() {
    context.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {
    context.fillStyle = '#2ecc71';
    context.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    context.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
}

function drawScore() {
    context.fillStyle = '#fff';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText(`Score: ${score}`, canvas.width / 2, 30);
}

function update() {
    if (gameOver) return;

    setBackground(); // Draw background first

    if (bird.isFalling) {
        bird.velocity += bird.gravity;
    }
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
        document.getElementById('score').textContent = score;
        document.getElementById('gameOver').style.display = 'block';
        return;
    }

    if (frame % 100 === 0) { // Shorter pipe interval
        const top = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({
            x: canvas.width,
            top,
            bottom: canvas.height - pipeGap - top
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }

        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
            document.getElementById('score').textContent = score;
            document.getElementById('gameOver').style.display = 'block';
        }
    });

    context.clearRect(0, 0, canvas.width, canvas.height);
    setBackground(); // Redraw background
    drawBird();
    pipes.forEach(drawPipe);
    drawScore();

    frame++;
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        bird.isFalling = true;
        bird.velocity = bird.lift;
    }
});

document.addEventListener('mousedown', () => {
    bird.isFalling = true;
    bird.velocity = bird.lift;
});

document.getElementById('restartButton').addEventListener('click', () => {
    gameOver = false;
    score = 0;
    pipes.length = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    bird.isFalling = false;
    document.getElementById('gameOver').style.display = 'none';
    lastBackgroundChange = Date.now(); // Reset background change timer
    update();
});

update();
