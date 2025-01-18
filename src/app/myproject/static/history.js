function showHistory() {
    const profileContainer    = document.getElementById('profile-container');
    const profileEditForm     = document.getElementById('profile-edit-form');
    const friendrequest       = document.getElementById('friend-request-form');
    const changePasswordForm  = document.getElementById('change-password-form');
    const settingsPopup       = document.getElementById('pong-settings-popup');
    const history             = document.getElementById('history-constainer');
	if (gameActive)
		hideTicTacToe();
    if (!profileContainer || !profileEditForm || !friendrequest || !changePasswordForm || !settingsPopup || !history) {
        return;
    }

    if (!history.classList.contains('hidden')) {
        history.classList.add('hidden');
    } else {
        profileContainer.classList.add('hidden');
        profileEditForm.classList.add('hidden');
        changePasswordForm.classList.add('hidden');
        friendrequest.classList.add('hidden');
        settingsPopup.classList.add('hidden');
        history.classList.remove('hidden');
		consoleq.log("loading history");
        loadHistory();
    }
}


var templates = {};
templates.historyElement = document.createElement('li');
templates.historyElement.innerHTML = `
<p><\p>
`;

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