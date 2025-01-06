function showProfile() {
    const profileContainer = document.getElementById('profile-container');

    if (!profileContainer) {
        return;
    }

    if (profileContainer.classList.contains('hidden')) {
        profileContainer.classList.remove('hidden');
    } else {
        profileContainer.classList.add('hidden');
    }
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
        const password = document.getElementById('edit-password').value;
        const confirmPassword = document.getElementById('edit-confirm-password').value;

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
                console.error("Erreur :", error);
                alert("Une erreur s'est produite lors de la mise à jour du profil.");
            });
    });

    document.getElementById('cancelEditButton').addEventListener('click', () => {
        profileEditForm.classList.add('hidden');
        profileContainer.classList.remove('hidden');
    });
}
