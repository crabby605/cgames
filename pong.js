const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const sound = new Audio('hit.wav');
const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 5;
const ballSize = 10, ballSpeed = 4;
const paddleOffset = 20;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelocityX = ballSpeed;
let ballVelocityY = ballSpeed;
let leftPaddleMoveUp = false, leftPaddleMoveDown = false;
let rightPaddleMoveUp = false, rightPaddleMoveDown = false;
let mode = 'ai';
let difficulty = 'easy';
let gameDuration = 60; // Default to 60 seconds
let player1Score = 0, player2Score = 0;
let gameStartTime = 0;

function drawPaddle(x, y) {
    context.fillStyle = "#fff";
    context.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

function drawScore() {
    context.fillStyle = "#fff";
    context.font = "20px Arial";
    context.textAlign = "center";
    context.fillText("Player 1: " + player1Score, canvas.width / 4, 30);
    context.fillText("Player 2: " + player2Score, canvas.width * 3 / 4, 30);
}

function update() {
    if (leftPaddleMoveUp && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (leftPaddleMoveDown && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;

    if (mode === 'ai') {
        const botSpeed = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6;
        if (ballY < rightPaddleY + paddleHeight / 2) rightPaddleY -= botSpeed;
        if (ballY > rightPaddleY + paddleHeight / 2) rightPaddleY += botSpeed;
    } else {
        if (rightPaddleMoveUp && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
        if (rightPaddleMoveDown && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;
    }

    ballX += ballVelocityX;
    ballY += ballVelocityY;

    if (ballY <= 0 || ballY >= canvas.height) {
        ballVelocityY = -ballVelocityY;
        sound.play();
    }

    if (
        (ballX <= paddleOffset + paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) ||
        (ballX >= canvas.width - paddleOffset - paddleWidth - ballSize && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight)
    ) {
        ballVelocityX = -ballVelocityX;
        sound.play();
    }

    if (ballX < 0) {
        player2Score++;
        resetBall();
    }
    if (ballX > canvas.width) {
        player1Score++;
        resetBall();
    }

    const elapsedTime = (Date.now() - gameStartTime) / 1000;
    if (elapsedTime >= gameDuration) {
        endGame();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVelocityX = ballSpeed * (ballVelocityX > 0 ? 1 : -1);
    ballVelocityY = ballSpeed;
}

function endGame() {
    document.getElementById('pongCanvas').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('player1Score').textContent = player1Score;
    document.getElementById('player2Score').textContent = player2Score;
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(paddleOffset, leftPaddleY);
    drawPaddle(canvas.width - paddleOffset - paddleWidth, rightPaddleY);
    drawBall();
    drawScore();
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
    mode = document.getElementById('modeSelect').value;
    difficulty = document.getElementById('difficultySelect').value;
    gameDuration = parseInt(document.getElementById('timerSelect').value);
    player1Score = 0;
    player2Score = 0;
    gameStartTime = Date.now();
    document.getElementById('controls').style.display = 'none';
    document.getElementById('pongCanvas').style.display = 'block';
    gameLoop();
});

document.getElementById('restartButton').addEventListener('click', () => {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('splash').style.display = 'block';
});

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            leftPaddleMoveUp = true;
           
