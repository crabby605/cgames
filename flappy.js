const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -12,
    velocity: 0,
    color: '#f1c40f'
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpeed = 2;
let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
    context.fillStyle = bird.color;
    context.fillRect(bird.x, bird.y, bird.width, bird.height);
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

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
        document.getElementById('score').textContent = score;
        document.getElementById('gameOver').style.display = 'block';
        return;
    }

    if (frame % 90 === 0) {
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
    drawBird();
    pipes.forEach(drawPipe);
    drawScore();

    frame++;
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        bird.velocity = bird.lift;
    }
});

document.getElementById('restartButton').addEventListener('click', () => {
    gameOver = false;
    score = 0;
    pipes.length = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    document.getElementById('gameOver').style.display = 'none';
    update();
});

update();
