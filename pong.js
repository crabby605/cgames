const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const hitSound = new Audio('hit.wav');
const wallSound = new Audio('wall.wav');
const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 5;
const ballSize = 10, ballSpeed = 4;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelocityX = ballSpeed;
let ballVelocityY = ballSpeed;
let leftPaddleMoveUp = false, leftPaddleMoveDown = false;
let rightPaddleMoveUp = false, rightPaddleMoveDown = false;
let difficulty = 'easy';

function drawPaddle(x, y) {
    context.fillStyle = "#fff";
    context.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    context.fillStyle = "#fff";
    context.fillRect(ballX, ballY, ballSize, ballSize);
}

function update() {
    if (leftPaddleMoveUp && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (leftPaddleMoveDown && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
    const botSpeed = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6;
    if (ballY < rightPaddleY + paddleHeight / 2) rightPaddleY -= botSpeed;
    if (ballY > rightPaddleY + paddleHeight / 2) rightPaddleY += botSpeed;
    ballX += ballVelocityX;
    ballY += ballVelocityY;
    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballVelocityY = -ballVelocityY;
        wallSound.play();
    }
    if (
        (ballX <= paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth - ballSize && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight)
    ) {
        ballVelocityX = -ballVelocityX;
        hitSound.play();
    }
    if (ballX < 0 || ballX > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballVelocityX = ballSpeed * (ballVelocityX > 0 ? 1 : -1);
        ballVelocityY = ballSpeed;
    }
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(0, leftPaddleY);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY);
    drawBall();
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('splash').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
    }
});

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('controls').style.display = 'none';
    document.getElementById('pongCanvas').style.display = 'block';
    gameLoop();
});

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            leftPaddleMoveUp = true;
            break;
        case 's':
            leftPaddleMoveDown = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            leftPaddleMoveUp = false;
            break;
        case 's':
            leftPaddleMoveDown = false;
            break;
    }
});

document.getElementById('difficultySelect').addEventListener('change', (event) => {
    difficulty = event.target.value;
});

