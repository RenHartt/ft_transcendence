function showProfile() {
    const profileContainer = document.getElementById('profile-container');
    const profileEditForm = document.getElementById('profile-edit-form');
    const changePasswordForm = document.getElementById('change-password-form');

    if (!profileContainer) {
        return;
    }

    console.log("👤 Toggle du profil");
    profileEditForm.classList.add('hidden');
    changePasswordForm.classList.add('hidden');
    profileContainer.classList.toggle('hidden');
}

function editProfile() {
    console.log("🛠 Edition du profil");
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
                console.error("Erreur :", error);
                alert("Une erreur s'est produite lors de la mise à jour du profil.");
            });
    });

    document.getElementById('cancelEditButton').addEventListener('click', () => {
        profileEditForm.classList.add('hidden');
        profileContainer.classList.remove('hidden');
    });

    document.getElementById('edit-password-button').addEventListener('click', () => {
        console.log("🛠 Affichage du formulaire de changement de mot de passe");
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
        console.log("🔄 Annulation de l'édition du profil");
        const profileEditForm = document.getElementById('profile-edit-form');
        const profileContainer = document.getElementById('profile-container');
        if (!profileEditForm || !profileContainer) {
            return;
        }
        profileEditForm.classList.add('hidden');
        profileContainer.classList.remove('hidden');
    });

    document.getElementById('savePasswordButton').addEventListener('click', () => {
        console.log("🚀 Enregistrement du nouveau mot de passe");
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
                console.error("Erreur :", error);
                alert("Une erreur s'est produite lors du changement de mot de passe.");
            });
    });
}
