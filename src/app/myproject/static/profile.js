function showProfile() {
    const profileContainer = document.getElementById('profile-container');
    const profileInfo = document.getElementById('profile-info');
    const closeProfileButton = document.getElementById('closeProfileButton');

    if (!profileContainer) {
        console.error("❌ Erreur : #profile-container introuvable !");
        return;
    }

    // Récupération des données de profil via AJAX
    fetch('/api/profile', {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrf,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données de profil');
            }
            return response.json();
        })
        .then(data => {
            // Afficher les données du profil
            profileInfo.innerHTML = `
                <strong>Nom :</strong> ${data.name}<br>
                <strong>Email :</strong> ${data.email}
            `;
        })
        .catch(error => {
            console.error("Erreur lors de la récupération du profil :", error);
            profileInfo.textContent = "Impossible de charger les informations du profil.";
        });

    // Afficher le conteneur de profil
    profileContainer.classList.remove('hidden');

    // Gestion du bouton "Close"
    closeProfileButton.addEventListener('click', () => {
        profileContainer.classList.add('hidden');
    });
}
