window.onload = () => {
    let labels = document.querySelectorAll('label.label'); 
    labels.forEach(label => {
        let input = label.nextElementSibling; 

        if (!input)
            return;

        input.addEventListener('input', () => {
            if (input.value.trim() !== '') 
                label.style.opacity = "1";
            else 
                label.style.opacity = "0";
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() === '') 
                label.style.opacity = "0";
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form.jesaispas");
    const registerForm = document.getElementById("register-form");

    function showRegisterForm() {
        loginForm.style.display = "none";
        registerForm.classList.remove("hidden");
    }

    function showLoginForm() {
        registerForm.classList.add("hidden");
        loginForm.style.display = "block";
    }

    window.showRegisterForm = showRegisterForm;
    window.showLoginForm = showLoginForm;
});
