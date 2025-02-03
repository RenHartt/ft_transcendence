let players = [];
let matches = []
let currentMatchIndex = 0;
let tournament = false;
const MAX_PLAYERS = 4;

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

        generateRoundRobin();

        console.log("Tournoi démarré !");
        startNextMatch();
    }
}

function startNextMatch() {
    let storedMatches = JSON.parse(localStorage.getItem('tournamentMatches')) || [];
    let currentIndex = JSON.parse(localStorage.getItem('currentMatchIndex')) || 0;

    if (currentIndex < storedMatches.length) {
        const [player1, player2] = storedMatches[currentIndex];

        console.log(`🔵 Match ${currentIndex + 1}: ${player1} vs ${player2}`);
        console.log("➡️ Attente de la déclaration du gagnant...");

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
        console.warn("⚠️ Erreur: Le gagnant n'est pas un joueur du tournoi !");
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

    console.log(`✅ Match ${currentIndex + 1} terminé. Gagnant: ${winnerName}`);

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
    startPongGame();
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
        console.warn("Le gagnant n'est pas un joueur du tournoi !");
        return;
    }
    
    saveGameHistory(winnerName);
    console.log(`Tournament winner: ${winnerName}`);
}


function endTournament(winnerName) {
    if (!winnerName) {
        console.warn("Aucun gagnant défini !");
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
