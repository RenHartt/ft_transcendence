let players = [];
let matches = []
let currentMatchIndex = 0;
let tournament = false;
const MAX_PLAYERS = 4;


function startPongGameTournanment() {
    let canvas = document.createElement("canvas");
    let pongContainer = document.getElementById("pong-container");
    canvas.width = 500;
    canvas.height = 300;
    let ctx = canvas.getContext("2d");
    pongContainer.innerHTML = "";
    pongContainer.appendChild(canvas);
    gameState.generalScore = {}; // ✅ Initialise l'objet des scores

    let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
    let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex')) || 0;

    if (currentIndex < storedMatches.length) {
        const [player1, player2] = storedMatches[currentIndex];

        // ✅ Assurez-vous que chaque joueur a un score initialisé
        gameState.generalScore[player1] = gameState.generalScore[player1] || 0;
        gameState.generalScore[player2] = gameState.generalScore[player2] || 0;

        gameState.scoreP1 = 0;
        gameState.scoreP2 = 0;
    }

    gameState.gameRunning = true;

    const paddleWidth = 8;
    const paddleHeight = 60;
    const paddleSpeed = 6;
    const ballSize = 14;
    
    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = playerY;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    
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
    
    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }

    function update() {
        if (!gameState.gameRunning) return;
        
        if (window.wPressed && playerY > 0) playerY -= paddleSpeed;
        if (window.sPressed && playerY < canvas.height - paddleHeight) playerY += paddleSpeed;
        if (window.upPressed && aiY > 0) aiY -= paddleSpeed;
        if (window.downPressed && aiY < canvas.height - paddleHeight) aiY += paddleSpeed;

        ballX += gameState.BallSpeedX;
        ballY += gameState.BallSpeedY;

        if (ballY <= 0 || ballY >= canvas.height - ballSize) {
            gameState.BallSpeedY *= -1;
        }
        
        if (
            ballX <= paddleWidth &&
            ballY >= playerY &&
            ballY <= playerY + paddleHeight
        ) {
            gameState.BallSpeedX *= -1;
            ballX = paddleWidth + 1;
        }
        if (
            ballX >= canvas.width - paddleWidth - ballSize &&
            ballY >= aiY &&
            ballY <= aiY + paddleHeight
        ) {
            gameState.BallSpeedX *= -1;
            ballX = canvas.width - paddleWidth - ballSize - 1;
        }

        if (ballX <= 0) {
            gameState.scoreP2++;
            resetBall();
        }
        if (ballX >= canvas.width) {
            gameState.scoreP1++;
            resetBall();
        }
    }

    function updateScore() {
        const pongScore = document.getElementById("pong-score");
        if (!gameState.gameRunning) return;
    
        let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
        let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex')) || 0;
        
        if (currentIndex >= storedMatches.length) return;
    
        const [player1, player2] = storedMatches[currentIndex]; // Récupération des joueurs du match actuel
    
        if (pongScore) {
            pongScore.textContent = `Score: ${player1}=${gameState.scoreP1} - ${player2}=${gameState.scoreP2}`;
        }
    
        if (gameState.scoreP1 >= 5) {
            gameState.generalScore[player1] = (gameState.generalScore[player1] || 0) + 1;
            gameState.scoreP1 = 0;
            gameState.scoreP2 = 0;
        } else if (gameState.scoreP2 >= 5) {
            gameState.generalScore[player2] = (gameState.generalScore[player2] || 0) + 1;
            gameState.scoreP1 = 0;
            gameState.scoreP2 = 0;
        }
    
        if (gameState.generalScore[player1] >= 3) {
            showPopup("Bravo", `${player1} gagne la partie !`, "success");
            saveGameHistory("Pong", player1, player2, gameState.generalScore[player1], gameState.generalScore[player2]);
            resetGame();
        } else if (gameState.generalScore[player2] >= 3) {
            showPopup("Bravo", `${player2} gagne la partie !`, "success");
            saveGameHistory("Pong", player1, player2, gameState.generalScore[player1], gameState.generalScore[player2]);
            resetGame();
        }
    }
    

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = gameState.basecolor;

        ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);
        ctx.beginPath();
        ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";  // Définit une police lisible
        ctx.fillText(`P1: ${gameState.scoreP1}`, 50, 20);
        ctx.fillText(`P2: ${gameState.scoreP2}`, canvas.width - 70, 20);
    }

    function gameLoop() {
        if (!gameState.gameRunning) return;
        update();
        draw();
        updateScore();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

function addPlayer() {
    const input = document.getElementById('player-name');
    const playerName = input.value.trim();
    
    if (playerName && !players.includes(playerName) && players.length < MAX_PLAYERS) {
        players.push(playerName);
        updatePlayerList();
        input.value = '';
    } else if (players.length >= MAX_PLAYERS) {
        showPopup("Error", "4 players max", "error");
    }
}

function updatePlayerList() {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        list.appendChild(li);
    });
    document.getElementById('start-tournament').disabled = players.length < 2;
}

function generateRoundRobin() {
    matches = [];
    const totalPlayers = players.length;
    
    for (let i = 0; i < totalPlayers - 1; i++) {
        for (let j = i + 1; j < totalPlayers; j++) {
            matches.push([players[i], players[j]]);
        }
    }

    matches.sort(() => Math.random() - 0.5);

    localStorage.setItem('tournamentMatches', JSON.stringify(matches));
    localStorage.setItem('currentMatchIndex', JSON.stringify(0));
}

function startTournament() {
    if (players.length >= 2) {
        localStorage.setItem('tournamentPlayers', JSON.stringify(players));

        generateRoundRobin();  // ✅ Génération des matchs

        console.log("🏆 Tournoi démarré !");
        tournament = true; // ✅ Indiquer que le tournoi est en cours
        startNextMatch(); // ✅ Démarrer le premier match
    }
}


function startNextMatch() {
    let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
    let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex')) || 0;

    if (currentIndex < storedMatches.length) {
        const [player1, player2] = storedMatches[currentIndex];

        if (!tournament) {
            toggleTwoPlayers();
            togglePongOverlay();
        }
    } else {
        console.log("🏆 Tournoi terminé !");
        tournament = false;
        togglePongOverlay();
        determineWinner();
    }
}

function declareWinner(winnerName) {
    let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
    let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex')) || 0;
    let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

    if (!players.includes(winnerName)) {
        return;
    }

    const [player1, player2] = storedMatches[currentIndex];

    const match = {
        players: [player1, player2],
        winner: winnerName,
        timestamp: new Date().toLocaleString()
    };

    gameHistory.push(match);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));

    currentIndex++;
    localStorage.setItem('currentMatchIndex', JSON.stringify(currentIndex));

    startNextMatch();
}

function determineWinner() {
    let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    let scores = {};

    players.forEach(player => scores[player] = 0);

    gameHistory.forEach(match => {
        if (match.winner in scores) {
            scores[match.winner]++;
        }
    });

    let winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    console.log(`🏆 Vainqueur du tournoi: ${winner} avec ${scores[winner]} victoires !`);
}

function togglePongOverlay() {
    const pongWrapper = document.getElementById('pong-wrapper');
    const pongContainer = document.getElementById('pong-container');
    const pongScore = document.getElementById('pong-score');
    const tournamentSection = document.getElementById('tournament-section');

    if (!pongWrapper || !pongContainer || !pongScore) return;

    if (pongWrapper.style.display === "block") {
        stopGame();                   
        pongContainer.innerHTML = '';  
        pongWrapper.style.display = "none";
        return;
    }
    
    pongWrapper.style.display = "block";
    stopGameButton.style.display = "block";
    pongScore.style.display = "block";
    tournamentSection.classList.add("hidden");
    tournament = true;
    startPongGameTournanment();
}

function showPongTournament() {
    const pongWrapper = document.getElementById('pong-wrapper');
    const historyContainer = document.getElementById('history-container');
    const profileContainer = document.getElementById('profile-container');
    const changePasswordContainer = document.getElementById('change-password-form');
    const tournamentSection = document.getElementById("tournament-section");
    const addFriendForm = document.getElementById('friend-request-form');
	const profileEditForm = document.getElementById('profile-edit-form');
	const settingsContainer = document.getElementById('settings-container');

    if (tournamentSection) {
        tournamentSection.classList.remove("hidden");
    }
    stopGame();
    pongWrapper.style.display = "none";
    historyContainer.classList.add("hidden");
    profileContainer.classList.add("hidden");
    changePasswordContainer.classList.add("hidden");
    addFriendForm.classList.add("hidden");
    profileEditForm.classList.add("hidden");
    settingsContainer.classList.add("hidden");
}

function saveGameHistory(winner) {
    let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    
    const match = {
        players: [...players],
        winner: winner || "Unknown", 
        timestamp: new Date().toLocaleString()
    };

    gameHistory.push(match);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    updateGameHistoryUI();
}

function updateGameHistoryUI() {
    const historyContainer = document.getElementById('game-history');
    historyContainer.innerHTML = ''; 

    let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    
    gameHistory.forEach((match, index) => {
        const li = document.createElement('li');
        li.textContent = `Match ${index + 1} | Joueurs: ${match.players.join(", ")} | Gagnant: ${match.winner}`;
        historyContainer.appendChild(li);
    });
}

function declareWinner(winnerName) {
    if (!players.includes(winnerName)) {
        return;
    }
    
    saveGameHistory(winnerName);
}


function endTournament(winnerName) {
    if (!winnerName) {
        return;
    }

    declareWinner(winnerName);
    players = []; 
    updatePlayerList();
}

function resetTournament() {
    players = [];
    updatePlayerList();

    localStorage.removeItem('tournamentPlayers');

    localStorage.removeItem('gameHistory');
    updateGameHistoryUI();

    stopGame();
    const tournamentSection = document.getElementById('tournament-section');
    if (tournamentSection) {
        tournamentSection.classList.remove("hidden");
    }

    const pongWrapper = document.getElementById('pong-wrapper');
    if (pongWrapper) {
        pongWrapper.style.display = "none";
    }
}
