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
    showPageFromURL(); 

    document.querySelectorAll('a.menu').forEach(link => {
        link.addEventListener('click', function (event) {
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
        .then(response => response.json())
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                document.querySelector('main').innerHTML = data.content;
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

document.querySelector('#logout').addEventListener('click', () => {
    logout();
})

async function logout()
{

    await fetch('/logout/', { method: 'GET' }, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf
        },
        body: JSON.stringify({})
    })
    .then(window.location.href = "?page=login")
}
