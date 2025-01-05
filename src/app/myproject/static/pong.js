document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("pongCanvas");
    const pongContainer = document.getElementById("pongContainer");
    const startButton = document.getElementById("startPong");
    
    if (!canvas || !pongContainer || !startButton) return;
    
    pongContainer.style.display = "none";
    
    startButton.addEventListener("click", function () {
        pongContainer.style.display = "block";
        startButton.style.display = "none";
        gameLoop();
    });
    
    const ctx = canvas.getContext("2d");

    const paddleWidth = 10, paddleHeight = 80;
    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = playerY;
    const ballSize = 10;

    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 5, ballSpeedY = 3;
    const paddleSpeed = 5;

    let playerScore = 0, aiScore = 0;

    let upPressed = false, downPressed = false;
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") upPressed = true;
        if (e.key === "ArrowDown") downPressed = true;
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") upPressed = false;
        if (e.key === "ArrowDown") downPressed = false;
    });

    function update() {
        if (upPressed && playerY > 0) playerY -= paddleSpeed;
        if (downPressed && playerY < canvas.height - paddleHeight) playerY += paddleSpeed;

        if (aiY + paddleHeight / 2 < ballY) aiY += paddleSpeed * 0.6;
        if (aiY + paddleHeight / 2 > ballY) aiY -= paddleSpeed * 0.6;

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY <= 0 || ballY >= canvas.height - ballSize) ballSpeedY *= -1;

        if (
            ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight ||
            ballX >= canvas.width - paddleWidth - ballSize && ballY >= aiY && ballY <= aiY + paddleHeight
        ) {
            ballSpeedX *= -1;
        }

        if (ballX <= 0) { aiScore++; resetBall(); }
        if (ballX >= canvas.width) { playerScore++; resetBall(); }
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);
        ctx.fillRect(ballX, ballY, ballSize, ballSize);

        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.font = "20px Arial";
        ctx.fillText(playerScore, canvas.width / 4, 30);
        ctx.fillText(aiScore, (canvas.width * 3) / 4, 30);
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
});
