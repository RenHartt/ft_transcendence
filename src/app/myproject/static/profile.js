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
    const changePasswordForm = document.getElementById('change-password-form');

    if (!profileContainer || !profileEditForm || !changePasswordForm) {
        console.error("❌ Erreur : Conteneur de profil ou formulaire introuvable !");
        return;
    }

    profileContainer.classList.add('hidden');
    profileEditForm.classList.remove('hidden');

    const saveProfileButton = document.getElementById('saveProfileButton');
    const cancelEditButton = document.getElementById('cancelEditButton');
    const editPasswordButton = document.getElementById('edit-password-button');

    saveProfileButton.replaceWith(saveProfileButton.cloneNode(true));
    cancelEditButton.replaceWith(cancelEditButton.cloneNode(true));
    editPasswordButton.replaceWith(editPasswordButton.cloneNode(true));

    document.getElementById('savePasswordButton').addEventListener('click', () => {
        console.log("savePasswordButton déclenché"); 
        const oldPasswordField = document.getElementById('old-password');
        const newPasswordField = document.getElementById('new-password');
        const confirmPasswordField = document.getElementById('confirm-password');

        const oldPassword = oldPasswordField.value;
        const newPassword = newPasswordField.value;
        const confirmPassword = confirmPasswordField.value;

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
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Erreur inconnue');
                    });
                }
            })
            .then(data => {
                alert(data.message || "Mot de passe changé avec succès !");

                const oldPasswordField = document.getElementById('old-password');
                const newPasswordField = document.getElementById('new-password');
                const confirmPasswordField = document.getElementById('confirm-password');

                oldPasswordField.value = '';
                newPasswordField.value = '';
                confirmPasswordField.value = '';

                // Masquer le formulaire de changement de mot de passe
                const changePasswordForm = document.getElementById('change-password-form');
                const profileEditForm = document.getElementById('profile-edit-form');
                changePasswordForm.classList.add('hidden');
                profileEditForm.classList.remove('hidden');
            })
            .catch(error => {
                alert(error.message || "Une erreur s'est produite lors du changement de mot de passe.");
            });
    });

    // Gestion du bouton "Cancel"
    document.getElementById('cancelEditButton').addEventListener('click', () => {
        profileEditForm.classList.add('hidden');
        profileContainer.classList.remove('hidden');
    });

    // Gestion du bouton "Change Password"
    document.getElementById('edit-password-button').addEventListener('click', () => {
        profileEditForm.classList.add('hidden');
        changePasswordForm.classList.remove('hidden');

        // Gestion des boutons dans le formulaire de mot de passe
        const savePasswordButton = document.getElementById('savePasswordButton');
        const cancelPasswordButton = document.getElementById('cancelPasswordButton');

        savePasswordButton.replaceWith(savePasswordButton.cloneNode(true));
        cancelPasswordButton.replaceWith(cancelPasswordButton.cloneNode(true));

        document.getElementById('savePasswordButton').addEventListener('click', () => {
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
            new_password: newPassword,
        }),
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // La réponse est correcte, on retourne les données JSON
            } else {
                return response.json().then(data => {
                    throw new Error(data.error || 'Erreur inconnue');
                });
            }
        })
        .then(data => {
            alert(data.message || "Mot de passe changé avec succès !");
            console.log("✅ Mot de passe changé :", data);

            // Masquer le formulaire de changement de mot de passe
            const changePasswordForm = document.getElementById('change-password-form');
            const profileEditForm = document.getElementById('profile-edit-form');
            changePasswordForm.classList.add('hidden');
            profileEditForm.classList.remove('hidden');
        })
        .catch(error => {
            console.error("Erreur :", error);
            alert(error.message || "Une erreur s'est produite lors du changement de mot de passe.");
        });
});

        // Gestion du bouton "Cancel Password"
        document.getElementById('cancelPasswordButton').addEventListener('click', () => {
            changePasswordForm.classList.add('hidden');
            profileEditForm.classList.remove('hidden');
        });
    });
}