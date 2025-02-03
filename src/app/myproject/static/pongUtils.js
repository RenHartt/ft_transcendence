function toggleFourPlayers() {
    window.fourPlayers = !window.fourPlayers;
    window.twoPlayers = false;
    multiplayer = true;
}

function toggleTwoPlayers() {
	window.twoPlayers = !window.twoPlayers;
    window.fourPlayers = false;
}

function toggleGameSettings() {
    const settingsContainer = document.getElementById("pong-settings-popup");
    settingsContainer.classList.toggle("hidden");
}

window.togglePongSettings = function () {
    const settingsPopup = document.getElementById('pong-settings-popup');
    settingsPopup.classList.toggle('hidden');
};

function hideGameSettings() {
    document.getElementById("pong-settings-popup").classList.add("hidden");
}

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

function resetGame() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    gameState.gameRunning = false;
    gameState.startGame = false;
    gameState.BallSpeedX = 4;
    gameState.BallSpeedY = 3;
    gameState.basecolor = "#8b8989";
    gameState.basespeed = 4;
    gameState.generalScore.ai = 0;
    gameState.generalScore.player1 = 0;
    gameState.generalScore.player2 = 0;
    gameState.generalScore.player3 = 0;
    gameState.generalScore.player4 = 0;

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
    }, 50);
}

function stopGame() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameState.gameRunning = false;
    gameState.startGame = false;
    gameState.aiScore = 0;
    let canvas = document.getElementById("pongCanvas");
    let stopGameButton = document.getElementById("stopGameButton");
    let pongScore = document.getElementById("pong-score");
    multiplayer = false;
	if (canvas) canvas.style.display = "none";
	if (stopGameButton) stopGameButton.style.display = "none";
	if (pongScore) pongScore.style.display = "none";
}

function showPong() {
	const pongWrapper = document.getElementById('pong-wrapper');
	const pongContainer = document.getElementById('pong-container');
	const stopGameButton = document.getElementById('stopGameButton');
	const pongScore = document.getElementById('pong-score');
	const twoPlayerButton = document.getElementById('twoPlayerButton');
    const fourPlayerButton = document.getElementById('fourPlayerButton');
    if (!pongWrapper || !pongContainer || !stopGameButton ||
        !pongScore || !twoPlayerButton || !fourPlayerButton) return;

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
    fourPlayerButton.style.display = "block";
	updateURL('pong')
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
        
        ctx.fillStyle = "#FFFFFF"; 
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
    multiplayer = false;
    const pongCanvas = document.getElementById('pongCanvas');
    const stopGameButton = document.getElementById('stopGameButton');
    const pongScore = document.getElementById('pong-score');
    const twoPlayerButton = document.getElementById('twoPlayerButton');
    const fourPlayerButton = document.getElementById('fourPlayerButton');
    const pongWrapper = document.getElementById('pong-wrapper');
    const startGameButton = document.getElementById('startGameButton');

    if (pongCanvas) pongCanvas.style.display = "none";
    if (stopGameButton) stopGameButton.style.display = "none";
    if (pongScore) pongScore.style.display = "none";
    if (twoPlayerButton) twoPlayerButton.style.display = "none";
    if (fourPlayerButton) fourPlayerButton.style.display = "none";
    if (pongWrapper) pongWrapper.style.display = "none";
    if (startGameButton) startGameButton.style.display = "block";

    document.querySelector("#pong-container").innerHTML = '';
}
