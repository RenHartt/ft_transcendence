const board = document.getElementById('board');
const winnerDisplay = document.getElementById('winner');
let currentPlayer = 'LLVM';
let gameActive = true;

const cells = Array(9).fill(null);

function createBoard() {
	board.innerHTML = '';
	cells.fill(null); 
	gameActive = true; 
	winnerDisplay.textContent = ''; 
	cells.forEach((cell, index) => {
		const cellDiv = document.createElement('div');
		cellDiv.classList.add('cell');
		cellDiv.dataset.index = index;
		cellDiv.addEventListener('click', handleCellClick);
		board.appendChild(cellDiv);
	});
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (cells[index] || !gameActive) return;

    cells[index] = currentPlayer;

    const img = document.createElement('img');
    img.src = currentPlayer === 'LLVM' ? staticUrls.x : staticUrls.o;
    img.alt = currentPlayer;
    img.style.width = '100%';
    img.style.height = '100%';
    e.target.appendChild(img);

    e.target.classList.add('taken');

    if (checkWinner()) {
        winnerDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        
        let p1 = "LLVM";
        let p2 = "GNU";
        let p1Score = currentPlayer === "LLVM" ? 1 : 0;
        let p2Score = currentPlayer === "GNU" ? 1 : 0;

        saveGameHistory("TicTacToe", p1, p2, p1Score, p2Score);
        return;
    }

    if (cells.every(cell => cell)) {
        winnerDisplay.textContent = "It's a draw!";
        gameActive = false;
        saveGameHistory("TicTacToe", "LLVM", "GNU", 0, 0);
        return;
    }

    currentPlayer = currentPlayer === 'LLVM' ? 'GNU' : 'LLVM';
}

function saveGameHistory(gameType, p1, p2, p1Score, p2Score) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const user = document.getElementById('user-info').dataset.username;

    let result = "Draw";
    if (p1Score > p2Score) result = "Win";
    else if (p2Score > p1Score) result = "Lose";

    const data = {
        user: user,
        p1: p1,
        p2: p2,
        p1Score: p1Score,
        p2Score: p2Score,
        game_type: gameType,
        result: result
    };

    fetch('/api/save-history/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        fetch("/api/user_stats/", { cache: "no-cache" })
            .then(response => response.json())
            .then(data => {
                document.querySelector("#pong-stats").innerHTML = `
                    Played : ${data.pong.played} | Win : ${data.pong.won} | Loses : ${data.pong.lost} | Winrate : ${data.pong.winrate}%
                `;

                document.querySelector("#tic-tac-toe-stats").innerHTML = `
                    Played : ${data.tic_tac_toe.played} | Win : ${data.tic_tac_toe.won} | Loses : ${data.tic_tac_toe.lost} | Winrate : ${data.tic_tac_toe.winrate}%
                `;
            });
    })
    .catch(error => console.error("❌ Erreur lors de la sauvegarde :", error));
}

function checkWinner() {
	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	return winningCombinations.some(combination => {
		const [a, b, c] = combination;
		return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
	});
}

function replayGameTicTacToe() {
	const board = document.getElementById('board');
	const winner = document.getElementById('winner');
	const replayBtn = document.getElementById('replay-btn');

	if (board && winner && replayBtn) {
		board.innerHTML = '';
		winner.innerHTML = '';
		createBoard(staticUrls);
	}
}

function showTicTacToe() {
	const overlay = document.getElementById('overlay');
	const modal = document.getElementById('tic-tac-toe-modal');
	if (!overlay || !modal) return;

    createBoard(staticUrls);
	if (gameState.gameRunning)
		stopGame();
	hideProfile(overlay);
	hideSettings(overlay);
	
	gameActive = true;
	overlay.classList.add('active');
	modal.classList.add('active');
	createBoard(staticUrls);
	updateURL('tictactoe')
}

function hideTicTacToe() {
	gameActive = false;
	const overlay = document.getElementById('overlay');
	const modal = document.getElementById('tic-tac-toe-modal');

	if (overlay && modal) {
		overlay.classList.remove('active');
		modal.classList.remove('active'); 
	}
}
