function startPongGame() {
    let canvas = document.getElementById("pongCanvas");
    if (!canvas) {
        console.error("❌ Erreur : Aucun canvas trouvé pour Pong !");
        return;
    }
    let playerScore = 0;
    let aiScore = 0;
    let ctx;
    
    if (canvas.transferControlToOffscreen) {
        let offscreen = canvas.transferControlToOffscreen();
        ctx = offscreen.getContext("2d");
    } else {
        ctx = canvas.getContext("2d");
    }

    function updateScore() {
        const pongScore = document.getElementById("pong-score");
        if (pongScore) {
            pongScore.textContent = `Score: ${playerScore} - ${aiScore}`;
        }
    }
    const paddleWidth = 13, paddleHeight = 60;
    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = playerY;
    const ballSize = 14;

    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 6, ballSpeedY = 4;
    const paddleSpeed = 6;

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
    
        if (ballX <= 0) { 
            aiScore++;  
            updateScore(); 
            resetBall(); 
        }
        if (ballX >= canvas.width) { 
            playerScore++; 
            updateScore();
            resetBall(); 
        }
    }

    

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    
        ballSpeedX = Math.random() > 0.5 ? 5 : -5; 
        ballSpeedY = Math.random() > 0.5 ? 3 : -3;
    }
    

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);
        ctx.fillRect(ballX, ballY, ballSize, ballSize);
        
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(playerScore, canvas.width / 4, 30);
        ctx.fillText(aiScore, (canvas.width * 3) / 4, 30);
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

