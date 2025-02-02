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
    }
}

function showPongTournament() {
    console.log("Bouton Tournoi cliqué !");
    
    const tournamentSection = document.getElementById("tournament-section");
    
    if (tournamentSection) {
        tournamentSection.classList.remove("hidden");
    }
}
