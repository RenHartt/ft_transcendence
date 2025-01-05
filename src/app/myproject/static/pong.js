function startPongGame() {
    let canvas = document.getElementById("pongCanvas");
    if (!canvas) {
        console.error("❌ Erreur : Aucun canvas trouvé pour Pong !");
        return;
    }

    let ctx;
    
    if (canvas.transferControlToOffscreen) {
        let offscreen = canvas.transferControlToOffscreen();
        ctx = offscreen.getContext("2d");
    } else {
        ctx = canvas.getContext("2d");
    }
    
    const paddleWidth = 10, paddleHeight = 80;
    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = playerY;
    const ballSize = 10;

    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 5, ballSpeedY = 3;
    const paddleSpeed = 5;

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
            (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) ||
            (ballX >= canvas.width - paddleWidth - ballSize && ballY >= aiY && ballY <= aiY + paddleHeight)
        ) {
            ballSpeedX *= -1;
        }

        if (ballX <= 0) { resetBall(); }
        if (ballX >= canvas.width) { resetBall(); }
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
    }

    let lastTime = 0;

    function gameLoop(timestamp) {
        if (timestamp - lastTime < 16) { 
            setTimeout(() => requestAnimationFrame(gameLoop), 16);
            return;
        }
        lastTime = timestamp;
    
        update();
        draw();
        setTimeout(() => requestAnimationFrame(gameLoop), 16);

    }
    

    gameLoop();
}
