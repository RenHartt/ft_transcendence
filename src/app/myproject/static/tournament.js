let players = [];

function addPlayer() {
    const input = document.getElementById('player-name');
    const playerName = input.value.trim();
    
    if (playerName && !players.includes(playerName)) {
        players.push(playerName);
        updatePlayerList();
        input.value = '';
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

function startTournament() {
    if (players.length >= 2) {
        localStorage.setItem('tournamentPlayers', JSON.stringify(players));
        console.log("Go");
        toggleTwoPlayers();
        togglePongOverlay();  // Utilisation de la nouvelle fonction
    }
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
    startPongGame();
}


function showPongTournament() {
    console.log("Bouton Tournoi cliqué !");
    
    const tournamentSection = document.getElementById("tournament-section");
    
    if (tournamentSection) {
        tournamentSection.classList.remove("hidden");
    }
}

function saveGameHistory(winner) {
    let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    
    const match = {
        players: [...players],
        winner: winner || "Inconnu",
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
        li.textContent = `Match ${index + 1} | Joueurs: ${match.players.join(", ")} | Gagnant: ${match.winner} | ${match.timestamp}`;
        historyContainer.appendChild(li);
    });
}

function declareWinner(winnerName) {
    if (!players.includes(winnerName)) {
        console.warn("Le gagnant n'est pas un joueur du tournoi !");
        return;
    }
    
    saveGameHistory(winnerName);
    console.log(`Gagnant du tournoi : ${winnerName}`);
}

function endTournament(winnerName) {
    declareWinner(winnerName);
    players = []; 
    updatePlayerList();
}
