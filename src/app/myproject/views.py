from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import logout as auth_logout
from django.views.decorators.cache import never_cache
from django.contrib.sessions.models import Session
from django.contrib import messages
from django.utils.translation import gettext as _
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.http import HttpResponseNotFound
import requests
import logging

logger = logging.getLogger('myproject')

def index(request):
    page = request.GET.get('page', 'home') 

    if page == 'login':
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)

            if user is not None:
                auth_login(request, user)
                return redirect('/?page=home')  
            else:
                messages.error(request, 'Invalid username or password')
        return render(request, 'my_app/login.html') 

    elif page == 'home':
        if not request.user.is_authenticated:
            return redirect('/?page=login')  
        return render(request, 'my_app/home.html')
        
    elif page == 'register':  
        form = UserCreationForm()
        if request.method == 'POST':
            form = UserCreationForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('/?page=login')
        return render(request, 'my_app/register.html', {'form': form}) 

    elif page == 'about':
        return render(request, 'my_app/about.html')

    else:
        return HttpResponseNotFound("Page not found")


@never_cache
def load_page(request, page_name):
    if page_name == "login":
        return render(request, 'my_app/login.html')
    elif page_name in ["home", "index", ""]:
        if not request.user.is_authenticated:
            return redirect('login')
        else:
            return redirect('home')
    else:
        return render(request, 'my_app/404.html')

@login_required
@never_cache
def home(request):
    return render(request, 'my_app/home.html', {"username": request.user.username})

def about(request):
    return render(request, 'my_app/about.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            return redirect('/?page=home')  
        else:
            messages.error(request, 'Invalid username or password')
            return redirect('/?page=login')  # Redirection vers la page de connexion
    return render(request, 'my_app/login.html')

def fortytwologin(request):
    print("42 login")
    code = request.GET.get('code', None)
    if(code == None):
        return(HttpResponse("code param not found"))
    
    data = {
        'grant_type': 'authorization_code',
        'client_id': 'u-s4t2ud-996544e675137d321c58aadcc8e6d5dcdff78712fc296361f5c306709ebe4b70', #a ne pas mettre en dur
        'client_secret': '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', #a ne pas mettre en dur
        'code': code,
        'redirect_uri': 'http://localhost:8080/?page=login'
    }
    token_response = requests.post('https://api.intra.42.fr/oauth/token', data=data)

    if token_response.status_code != 200:
        print("Failed to get access token:", token_response.json())
        return HttpResponse("Bad 42 API request, U mad ??", status=400)

    access_token = token_response.json().get('access_token')
    if not access_token:
        return HttpResponse("Access token not found in response", status=400)

    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    user_response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)

    if user_response.status_code != 200:
        print("Failed to fetch user data:", user_response.json())
        return HttpResponse("Failed to fetch user data", status=400)

    user_data = user_response.json()
    id42 = user_data.get('id')
    login42 = user_data.get('login')

    db_user, created = User.objects.get_or_create(username=id42, defaults={
        'first_name': user_data.get('first_name', ''),
        'last_name': user_data.get('last_name', ''),
        'email': user_data.get('email', f'{login42}@student.42.fr')
    })

    request.session["logged_in"] = True
    request.session["username"] = db_user.username
    request.session["id"] = db_user.id
    request.session["pfp"] = user_data.get('image', {}).get('versions', {}).get('medium', '')
    request.session.save()

    print(f"User {login42} logged in successfully.")
    return redirect('/?page=home')

def logout(request):
    auth_logout(request)
    return redirect('/?page=login')


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/?page=login')
    else:
        form = UserCreationForm()
        return redirect('/?page=register')
