const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const sound = new Audio('hit.wav');
const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 5;
const ballRadius = 10, ballSpeed = 4;
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
let winCondition = '60s';
let leftScore = 0, rightScore = 0;
let gameOver = false;
let gameInterval, timerInterval;

function drawPaddle(x, y) {
    context.fillStyle = "#fff";
    context.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

function updateScore() {
    document.getElementById('leftScore').textContent = leftScore;
    document.getElementById('rightScore').textContent = rightScore;
}

function checkWin() {
    if (winCondition === '60s') return;
    if (leftScore >= winCondition) {
        endGame('Player 1 wins!');
    } else if (rightScore >= winCondition) {
        endGame('Player 2 wins!');
    }
}

function endGame(message) {
    gameOver = true;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    setTimeout(() => alert(message), 100);
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

    if (ballY <= ballRadius || ballY >= canvas.height - ballRadius) {
        ballVelocityY = -ballVelocityY;
        sound.play();
    }

    if (
        (ballX <= paddleOffset + paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) ||
        (ballX >= canvas.width - paddleOffset - paddleWidth && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight)
    ) {
        ballVelocityX = -ballVelocityX;
        sound.play();
    }

    if (ballX < 0) {
        rightScore++;
        resetBall();
        updateScore();
        checkWin();
    } else if (ballX > canvas.width) {
        leftScore++;
        resetBall();
        updateScore();
        checkWin();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVelocityX = ballSpeed * (ballVelocityX > 0 ? 1 : -1);
    ballVelocityY = ballSpeed;
}

function gameLoop() {
    if (!gameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle(paddleOffset, leftPaddleY);
        drawPaddle(canvas.width - paddleOffset - paddleWidth, rightPaddleY);
        drawBall();
        update();
        requestAnimationFrame(gameLoop);
    }
}

function startTimer(duration) {
    let timeLeft = duration;
    document.getElementById('timeLeft').textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(leftScore > rightScore ? 'Player 1 wins!' : rightScore > leftScore ? 'Player 2 wins!' : 'It\'s a tie!');
        }
    }, 1000);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('splash').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
    }
});

document.getElementById('startButton').addEventListener('click', () => {
    mode = document.getElementById('mode

