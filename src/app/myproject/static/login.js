window.onload = () => {
    let labels = document.querySelectorAll('label.label'); 
    labels.forEach(label => {
        let input = label.nextElementSibling; 

        if (!input) {
            console.warn("⚠️ Pas d'input trouvé pour", label);
            return;
        }

        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                label.style.opacity = "1";
            } else {
                label.style.opacity = "0";
            }
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                label.style.opacity = "0";
            }
        });
    });
};