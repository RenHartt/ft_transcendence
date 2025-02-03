const functionMap = new Map();

function prout() { 
	console.log("prout");
}

functionMap.set('profile', showProfile);
functionMap.set('edit-profile', editProfile);
functionMap.set('change-password', showChangePassword);
functionMap.set('add-friend', addFriend);
functionMap.set('history', showHistory);
functionMap.set('tictactoe', showTicTacToe);
functionMap.set('pong', showPong);
functionMap.set('pong-tournament', showPongTournament);

// change the page url base on the page string and add it to the url history
function updateURL(page) {
	history.pushState({ page }, '', `/?page=${page}/`);
}

function showPageFromURL() {
	document.querySelectorAll('.pages').forEach(section => {
		section.classList.add('hidden');
	});

  const urlParams = new URLSearchParams(window.location.search);
  let page = urlParams.get('page') || 'home'

  console.log('Requested page:', page);
  page = page.replace(/^\/+|\/+$/g, '');


  // Show the active page, if it exists login or register
  const activeSection = document.getElementById(page);
	
  if (activeSection) {
    activeSection.classList.remove('hidden');
	return
  } 

  const home = document.getElementById('home');
  home.classList.remove('hidden');

  // Execute the function associated with the page, if any
  const func = functionMap.get(page);
  if (typeof func === 'function') {
    console.log('Executing function:', func);
    func();
  } else {
    console.warn(`No function mapped for page "${page}".`);
  }
}

window.addEventListener('popstate', () => {
  showPageFromURL();
});

document.addEventListener('DOMContentLoaded', () => {
    showPageFromURL(); 

    document.querySelectorAll('a.menu').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const href = this.getAttribute('href');
            const page = new URLSearchParams(href.split('?')[1]).get('page');

            if (page) {
				updateURL(page)
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
