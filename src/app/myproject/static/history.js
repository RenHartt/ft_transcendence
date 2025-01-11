function showHistory() {
	const profileContainer    = document.getElementById('profile-container');
	const profileEditForm     = document.getElementById('profile-edit-form');
	const friendrequest       = document.getElementById('friend-request-form');
	const changePasswordForm  = document.getElementById('change-password-form');
	const settingsPopup       = document.getElementById('pong-settings-popup');
	const history             = document.getElementById('history-constainer');

	if (gameState.gameRunning) {
		stopGame();
	}
	if (gameActive) {
		hideTicTacToe();
	}

	profileContainer.classList.add('hidden');
	profileEditForm.classList.add('hidden');
	changePasswordForm.classList.add('hidden');
	friendrequest.classList.add('hidden');
	settingsPopup.classList.add('hidden');
	history.classList.remove('hidden');
}