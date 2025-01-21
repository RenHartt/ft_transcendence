window.twoPlayers = false;
window.upPressed = false;
window.downPressed = false;
window.wPressed = false;
window.sPressed = false;
let animationFrameId = null;

const gameState = {
	BallSpeedX: 4,
	BallSpeedY: 3,
	gameRunning: false,
	basecolor: "#8b8989",
	basespeed: 4,
	generalScore: { player: 0, ai: 0 },
	start: false
};

function togglePongSettings() {
	const settingsPopup = document.getElementById('pong-settings-popup');
	const overlay = document.getElementById('pong-overlay');

	if (!settingsPopup || !overlay) return;

	settingsPopup.classList.toggle('hidden');
	overlay.classList.toggle('active');

	if (!settingsPopup.classList.contains('hidden')) {
		gameState.gameRunning = false;
	} else {
		if (document.getElementById('pong-wrapper').style.display === "block") {
			gameState.gameRunning = true;
			requestAnimationFrame(gameLoop);
		}
	}
}

function updatePaddleColor(color) {
	gameState.basecolor = color;
}

function updateBallSpeed(speed) {
	gameState.basespeed = parseFloat(speed);

	if (gameState.gameRunning) {
		const speedFactor = gameState.basespeed / Math.abs(gameState.BallSpeedX);
		gameState.BallSpeedX *= speedFactor;
		gameState.BallSpeedY *= speedFactor;
	}
}

function startPongGame() {
	let canvas = document.createElement("canvas");
	let pongContainer = document.getElementById("pong-container");
    const profileContainer = document.getElementById("profile-container").getAttributeNames(); 

	if (animationFrameId) cancelAnimationFrame(animationFrameId);

	canvas.id = "pongCanvas";
	canvas.width = 500;
	canvas.height = 300;
	console.log(canvas)
	gameState.gameRunning = true;

	let ctx = canvas.getContext("2d");
	pongContainer.appendChild(canvas);
	let playerScore = 0;
	let aiScore = 0;

	function updateScore() {
		const pongScore = document.getElementById("pong-score");
		if (pongScore) {
			pongScore.textContent = `Score: ${playerScore} - ${aiScore}`;
		}
	
		if (playerScore >= 5) {
			gameState.generalScore.player++;
			playerScore = 0; 
			aiScore = 0;
		} else if (aiScore >= 5) {
			gameState.generalScore.ai++;
			playerScore = 0; 
			aiScore = 0;
		}
	
		if (gameState.generalScore.player >= 3) {
			alert("Le joueur a gagné la partie !");
            saveGameHistory("Pong", profileContainer[0]);
			resetGame();
		} else if (gameState.generalScore.ai >= 3) {
			alert("L'IA a gagné la partie !");
			resetGame();
		}
	}
	

	const maxBallSpeed = gameState.basespeed

	const paddleWidth = 8, paddleHeight = 60;
	let playerY = canvas.height / 2 - paddleHeight / 2;
	let aiY = playerY;
	const ballSize = 14;
	let ballX = canvas.width / 2, ballY = canvas.height / 2;

	const paddleSpeed = 6;

	function resetBall() {
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
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
        if (!gameState.gameRunning) return;
    
        if (window.wPressed && playerY > 0) playerY -= paddleSpeed;
        if (window.sPressed && playerY < canvas.height - paddleHeight) playerY += paddleSpeed;
    
        if (gameState.BallSpeedX > 0) {
            playerHit = true;
        }
    
        let reactionDelay = Math.random() < 0.17;
        let aimError = (Math.random() - 0.5) * 30;
        let speedVariation = 0.25 + Math.random();
    
        if (window.twoPlayers) {
            if (window.upPressed && aiY > 0) aiY -= paddleSpeed;
            if (window.downPressed && aiY < canvas.height - paddleHeight) aiY += paddleSpeed;
        } else if (!aiFrozen && !reactionDelay && playerHit) {
            let aiCenter = aiY + paddleHeight / 2;
            if (aiCenter < ballY + aimError) aiY += paddleSpeed * speedVariation * 0.7;
            if (aiCenter > ballY + aimError) aiY -= paddleSpeed * speedVariation * 0.7;
        }
    
        ballX += gameState.BallSpeedX;
        ballY += gameState.BallSpeedY;
    
        if (ballY <= 0 || ballY >= canvas.height - ballSize) gameState.BallSpeedY *= -1;
    
        if (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) {
            gameState.BallSpeedX *= -1;
            playerHit = true;
            aiFrozen = false;
        }
    
        if (ballX >= canvas.width - paddleWidth - ballSize && ballY >= aiY && ballY <= aiY + paddleHeight) {
            gameState.BallSpeedX *= -1;
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
    
        ctx.fillStyle = gameState.basecolor
        
        ctx.beginPath();
        ctx.roundRect(0, playerY, paddleWidth, paddleHeight, 4);
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.roundRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, 4);
        ctx.fill();
        ctx.closePath();
    
        ctx.beginPath();
        ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    
        ctx.font = "20px Arial";
        ctx.fillText(playerScore, canvas.width / 4, 30);
        ctx.fillText(aiScore, (canvas.width * 3) / 4, 30);
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

function resetGame() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    gameState.gameRunning = false;
    gameState.startGame = false;
    gameState.BallSpeedX = 4;
    gameState.BallSpeedY = 3;
    gameState.basecolor = "#8b8989";
    gameState.basespeed = 4;
    gameState.generalScore.player = 0;
    gameState.generalScore.ai = 0;

    let canvas = document.getElementById("pongCanvas");
    let pongContainer = document.getElementById("pong-container");
    let pongScore = document.getElementById("pong-score");
    let stopGameButton = document.getElementById("stopGameButton");
    let startGameButton = document.getElementById("startGameButton");

    if (canvas) {
        pongContainer.removeChild(canvas);
    }
    if (pongScore) pongScore.textContent = "Score: 0 - 0";
    if (stopGameButton) stopGameButton.style.display = "none";
    if (startGameButton) startGameButton.style.display = "block";

    document.querySelector("#pong-container").innerHTML = '';

    setTimeout(() => {
        showPong();
    }, 500);
}

function stopGame() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameState.gameRunning = false;
    gameState.startGame = false;
    gameState.aiScore = 0;
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

window.togglePongSettings = function () {
	const settingsPopup = document.getElementById('pong-settings-popup');
	settingsPopup.classList.toggle('hidden');
};

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
	const pongWrapper = document.getElementById('pong-wrapper');
	const pongContainer = document.getElementById('pong-container');
	const stopGameButton = document.getElementById('stopGameButton');
	const pongScore = document.getElementById('pong-score');
	const twoPlayerButton = document.getElementById('twoPlayerButton');
    if (!pongWrapper || !pongContainer || !stopGameButton || !pongScore || !twoPlayerButton) return;

	if (gameActive)
		hideTicTacToe();
	hideProfile(pongWrapper);
	hideSettings(pongWrapper);

    if (pongWrapper.style.display === "block") {
        stopGame();                   
        pongContainer.innerHTML = '';  
        pongWrapper.style.display = "none";
        return;
    }
    gameState.startGame = false; 
    startPongGame();
    pongWrapper.style.display = "block";
    stopGameButton.style.display = "block";
    pongScore.style.display = "block";
    twoPlayerButton.style.display = "block";
}

function startGame() {
    gameState.startGame = false; 
    const startGameButton = document.getElementById('startGameButton');
    if (startGameButton) startGameButton.style.display = "none"; 
    
    const pongCanvas = document.getElementById('pongCanvas');
    if (!pongCanvas) return;
    const ctx = pongCanvas.getContext("2d");
    
    function drawCountdown(number) {
        ctx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
        
        ctx.fillStyle = "#FFFFFF";  // Fond blanc
        ctx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);
        
        ctx.fillStyle = "#000000"; 
        ctx.font = "bold 60px Arial"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(number, pongCanvas.width / 2, pongCanvas.height / 2);
    }
    
    function startCountdown() {
        let countdown = 3; 
        
        function runCountdown() {
            if (countdown >= 0) {
                drawCountdown(countdown > 0 ? countdown : "GO!");
                console.log("Affichage: ", countdown);
                
                if (countdown === 0) {
                    setTimeout(() => {
                        gameState.startGame = true;
                        gameState.gameRunning = true;
                    }, 1000);
                } else {
                    setTimeout(() => {
                        countdown--;
                        runCountdown();
                    }, 1000);
                }
            }
        }
        
        runCountdown(); 
    }
    
    startCountdown();
}



function stopGame() {
    gameState.gameRunning = false; 
    gameState.startGame = false; 
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameState.aiScore = 0;
    const pongCanvas = document.getElementById('pongCanvas');
    const stopGameButton = document.getElementById('stopGameButton');
    const pongScore = document.getElementById('pong-score');
    const twoPlayerButton = document.getElementById('twoPlayerButton');
    const pongWrapper = document.getElementById('pong-wrapper');
    const startGameButton = document.getElementById('startGameButton');

    if (pongCanvas) pongCanvas.style.display = "none";
    if (stopGameButton) stopGameButton.style.display = "none";
    if (pongScore) pongScore.style.display = "none";
    if (twoPlayerButton) twoPlayerButton.style.display = "none";
    if (pongWrapper) pongWrapper.style.display = "none";
    if (startGameButton) startGameButton.style.display = "block";

    document.querySelector("#pong-container").innerHTML = '';
}