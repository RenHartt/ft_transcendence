window.twoPlayers = false;
window.upPressed = false;
window.downPressed = false;
window.wPressed = false;
window.sPressed = false;
let gameRunning = false;
let animationFrameId = null;

function startPongGame() {
    let canvas = document.createElement("canvas");
    let pongContainer = document.getElementById("pong-container");

    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    canvas.id = "pongCanvas";
    canvas.width = 500;
    canvas.height = 300;
    console.log(canvas)


    let ctx = canvas.getContext("2d");
    pongContainer.appendChild(canvas);
    let playerScore = 0;
    let aiScore = 0;

    function updateScore() {
        const pongScore = document.getElementById("pong-score");
        if (pongScore) pongScore.textContent = `Score: ${playerScore} - ${aiScore}`;
    }

    const initialBallSpeedX = 4;
    const initialBallSpeedY = 3;
    const maxBallSpeed = 6;

    const paddleWidth = 8, paddleHeight = 60;
    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = playerY;
    const ballSize = 14;
    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = initialBallSpeedX, ballSpeedY = initialBallSpeedY;
    const paddleSpeed = 6;

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = initialBallSpeedX * (Math.random() < 0.5 ? 1 : -1);
        ballSpeedY = initialBallSpeedY * (Math.random() < 0.5 ? 1 : -1);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") window.upPressed = true;
        if (e.key === "ArrowDown") window.downPressed = true;
        if (e.key === "w") window.wPressed = true;
        if (e.key === "s") window.sPressed = true;
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") window.upPressed = false;
        if (e.key === "ArrowDown") window.downPressed = false;
        if (e.key === "w") window.wPressed = false;
        if (e.key === "s") window.sPressed = false;
    });


    let playerHit = false; 
    let aiFrozen = false; 
    
    function update() {
        if (!gameRunning) return;
    
        if (window.wPressed && playerY > 0) playerY -= paddleSpeed;
        if (window.sPressed && playerY < canvas.height - paddleHeight) playerY += paddleSpeed;
    
        if (ballSpeedX > 0) {
            playerHit = true;
        }
    
        if (window.twoPlayers) {
            if (window.upPressed && aiY > 0) aiY -= paddleSpeed;
            if (window.downPressed && aiY < canvas.height - paddleHeight) aiY += paddleSpeed;
        } else if (playerHit && !aiFrozen) { 
            let aiCenter = aiY + paddleHeight / 2;
            if (aiCenter < ballY - 10) aiY += paddleSpeed * 0.7;
            if (aiCenter > ballY + 10) aiY -= paddleSpeed * 0.7;
        }
    
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    
        if (ballY <= 0 || ballY >= canvas.height - ballSize) ballSpeedY *= -1;
    
        if (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) {
            ballSpeedX *= -1;
            ballSpeedX = Math.min(maxBallSpeed, Math.abs(ballSpeedX)) * Math.sign(ballSpeedX);
            ballSpeedY = Math.min(maxBallSpeed, Math.abs(ballSpeedY)) * Math.sign(ballSpeedY);
    
            playerHit = true;
            aiFrozen = false;
        }
    
        if (ballX >= canvas.width - paddleWidth - ballSize && ballY >= aiY && ballY <= aiY + paddleHeight) {
            ballSpeedX *= -1;
            ballSpeedX = Math.min(maxBallSpeed, Math.abs(ballSpeedX)) * Math.sign(ballSpeedX);
            ballSpeedY = Math.min(maxBallSpeed, Math.abs(ballSpeedY)) * Math.sign(ballSpeedY);
    
            aiFrozen = true;
            playerHit = false; 
        }
    
        if (ballX <= 0) {
            aiScore++;
            updateScore();
            resetBall();
            playerHit = false; 
            aiFrozen = false;
        }
        if (ballX >= canvas.width) {
            playerScore++;
            updateScore();
            resetBall();
            playerHit = false;
            aiFrozen = false;
        }
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

    function gameLoop() {
        if (!gameRunning) return;
        update();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    gameRunning = true;
    updateScore();
    gameLoop();
}

function resetGame() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameRunning = false;

    let canvas = document.getElementById("pongCanvas");
    let pongContainer = document.getElementById("pong-container");
    let pongScore = document.getElementById("pong-score");
    let stopGameButton = document.getElementById("stopGameButton");

    if (canvas) {
        pongContainer.removeChild(canvas);
    }
    if (pongScore) pongScore.textContent = "Score: 0 - 0";
    if (stopGameButton) stopGameButton.style.display = "none";
}


function stopGame() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameRunning = false;
    console.log("🛑 Arrêter le jeu Pong");
    let canvas = document.getElementById("pongCanvas");
    let stopGameButton = document.getElementById("stopGameButton");
    let pongScore = document.getElementById("pong-score");

    if (canvas) canvas.style.display = "none";
    if (stopGameButton) stopGameButton.style.display = "none";
    if (pongScore) pongScore.style.display = "none";
}

function toggleTwoPlayers() {
    window.twoPlayers = !window.twoPlayers;
}



function replayGame() {
    const board = document.getElementById('board');
    const winner = document.getElementById('winner');
    const replayBtn = document.getElementById('replay-btn');

    if (board && winner && replayBtn) {
        board.innerHTML = '';
        winner.innerHTML = '';
        replayBtn.style.display = 'none';
        createBoard(staticUrls);
    }
}

function showPong() {
    const pongWrapper         = document.getElementById('pong-wrapper');
    const pongContainer       = document.getElementById('pong-container');
    const profileContainer    = document.getElementById('profile-container');
    const profileEditForm     = document.getElementById('profile-edit-form');
    const changePasswordForm  = document.getElementById('change-password-form');
    const overlay             = document.getElementById('overlay');
    const ticTacToeModal      = document.getElementById('tic-tac-toe-modal');
    const stopGameButton      = document.getElementById('stopGameButton');
    const pongScore           = document.getElementById('pong-score');
    const twoPlayerButton     = document.getElementById('twoPlayerButton');

    if (!pongWrapper)
        return;

    if (pongWrapper.style.display === "block") {
        stopGame();                   
        pongContainer.innerHTML = '';  
        pongWrapper.style.display = "none";
        return;
    }

    profileContainer.classList.add('hidden');
    profileEditForm.classList.add('hidden');
    changePasswordForm.classList.add('hidden');

    overlay.classList.remove('active');
    ticTacToeModal.classList.remove('active');
    startPongGame();
    pongWrapper.style.display = "block";
    stopGameButton.style.display = "block";
    pongScore.style.display = "block";
    twoPlayerButton.style.display = "block";
}


function stopGame() {
    gameRunning = false; 

    const pongCanvas = document.getElementById('pongCanvas');
    const stopGameButton = document.getElementById('stopGameButton');
    const pongScore = document.getElementById('pong-score');
    const twoPlayerButton = document.getElementById('twoPlayerButton');
    const pongWrapper = document.getElementById('pong-wrapper');

    pongCanvas.style.display = "none"; 
    stopGameButton.style.display = "none";
    pongScore.style.display = "none"; 
    twoPlayerButton.style.display = "none";
    pongWrapper.style.display = "none"
    document.querySelector("#pong-container").innerHTML = '';

}