const board = document.getElementById('board');
const winnerDisplay = document.getElementById('winner');
let currentPlayer = 'X';
let gameActive = true;

const cells = Array(9).fill(null);

function createBoard() {
    board.innerHTML = '';
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
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken');

    if (checkWinner()) {
        winnerDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (cells.every(cell => cell)) {
        winnerDisplay.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
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

createBoard();
