function prout() {
	console.log("prout")
}

function showProfile() {
	const profileContainer = document.getElementById('profile-container');
	const profileEditForm = document.getElementById('profile-edit-form');
	const changePasswordForm = document.getElementById('change-password-form');
	const overlay = document.getElementById('overlay');
	const ticTacToeModal = document.getElementById('tic-tac-toe-modal');
	const pongWrapper = document.getElementById('pong-wrapper');
	const addFriendForm = document.getElementById("friend-request-form");
	const history = document.getElementById('history-constainer');

	if (gameState.gameRunning) { stopGame(); }
	if (gameActive) { hideTicTacToe(); }

	if (!profileContainer) return;

	if (!profileContainer.classList.contains('hidden')) {
		profileContainer.classList.add('hidden');
	} else {
		overlay.classList.remove('active');
		ticTacToeModal.classList.remove('active');
		if (pongWrapper) pongWrapper.style.display = 'none';
		profileEditForm.classList.add('hidden');
		changePasswordForm.classList.add('hidden');
		profileContainer.classList.remove('hidden');
		addFriendForm.classList.add('hidden');
		history.classList.add('hidden');
	}

	loadProfile();
}

var templates = {};
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

function loadProfile() {
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
			const isLoggedUser = data.is_logged_in;
			console.log("isLoggedUser:", isLoggedUser);
			const friendsList = document.getElementById('friends-list');
			friendsList.innerHTML = '';
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
	const profileContainer = document.getElementById('profile-container');
	const profileEditForm = document.getElementById('profile-edit-form');
	if (!profileContainer || !profileEditForm) {
		return;
	}

	profileContainer.classList.add('hidden');
	profileEditForm.classList.remove('hidden');

	document.getElementById('saveProfileButton').addEventListener('click', () => {
		const email = document.getElementById('edit-email').value;
		const firstName = document.getElementById('edit-first-name').value;
		const lastName = document.getElementById('edit-last-name').value;
		const password = document.getElementById('edit-password');
		const confirmPassword = document.getElementById('edit-confirm-password');
		console.log("Email:", email, "First Name:", firstName, "Last Name:", lastName, "Password:", password, "Confirm Password:", confirmPassword);
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

	document.getElementById('edit-password-button').addEventListener('click', () => {
		const changePasswordForm = document.getElementById('change-password-form');
		if (!changePasswordForm) {
			return;
		}
		profileEditForm.classList.add('hidden');
		changePasswordForm.classList.remove('hidden');
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

document.addEventListener('DOMContentLoaded', () => {
	const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');
	sendFriendRequestButton.addEventListener('click', addFriend);
});


function addFriend() {
	console.log("aaaa")
	const addFriendForm = document.getElementById('friend-request-form');
	const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]'); // CSRF token
	const sendFriendRequestButton = document.getElementById('sendFriendRequestButton');
	const csrfToken = csrfTokenElement ? csrfTokenElement.value : null;
	console.log(profileContainer)
	console.log(addFriendForm)
	console.log(csrfToken)

	if (!addFriendForm || !csrfToken) {
		return;
	}

	sendFriendRequestButton.addEventListener('click', () => {
		const friendUsername = document.getElementById('friend-username')?.value;
		console.log(friendUsername)
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
			.then(async response => {
				console.log('Request Details:');
				console.log('URL:', '/api/send-friend-request/');
				console.log('Method:', 'POST');
				console.log('Headers:', {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
				});
				console.log('Body:', { username: friendUsername });

				console.log('Raw Response:', response);

				// Log the raw response text
				const responseText = await response.text();
				console.log('Raw Response Text:', responseText);

				// Attempt to parse JSON
				try {
					const jsonData = JSON.parse(responseText);
					console.log('Parsed Response Data:', jsonData);
					return jsonData;
				} catch (error) {
					console.error('Error parsing JSON:', error);
					throw new Error('Response is not valid JSON.');
				}
			})
			.then(data => {
				alert(data.message || 'Friend request sent successfully.');
			})
			.catch(error => {
				console.error('Error occurred:', error);
			});
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
