function showSettings() {
    const profileContainer = document.getElementById('profile-container');
    const profileEditForm = document.getElementById('profile-edit-form');
    const changePasswordForm = document.getElementById('change-password-form');
    const addFriendForm = document.getElementById("friend-request-form");
    const settingsContainer = document.getElementById('settings-container');
    const gameSettingsContainer = document.getElementById('game-settings-container');

    if (!settingsContainer || !profileContainer || !profileEditForm || !changePasswordForm || !addFriendForm) {
        return;
    }

    if (!settingsContainer.classList.contains('hidden')) {
        settingsContainer.classList.add('hidden');
    } else {
        profileContainer.classList.add('hidden');
        profileEditForm.classList.add('hidden');
        changePasswordForm.classList.add('hidden');
        addFriendForm.classList.add('hidden');
        settingsContainer.classList.remove('hidden');
        gameSettingsContainer.classList.add('hidden');
    }
}


function showGameSettings() {
    const gameSettingsContainer = document.getElementById('game-settings-container');
    const settingsContainer = document.getElementById('settings-container');
    const profileContainer = document.getElementById('profile-container');
    const profileEditForm = document.getElementById('profile-edit-form');
    const changePasswordForm = document.getElementById('change-password-form');
    const addFriendForm = document.getElementById("friend-request-form");
    const historyContainer = document.getElementById('history-container');

    if (!gameSettingsContainer || !settingsContainer) {
        return;
    }

    if (!gameSettingsContainer.classList.contains('hidden')) {
        gameSettingsContainer.classList.add('hidden');
    } else {
        settingsContainer.classList.add('hidden');
        gameSettingsContainer.classList.remove('hidden');
        profileContainer.classList.add('hidden');
        profileEditForm.classList.add('hidden');
        changePasswordForm.classList.add('hidden');
        addFriendForm.classList.add('hidden');
        historyContainer.classList.add('hidden');
    }
}

function hideGameSettings() {
    const gameSettingsContainer = document.getElementById('game-settings-container');
    const settingsContainer = document.getElementById('settings-container');

    if (!gameSettingsContainer || !settingsContainer) {
        return;
    }

    gameSettingsContainer.classList.add('hidden');
    settingsContainer.classList.remove('hidden');
}