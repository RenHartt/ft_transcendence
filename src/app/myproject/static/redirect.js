const menuPhoto = document.getElementById('menu-photo');
const menu = document.getElementById('menu');

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const menuPhoto = document.getElementById('menu-photo');

    // Toggle the menu when clicking the menu button
    menuPhoto.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the event from propagating to the document
        menu.classList.toggle('menu-open');
    });

    // Close the menu when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && menu.classList.contains('menu-open')) {
            menu.classList.remove('menu-open');
        }
    });
});

function injectHtml(page, body = document.getElementById('content')) {
  fetch(`/load/${page}/`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load page: ${page}`);
      }
      return response.text();
    })
    .then(html => {
      // 1. Create a temporary container to manipulate the fetched HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // 2. Extract any <script> tags
      const scripts = tempDiv.querySelectorAll('script');
      
      // 3. Move HTML content (minus script tags) into the body
      body.innerHTML = tempDiv.innerHTML.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
      
      // 4. For each script, create a new script element and append
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        // Copy over src or inline script content
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });
    })
    .catch(error => {
      console.error('Error loading page:', error);
      body.innerHTML = `<h1>Error</h1><p>Could not load the page.</p>`;
    });
}

function navigate(page) {
	menu.classList.remove('menu-open');

	if (page == 'home')
		history.pushState({ page }, '', `/`);
	else
		history.pushState({ page }, '', `/${page}/`);
	injectHtml(page)
}

function showPageFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	const page = urlParams.get('page') || 'home';

	document.querySelectorAll('.pages').forEach(section => {
		section.classList.add('hidden');
	});

	const activeSection = document.getElementById(page);
	if (activeSection) {
		activeSection.classList.remove('hidden');
	} else {
		console.warn(`La section "${page}" n'existe pas.`);
	}
}


document.addEventListener('DOMContentLoaded', () => {

	const logoutButton = document.querySelector('#logout');
	if (logoutButton) {
		logoutButton.addEventListener('click', logout);
	}

	showPageFromURL();
	const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
	navigate(path);
});

async function logout() {

	await fetch('/logout/', { method: 'GET' }, {
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrf
		},
		body: JSON.stringify({})
	})
		.then(window.location.href = "?page=login")
}
