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
}

var templates = {};
templates.historyElement = document.createElement('li');
templates.historyElement.innerHTML = `<p><\p>`;

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
				const user = match.user;
				const pWin = match.pWin;
				const p1Score = match.p1Score;
				const p2Score = match.p2Score;
				var str = "";
				const li = templates.historyElement.cloneNode(true);
				if (p1Score == 0 && p2Score == 0)
					str = user + " " + pWin;
				else
					str = user + ":\t" + "LLVM " + p1Score + "\t" + "GNU " + p2Score + "\tWINNER: " + pWin;
				li.querySelector('p').innerText = str;
				historyList.appendChild(li);
			});
		}
	})
	.catch(error => {
		console.error('Error loading profile:', error);
	});
}