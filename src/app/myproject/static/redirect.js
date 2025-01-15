const menuPhoto = document.getElementById('menu-photo');
const menu = document.getElementById('menu');

menuPhoto.addEventListener('click', () => {
	menu.classList.toggle('menu-open');
});

function loadPage(page) {
	const contentElement = document.getElementById('content');

	fetch(`/${page}/`) // Adjust the URL as needed
		.then(response => {
			if (!response.ok) {
				throw new Error(`Failed to load page: ${page}`);
			}
			return response.text(); // Use text() to handle HTML responses
		})
		.then(html => {
			contentElement.innerHTML = html; // Inject HTML directly
		})
		.catch(error => {
			console.error('Error loading page:', error);
		});
}

function navigate(page) {
	menu.classList.remove('menu-open');

	if (page == 'home')
		history.pushState({ page }, '', `/`);
	else
		history.pushState({ page }, '', `/${page}/`);
	fetch(`/load/${page}/`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`Failed to load page: ${page}`);
			}
			return response.text();
		})
		.then(html => {
			document.getElementById('content').innerHTML = html;
		})
		.catch(error => console.error('Error loading page:', error));
}

window.addEventListener('popstate', (event) => {
	if (event.state && event.state.page) {
		loadPage(event.state.page);
	} else {
		// Default if no state
		loadPage('home');
	}
});



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
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');

    if (path) {
        loadPage(path);
    } else {
        loadPage('home');
    }

    document.querySelectorAll('a.menu').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('href').replace(/^\/+|\/+$/g, '');
            navigate(page);
        });
    });

    const logoutButton = document.querySelector('#logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    const initialPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (initialPath) {
        loadPage(initialPath);
    } else {
        loadPage('home');
    }
});



document.addEventListener('DOMContentLoaded', () => {
	showPageFromURL();

	document.querySelectorAll('a.menu').forEach(link => {
		link.addEventListener('click', function(event) {
			event.preventDefault();
			const href = this.getAttribute('href');
			const page = new URLSearchParams(href.split('?')[1]).get('page');

			if (page) {
				history.pushState(null, '', `?page=${page}`);
				showPageFromURL();
			}
		});
	});
});

function loadPage(page) {
	fetch(`/load/${page}/`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`Could not load partial: ${page}`);
			}
			return response.text();
		})
		.then(html => {
			document.getElementById('content').innerHTML = html;
		})
		.catch(error => {
			console.error(error);
			document.getElementById('content').innerHTML = `<p style="color: red;">Error loading ${page}</p>`;
		});
}

document.querySelector('#logout').addEventListener('click', () => {
	logout();
})

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

