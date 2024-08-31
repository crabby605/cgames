const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Paddle settings
const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 5;

// Ball settings
const ballSize = 10, ballSpeed = 4;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelocityX = ballSpeed;
let ballVelocityY = ballSpeed;

let leftPaddleMoveUp = false, leftPaddleMoveDown = false;
let rightPaddleMoveUp = false, rightPaddleMoveDown = false;

// Draw paddles
function drawPaddle(x, y) {
    context.fillStyle = "#fff";
    context.fillRect(x, y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
    context.fillStyle = "#fff";
    context.fillRect(ballX, ballY, ballSize, ballSize);
}

// Update game state
function update() {
    // Move paddles
    if (leftPaddleMoveUp && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (leftPaddleMoveDown && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
    if (rightPaddleMoveUp && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
    if (rightPaddleMoveDown && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;

    // Move ball
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    // Ball collision with top and bottom
    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballVelocityY = -ballVelocityY;
    }

    // Ball collision with paddles
    if (
        (ballX <= paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth - ballSize && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight)
    ) {
        ballVelocityX = -ballVelocityX;
    }

    // Reset ball if it goes off screen
    if (ballX < 0 || ballX > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballVelocityX = ballSpeed;
        ballVelocityY = ballSpeed;
    }
}

// Game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(0, leftPaddleY);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY);
    drawBall();
    update();
    requestAnimationFrame(gameLoop);
}

// Key press events
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            leftPaddleMoveUp = true;
            break;
        case 's':
            leftPaddleMoveDown = true;
            break;
        case 'ArrowUp':
            rightPaddleMoveUp = true;
            break;
        case 'ArrowDown':
            rightPaddleMoveDown = true;
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
        case 'ArrowUp':
            rightPaddleMoveUp = false;
            break;
        case 'ArrowDown':
            rightPaddleMoveDown = false;
            break;
    }
});

// Start the game loop
gameLoop();
