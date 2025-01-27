
function showProfile() {
	const profileContainer = document.getElementById('profile-container');
	if (!profileContainer) return;

	if (gameState.gameRunning)
		stopGame();
	if (gameActive)
		hideTicTacToe();
	hideProfile(profileContainer);
	hideSettings(profileContainer);

	if (!profileContainer.classList.contains('hidden'))
		profileContainer.classList.add('hidden');
	else
		profileContainer.classList.remove('hidden');

	if (!templates.friendElement || !templates.friendRequestElement) {
		templates.friendElement = document.createElement('li');
		templates.friendElement.innerHTML = `
			<span class="profile-status"></span>
			<strong></strong>
			<button class="remove-btn" data-friend-id="">Remove</button>
		`;

		templates.friendRequestElement = document.createElement('li');
		templates.friendRequestElement.innerHTML = `
			<strong></strong>
			<button class="accept-btn" data-request-id="">Accept</button>
			<button class="decline-btn" data-request-id="">Decline</button>
		`;
	}

	loadProfile();
}

function hideProfile(act) {
	const profileContainer		= document.getElementById('profile-container');
	const profileEditForm		= document.getElementById('profile-edit-form');
	const changePasswordForm	= document.getElementById('change-password-form');
	const addFriendForm			= document.getElementById("friend-request-form");
	const history				= document.getElementById('history-container');

	if (act != profileContainer)
		profileContainer.classList.add('hidden');
	if (act != profileEditForm)
		profileEditForm.classList.add('hidden');
	if (act != changePasswordForm)
		changePasswordForm.classList.add('hidden');
	if (act != addFriendForm)
		addFriendForm.classList.add('hidden');
	if (act != history)
		history.classList.add('hidden');
}

function loadProfile() {
    if (gameState.gameRunning)
        stopGame(); 
    if (gameActive)
        hideTicTacToe();

    fetch('/api/profile', {
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
        document.getElementById('profile-username').textContent = data.username;
        document.getElementById('profile-email').textContent = data.email || 'N/A';
        document.getElementById('profile-first-name').textContent = data.first_name || 'N/A';
        document.getElementById('profile-last-name').textContent = data.last_name || 'N/A';

		const friendsList = document.getElementById('friends-list');
		friendsList.innerHTML = '';

		if (!templates.friendElement) {
			console.error("templates.friendElement is still undefined. Skipping friends list rendering.");
			return;
		}

		if (data.friends.length > 0) {
			data.friends.forEach(friend => {
				const isRequester = friend.requester__username === data.username;
				const friendName = isRequester ? friend.receiver__username : friend.requester__username;
				const friendStatus = isRequester ? friend.receiver__is_logged_in : friend.requester__is_logged_in;

				const li = templates.friendElement.cloneNode(true);
				li.querySelector('.profile-status').innerText = friendStatus ? '🟢' : '🔴';
				li.querySelector('strong').innerText = friendName;
				li.querySelector('.remove-btn').dataset.friendId = friend.id;
				friendsList.appendChild(li);
			});
		} else {
			friendsList.innerHTML = '<li>No friends yet.</li>';
		}

		const friendRequestsList = document.getElementById('friend-requests-list');
		friendRequestsList.innerHTML = '';

		if (!templates.friendRequestElement) {
			console.error("templates.friendRequestElement is still undefined. Skipping friend requests.");
			return;
		}

		if (data.pending_requests.length > 0) {
			data.pending_requests.forEach(request => {
				const li = templates.friendRequestElement.cloneNode(true);
				li.querySelector('strong').innerText = request.requester__username;
				li.querySelector('.accept-btn').dataset.requestId = request.id;
				li.querySelector('.decline-btn').dataset.requestId = request.id;
				friendRequestsList.appendChild(li);
			});
		} else {
			friendRequestsList.innerHTML = '<li>No pending friend requests.</li>';
		}

		document.querySelectorAll('.accept-btn').forEach(button => {
			button.addEventListener('click', () => handleFriendRequest(button.dataset.requestId, true));
		});

		document.querySelectorAll('.decline-btn').forEach(button => {
			button.addEventListener('click', () => handleFriendRequest(button.dataset.requestId, false));
		});

		document.querySelectorAll('.remove-btn').forEach(button => {
			button.addEventListener('click', () => remove_friend(button.dataset.friendId));
		});
	})
	.catch(error => {
		console.error('Error loading profile:', error);
	});
}

function editProfile() {
    if (gameState.gameRunning)
        stopGame(); 
    if (gameActive)
        hideTicTacToe();
	
	const profileEditForm = document.getElementById('profile-edit-form');
	if (!profileEditForm) return;

	if (gameState.gameRunning)
		stopGame();
	if (gameActive)
		hideTicTacToe();
	hideProfile(profileEditForm);
	hideSettings(profileEditForm);

	if (!profileEditForm.classList.contains('hidden'))
		profileEditForm.classList.add('hidden');
	else
		profileEditForm.classList.remove('hidden');

    document.getElementById('saveProfileButton').addEventListener('click', () => {
        const email = document.getElementById('edit-email').value;
        const firstName = document.getElementById('edit-first-name').value;
        const lastName = document.getElementById('edit-last-name').value;
        const password = document.getElementById('edit-password');
        const confirmPassword = document.getElementById('edit-confirm-password');
        
        if (!profileContainer || !profileEditForm) return;
        
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        fetch('/api/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf,
            },
            body: JSON.stringify({
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour du profil');
                }
                return response.json();
            })
            .then(data => {
                document.querySelector('#profile-container p:nth-child(3)').textContent = `Email: ${data.email}`;
                document.querySelector('#profile-container p:nth-child(4)').textContent = `First Name: ${data.first_name}`;
                document.querySelector('#profile-container p:nth-child(5)').textContent = `Last Name: ${data.last_name}`;
                profileEditForm.classList.add('hidden');
                profileContainer.classList.remove('hidden');
            })
            .catch(error => {
                alert("Une erreur s'est produite lors de la mise à jour du profil.");
            });
    });

	document.getElementById('cancelEditButton').addEventListener('click', () => {
		profileEditForm.classList.add('hidden');
		profileContainer.classList.remove('hidden');
	});


	document.getElementById('cancelPasswordButton').addEventListener('click', () => {
		const changePasswordForm = document.getElementById('change-password-form');
		const profileEditForm = document.getElementById('profile-edit-form');
		if (!changePasswordForm || !profileEditForm) {
			return;
		}
		changePasswordForm.classList.add('hidden');
		profileEditForm.classList.remove('hidden');
	});

	document.getElementById('cancelEditButton').addEventListener('click', () => {
		const profileEditForm = document.getElementById('profile-edit-form');
		const profileContainer = document.getElementById('profile-container');
		if (!profileEditForm || !profileContainer) {
			return;
		}
		profileEditForm.classList.add('hidden');
		profileContainer.classList.remove('hidden');
	});

	document.getElementById('savePasswordButton').addEventListener('click', () => {
		const oldPassword = document.getElementById('old-password').value;
		const newPassword = document.getElementById('new-password').value;
		const confirmPassword = document.getElementById('confirm-password').value;
		if (!oldPassword || !newPassword || !confirmPassword) {
			alert("Veuillez remplir tous les champs.");
			return;
		}
		console.log("Old Password:", oldPassword, "New Password:", newPassword, "Confirm Password:", confirmPassword);
		if (newPassword !== confirmPassword) {
			alert("Les mots de passe ne correspondent pas.");
			return;
		}
		fetch('/api/change-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrf,
			},
			body: JSON.stringify({
				old_password: oldPassword,
				new_password: newPassword,
			}),
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Erreur lors du changement de mot de passe");
				}
				return response.json();
			})
			.then(data => {
				document.getElementById('change-password-form').classList.add('hidden');
				document.getElementById('profile-edit-form').classList.remove('hidden');
			})
			.catch(error => {
				alert("Une erreur s'est produite lors du changement de mot de passe.");
			});
	});
}

function addFriend() {
	const addFriendForm = document.getElementById('friend-request-form');  
	if (!addFriendForm) return;

	if (gameState.gameRunning)
		stopGame();
	if (gameActive)
		hideTicTacToe();
	hideProfile(addFriendForm);
	hideSettings(addFriendForm);

	const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');
	const cancelFriendRequestButton = document.getElementById('cancelFriendRequestButton');
	const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]'); 
	const csrfToken = csrfTokenElement ? csrfTokenElement.value : null;

	if (!addFriendForm.classList.contains('hidden')) {
		addFriendForm.classList.add('hidden');
	} else
		addFriendForm.classList.remove('hidden');

	sendFriendRequestButton.addEventListener('click', () => {
		const friendUsername = document.getElementById('friend-username')?.value;
		if (!friendUsername) {
			alert("Veuillez entrer un nom d'utilisateur.");
			return;
		}

		fetch('/api/send-friend-request/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
			},
			credentials: 'include',
			body: JSON.stringify({ username: friendUsername }),
		})
		.then(response => {
			if (!response.ok) {
				return response.json().then(data => {
					throw new Error(data.error || "Erreur lors de l'ajout de l'ami.");
				});
			}
			return response.json();
		})
		.then(data => {
			alert(data.message || "Ami ajouté avec succès.");
			addFriendForm.classList.add('hidden');
			profileContainer.classList.remove('hidden');
		})
		.catch(error => {
			alert(error.message || "Une erreur s'est produite lors de la requête.");
		});
	});

	cancelFriendRequestButton.addEventListener('click', () => {
		addFriendForm.classList.add('hidden');
		profileContainer.classList.remove('hidden');
	});
}

function handleFriendRequest(requestId, accept) {
	const url = accept
		? `/api/accept-friend-request/${requestId}/`
		: `/api/decline-friend-request/${requestId}/`;

	fetch(url, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrf,
		},
		credentials: 'include',
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Failed to handle friend request');
		}
		return response.json();
	})
	.then(data => {
		alert(data.message || 'Action successful');
		loadProfile();
	})
	.catch(error => {
		console.error('Error handling friend request:', error);
		alert('Failed to handle friend request');
	});
}

function remove_friend(friendId) {
	fetch(`/api/remove-friend/${friendId}/`, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrf,
		},
		credentials: 'include',
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Failed to remove friend');
		}
		return response.json();
	})
	.then(data => {
		alert(data.message || 'Friend removed');
		loadProfile();
	})
	.catch(error => {
		alert('Failed to remove friend');
	});
}

function showChangePassword() {
	const changePasswordForm = document.getElementById('change-password-form');
	if (!changePasswordForm) return;

	if (gameState.gameRunning)
		stopGame();
	if (gameActive)
		hideTicTacToe();
	hideProfile(changePasswordForm);
	hideSettings(changePasswordForm);

	if (!changePasswordForm.classList.contains('hidden'))
		changePasswordForm.classList.add('hidden');
	else {
		changePasswordForm.classList.remove('hidden');
		setupProfileEvents();
	}
}

function savePassword() {
	const oldPassword = document.getElementById('old-password').value;
	const newPassword = document.getElementById('new-password').value;
	const confirmPassword = document.getElementById('confirm-password').value;

	if (newPassword !== confirmPassword) {
		alert("Les mots de passe ne correspondent pas.");
		return;
	}

	fetch('/api/change-password', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrf,
		},
		body: JSON.stringify({
			old_password: oldPassword,
			new_password: newPassword
		}),
	})
	.then(response => {
		if (!response.ok) {
			throw new Error("Erreur lors du changement de mot de passe");
		}
		return response.json();
	})
	.then(() => {
		alert("Mot de passe mis à jour !");
		showProfile();
	})
	.catch(error => {
		alert("Une erreur s'est produite lors du changement de mot de passe.");
	});
}

function saveProfile() {
	const email = document.getElementById('edit-email').value;
	const firstName = document.getElementById('edit-first-name').value;
	const lastName = document.getElementById('edit-last-name').value;

	fetch('/api/update-profile', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrf,
		},
		body: JSON.stringify({
			email: email,
			first_name: firstName,
			last_name: lastName
		}),
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Erreur lors de la mise à jour du profil');
		}
		return response.json();
	})
	.then(data => {
		document.getElementById('profile-email').textContent = data.email;
		document.getElementById('profile-first-name').textContent = data.first_name;
		document.getElementById('profile-last-name').textContent = data.last_name;
		showProfile(); 
	})
	.catch(error => {
		alert("Une erreur s'est produite lors de la mise à jour du profil.");
	});
}

function setupProfileEvents() {
	if (gameState.gameRunning)
		stopGame(); 
	if (gameActive)
		hideTicTacToe();
	const saveProfileButton = document.getElementById('saveProfileButton');
	const cancelEditButton = document.getElementById('cancelEditButton');
	const savePasswordButton = document.getElementById('savePasswordButton');
	const cancelPasswordButton = document.getElementById('cancelPasswordButton');

	if (saveProfileButton && !saveProfileButton.dataset.listener) {
		saveProfileButton.dataset.listener = "true";
		saveProfileButton.addEventListener('click', saveProfile);
	}

	if (cancelEditButton && !cancelEditButton.dataset.listener) {
		cancelEditButton.dataset.listener = "true";
		cancelEditButton.addEventListener('click', showProfile);
	}

	if (savePasswordButton && !savePasswordButton.dataset.listener) {
		savePasswordButton.dataset.listener = "true";
		savePasswordButton.addEventListener('click', savePassword);
	}

	if (cancelPasswordButton && !cancelPasswordButton.dataset.listener) {
		cancelPasswordButton.dataset.listener = "true";
		cancelPasswordButton.addEventListener('click', showProfile);
	}
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/user_stats/")
        .then(response => response.json())
        .then(data => {
            console.log("Données reçues :", data);

            if (data.error) {
                console.error("Erreur: ", data.error);
                return;
            }

            document.querySelector("#pong-stats").innerHTML = `
                Joués : ${data.pong.played} | Gagnés : ${data.pong.won} | Perdus : ${data.pong.lost} | Winrate : ${data.pong.winrate}%
            `;

            document.querySelector("#tic-tac-toe-stats").innerHTML = `
                Joués : ${data.tic_tac_toe.played} | Gagnés : ${data.tic_tac_toe.won} | Perdus : ${data.tic_tac_toe.lost} | Winrate : ${data.tic_tac_toe.winrate}%
            `;
        })
        .catch(error => console.error("Erreur lors du chargement des stats :", error));
});
