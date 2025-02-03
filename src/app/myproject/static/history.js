function showHistory() {
	const history = document.getElementById('history-container');
	if (!history) return;

	if (gameState.gameRunning)
		stopGame();
	if (gameActive)
		hideTicTacToe();
	hideProfile(history);
	hideSettings(history);

	if (!history.classList.contains('hidden'))
		history.classList.add('hidden');
	else {
		history.classList.remove('hidden');
		loadHistory();
	}
	updateURL('history')
}

var templates = {};
templates.historyElement = document.createElement('li');
templates.historyElement.innerHTML = `<p></p>`;

function loadHistory() {
	fetch('api/get-history/', {
		method: 'GET',
		credentials: 'include',
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Failed to fetch profile data');
		}
		return response.json();
	})
	.then(data => {
		const historyList = document.getElementById('history-list');
		historyList.innerHTML = '';
		if (data.length > 0) {
			data.forEach(match => {
				const gameType = match.game_type;
				const user = match.user;
				const p1Score = match.p1Score;
				const p2Score = match.p2Score;
				const result = match.result;

				let oppenant = "Opponent";
				let str = '';
				if (gameType === 'TicTacToe')
					str = `${gameType}: LLVM vs. GNU - ${result} (${p1Score} - ${p2Score})`;
				else if (gameType === 'Pong')
					str = `${gameType}: ${user} vs. ${oppenant} - ${result} - (${p1Score} - ${p2Score})`;
				const li = document.createElement('li');
				li.innerText = str;
				historyList.appendChild(li);
			});
		} else {
			const li = document.createElement('li');
			li.innerText = 'No matches played yet';
			historyList.appendChild(li);
		}
	})
	.catch(error => {
		console.error('Error loading profile:', error);
	});
}
