function showSettings() {
	const settingsContainer = document.getElementById('settings-container');
	if (!settingsContainer) return;

	if (gameState.gameRunning)
		stopGame();
	if (gameActive)
		hideTicTacToe();
	hideProfile(settingsContainer);
	hideSettings(settingsContainer);

	if (!settingsContainer.classList.contains('hidden'))
		settingsContainer.classList.add('hidden');
	else
		settingsContainer.classList.remove('hidden');
}

function showGameSettings() {
	const gameSettingsContainer = document.getElementById('pong-settings-popup');
	if (!gameSettingsContainer) return;

	if (gameState.gameRunning)
		stopGame();
	if (gameActive)
		hideTicTacToe();
	hideProfile(gameSettingsContainer);
	hideSettings(gameSettingsContainer);

	if (!gameSettingsContainer.classList.contains('hidden'))
		gameSettingsContainer.classList.add('hidden');
	else
		gameSettingsContainer.classList.remove('hidden');
}

function hideSettings(act) {
	const settingsContainer = document.getElementById('settings-container');
	const gameSettingsContainer = document.getElementById('pong-settings-popup');

	if (act != settingsContainer)
		settingsContainer.classList.add('hidden');
	if (act != gameSettingsContainer)
		gameSettingsContainer.classList.add('hidden');
}
function toggleGameSettings() {
	const settingsContainer = document.getElementById("pong-settings-popup");
	settingsContainer.classList.toggle("hidden");
}

