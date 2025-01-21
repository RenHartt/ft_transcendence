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
		saveGameHistory(currentPlayer);
		return;
	}

	if (cells.every(cell => cell)) {
		winnerDisplay.textContent = "It's a draw!";
		gameActive = false;
		saveGameHistory('Draw');
		return;
	}

	currentPlayer = currentPlayer === 'LLVM' ? 'GNU' : 'LLVM';
}

function saveGameHistory(winner) {
	const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value; // Assuming you have CSRF setup
	const user = document.getElementById('user-info').dataset.username;
	const data = {
		user: user,
		pWin: winner,
		p1Score: winner === 'LLVM' ? 1 : 0,
		p2Score: winner === 'GNU' ? 1 : 0
	};

	console.log('Saving game history:', JSON.stringify(data));

	fetch('/api/save-history/', { // Replace with your actual endpoint
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken
		},
		body: JSON.stringify(data)
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(error => {
				throw new Error(`Request failed: ${error.message}`);
			});
		}
		return response.json();
	})
	.then(result => {
		console.log('Success:', result);
	})
	.catch(error => {
		console.error('Error:', error);
	});
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

function replayGame() {
	createBoard(staticUrls);
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
