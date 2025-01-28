function showPopup(title, message, type = "info", autoClose = true, duration = 3000) {
    const popup = document.getElementById("custom-popup");
    const popupTitle = document.getElementById("popup-title");
    const popupMessage = document.getElementById("popup-message");
    const popupClose = document.getElementById("popup-close");

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    popup.classList.remove("hidden", "success", "error");
    popup.classList.add(type);

    popup.style.display = "block";

    popupClose.onclick = function () {
        popup.style.display = "none";
    };

    if (autoClose) {
        setTimeout(() => {
            popup.style.display = "none";
        }, duration);
    }
}