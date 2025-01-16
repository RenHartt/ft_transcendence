document.addEventListener("DOMContentLoaded", () => {
    const injectCSS = (css) => {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    };
  
    const css = `
      .cookie-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000;
      }
  
      .cookie-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        width: 90%;
        max-width: 400px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        text-align: center;
      }
  
      .cookie-buttons button {
        margin: 10px;
        padding: 10px 20px;
        border: none;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
      }
  
      #accept-all {
        background-color: green;
        color: white;
      }
  
      #reject-all {
        background-color: red;
        color: white;
      }
  
      #customize {
        background-color: gray;
        color: white;
      }
    `;
  
    injectCSS(css);
  
    const bannerHTML = `
      <div id="cookie-banner" style="display: none;">
        <div class="cookie-overlay"></div>
        <div class="cookie-modal">
          <p>Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez choisir d'accepter ou de refuser les cookies.</p>
          <div class="cookie-buttons">
            <button id="accept-all">Accepter tout</button>
            <button id="reject-all">Refuser tout</button>
            <button id="customize">Personnaliser</button>
          </div>
        </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML("beforeend", bannerHTML);
  
    const banner = document.getElementById("cookie-banner");
  
    const consent = sessionStorage.getItem("cookieConsent");
  
    if (!consent) {
      console.log("Aucun consentement trouvé pour cette session, affichage de la bannière.");
      banner.style.display = "block";
    } else {
      console.log("Consentement déjà enregistré pour cette session :", consent);
    }
  
    document.getElementById("accept-all").addEventListener("click", () => {
      sessionStorage.setItem("cookieConsent", "accepted");
      banner.style.display = "none";
      console.log("Consentement accepté.");
    });
  
    document.getElementById("reject-all").addEventListener("click", () => {
      sessionStorage.setItem("cookieConsent", "rejected");
      banner.style.display = "none";
      console.log("Consentement refusé.");
    });
  
    document.getElementById("customize").addEventListener("click", () => {
      alert("Fonctionnalité à implémenter pour personnaliser les cookies !");
    });
  });
  