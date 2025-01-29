window.twoPlayers = false;
window.fourPlayers = false;
window.upPressed = false;
window.downPressed = false;
window.wPressed = false;
window.iPressed = false;
window.uPressed = false;
window.sPressed = false;
window.rPressed = false;
window.tPressed = false;    
let animationFrameId = null;
let multiplayer = false;

const gameState = {
	BallSpeedX: 4,
	BallSpeedY: 3,
	gameRunning: false,
	basecolor: "#8b8989",
	basespeed: 4,
    generalScore: {
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0
      },        
      start: false
};

function startPongGame() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    let canvas = document.createElement("canvas");
    let pongContainer = document.getElementById("pong-container");
    canvas.id = "pongCanvas";
    canvas.width = 500;
    canvas.height = 300;
    let ctx = canvas.getContext("2d");
    pongContainer.appendChild(canvas);

    gameState.gameRunning = true;

    const paddleWidth = 8;
    const paddleHeight = 60;
    const paddleSpeed = 6;
    const ballSize = 14;

    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = playerY;

    let player1Y = canvas.height / 4 - paddleHeight / 2;
    let player2Y = (canvas.height * 3) / 4 - paddleHeight / 2;
    let player3Y = canvas.height / 4 - paddleHeight / 2;
    let player4Y = (canvas.height * 3) / 4 - paddleHeight / 2;

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;

    let scoreP1 = 0
    let scoreP2 = 0;
    let scoreLeft = 0;
    let scoreRight = 0;

    let playerHit = false;
    let aiFrozen = false;

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") window.upPressed = true;
        if (e.key === "ArrowDown") window.downPressed = true;
        if (e.key === "w") window.wPressed = true;
        if (e.key === "s") window.sPressed = true;
        if (e.key === "i") window.iPressed = true;
        if (e.key === "k") window.kPressed = true;
        if (e.key === "r") window.rPressed = true;
        if (e.key === "t") window.tPressed = true;
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") window.upPressed = false;
        if (e.key === "ArrowDown") window.downPressed = false;
        if (e.key === "w") window.wPressed = false;
        if (e.key === "s") window.sPressed = false;
        if (e.key === "i") window.iPressed = false;
        if (e.key === "k") window.kPressed = false;
        if (e.key === "r") window.rPressed = false;
        if (e.key === "t") window.tPressed = false;
    });

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }

    function updateScore() {
        const pongScore = document.getElementById("pong-score");
        if (!gameState.gameRunning) return;
        if (window.fourPlayers) {
            if (pongScore) {
                pongScore.textContent = `Score: (Left) ${scoreLeft} - ${scoreRight} (Right)`;
            }
            if (scoreLeft >= 5) {
                gameState.generalScore.player1++;
                gameState.generalScore.player2++;
                scoreLeft = 0;
                scoreRight = 0;
            } else if (scoreRight >= 5) {
                gameState.generalScore.player3++;
                gameState.generalScore.player4++;
                scoreLeft = 0;
                scoreRight = 0;
            }
            let teamLeft = gameState.generalScore.player1 + gameState.generalScore.player2;
            let teamRight = gameState.generalScore.player3 + gameState.generalScore.player4;
            if (teamLeft >= 3) {
                showPopup("Bravo", "L'équipe de gauche (P1/P2) gagne la partie !", "success");
                saveGameHistory("Pong", "TeamLeft", "TeamRight", teamLeft, teamRight);
                resetGame();
            } else if (teamRight >= 3) {
                showPopup("Bravo", "L'équipe de droite (P3/P4) gagne la partie !", "success");
                saveGameHistory("Pong", "TeamLeft", "TeamRight", teamLeft, teamRight);
                resetGame();
            }
        }
        else if (window.twoPlayers) {
            if (pongScore) {
                pongScore.textContent = `Score: P1=${scoreP1} - P2=${scoreP2}`;
            }
            if (scoreP1 >= 5) {
                gameState.generalScore.player1++;
                scoreP1 = 0;
                scoreP2 = 0;
            } else if (scoreP2 >= 5) {
                gameState.generalScore.player2++;
                scoreP1 = 0;
                scoreP2 = 0;
            }
            if (gameState.generalScore.player1 >= 3) {
                showPopup("Bravo", "Le joueur1 gagne la partie !", "success");
                saveGameHistory("Pong", "Player1", "Player2", gameState.generalScore.player1, gameState.generalScore.player2);
                resetGame();
            } else if (gameState.generalScore.player2 >= 3) {
                showPopup("Bravo", "Le joueur2 gagne la partie !", "success");
                saveGameHistory("Pong", "Player1", "Player2", gameState.generalScore.player1, gameState.generalScore.player2);
                resetGame();
            }
        }
        else {
            if (pongScore) {
                pongScore.textContent = `Score: P1=${scoreP1} - IA=${scoreP2}`;
            }
            if (scoreP1 >= 5) {
                gameState.generalScore.player1++;
                scoreP1 = 0;
                scoreP2 = 0;
            } else if (scoreP2 >= 5) {
                gameState.generalScore.player2++;
                scoreP1 = 0;
                scoreP2 = 0;
            }
            if (gameState.generalScore.player1 >= 3) {
                showPopup("Bravo", "Le joueur a gagné la partie !", "success");
                saveGameHistory("Pong", "Player1", "IA", gameState.generalScore.player1, gameState.generalScore.player2);
                resetGame();
            } else if (gameState.generalScore.player2 >= 3) {
                showPopup("Bravo", "L'IA a gagné la partie !", "success");
                saveGameHistory("Pong", "Player2", "IA", gameState.generalScore.player1, gameState.generalScore.player2);
                resetGame();
            }
        }
    }

    function update() {
        if (!gameState.gameRunning) return;

        if (window.fourPlayers) {
            if (window.wPressed && player1Y > 0) player1Y -= paddleSpeed;
            if (window.sPressed && player1Y < canvas.height - paddleHeight) player1Y += paddleSpeed;
            if (window.upPressed && player2Y > 0) player2Y -= paddleSpeed;
            if (window.downPressed && player2Y < canvas.height - paddleHeight) player2Y += paddleSpeed;
            if (window.iPressed && player3Y > 0) player3Y -= paddleSpeed;
            if (window.kPressed && player3Y < canvas.height - paddleHeight) player3Y += paddleSpeed;
            if (window.rPressed && player4Y > 0) player4Y -= paddleSpeed;
            if (window.tPressed && player4Y < canvas.height - paddleHeight) player4Y += paddleSpeed;
        }
        else if (window.twoPlayers) {
            if (window.wPressed && playerY > 0) playerY -= paddleSpeed;
            if (window.sPressed && playerY < canvas.height - paddleHeight) playerY += paddleSpeed;
            if (window.upPressed && aiY > 0) aiY -= paddleSpeed;
            if (window.downPressed && aiY < canvas.height - paddleHeight) aiY += paddleSpeed;
        }
        else {
            if (window.wPressed && playerY > 0) playerY -= paddleSpeed;
            if (window.sPressed && playerY < canvas.height - paddleHeight) playerY += paddleSpeed;
            if (gameState.BallSpeedX > 0) playerHit = true;
            let reactionDelay = Math.random() < 0.17;
            let aimError = (Math.random() - 0.5) * 30;
            let speedVariation = 0.25 + Math.random();
            if (!aiFrozen && !reactionDelay && playerHit) {
                let aiCenter = aiY + paddleHeight / 2;
                if (aiCenter < ballY + aimError) aiY += paddleSpeed * speedVariation * 0.7;
                if (aiCenter > ballY + aimError) aiY -= paddleSpeed * speedVariation * 0.7;
            }
        }

        ballX += gameState.BallSpeedX;
        ballY += gameState.BallSpeedY;

        if (ballY <= 0 || ballY >= canvas.height - ballSize) {
            gameState.BallSpeedY *= -1;
        }

        if (!window.fourPlayers) {
            if (
                ballX <= paddleWidth &&
                ballY >= playerY &&
                ballY <= playerY + paddleHeight
            ) {
                gameState.BallSpeedX *= -1;
                playerHit = true;
                aiFrozen = false;
            }
            if (
                ballX >= canvas.width - paddleWidth - ballSize &&
                ballY >= aiY &&
                ballY <= aiY + paddleHeight
            ) {
                gameState.BallSpeedX *= -1;
                aiFrozen = true;
                playerHit = false;
            }
        } else {
            if (
                ballX <= paddleWidth &&
                ballY >= player1Y &&
                ballY <= player1Y + paddleHeight
            ) {
                gameState.BallSpeedX *= -1;
            }
            if (
                ballX <= paddleWidth &&
                ballY >= player2Y &&
                ballY <= player2Y + paddleHeight
            ) {
                gameState.BallSpeedX *= -1;
            }
            if (
                ballX >= canvas.width - paddleWidth - ballSize &&
                ballY >= player3Y &&
                ballY <= player3Y + paddleHeight
            ) {
                gameState.BallSpeedX *= -1;
            }
            if (
                ballX >= canvas.width - paddleWidth - ballSize &&
                ballY >= player4Y &&
                ballY <= player4Y + paddleHeight
            ) {
                gameState.BallSpeedX *= -1;
            }
        }

        if (ballX <= 0) {
            if (window.fourPlayers) {
                scoreRight++;
            } else {
                scoreP2++;
            }
            updateScore();
            resetBall();
            playerHit = false;
            aiFrozen = false;
        }
        if (ballX >= canvas.width) {
            if (window.fourPlayers) {
                scoreLeft++;
            } else {
                scoreP1++;
            }
            updateScore();
            resetBall();
            playerHit = false;
            aiFrozen = false;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = gameState.basecolor;

        if (window.fourPlayers) {
            ctx.beginPath();
            ctx.roundRect(0, player1Y, paddleWidth, paddleHeight, 4);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.roundRect(0, player2Y, paddleWidth, paddleHeight, 4);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.roundRect(canvas.width - paddleWidth, player3Y, paddleWidth, paddleHeight, 4);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.roundRect(canvas.width - paddleWidth, player4Y, paddleWidth, paddleHeight, 4);
            ctx.fill();
            ctx.closePath();
        } 
        else {
            ctx.beginPath();
            ctx.roundRect(0, playerY, paddleWidth, paddleHeight, 4);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.roundRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, 4);
            ctx.fill();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    function gameLoop() {
        if (!gameState.gameRunning) return;
        if (gameState.startGame) {
            update();
            draw();
        }
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    gameState.gameRunning = true;
    updateScore();
    gameLoop();
}
