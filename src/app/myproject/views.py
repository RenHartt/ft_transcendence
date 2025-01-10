from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
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
from django.contrib.auth import get_user_model

User = get_user_model()
from django.shortcuts import render, redirect
from django.http import HttpResponseNotFound
import requests
import logging
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import update_session_auth_hash
import json


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
            return redirect('/?page=login') 
    return render(request, 'my_app/login.html')

def logout(request):
    auth_logout(request)
    return redirect('/?page=login')


def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/?page=login')
        else:
            sys.stdout.flush()
    else:
        form = CustomUserCreationForm()
        return redirect('/?page=register') 



def profile(request):
    if request.method == 'GET':
        return JsonResponse({
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name
        })
    else:
        return HttpResponse(status=405)
    

@login_required
@csrf_exempt
def update_profile(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            request.user.email = data.get('email', request.user.email)
            request.user.first_name = data.get('first_name', request.user.first_name)
            request.user.last_name = data.get('last_name', request.user.last_name)
            request.user.save()
            return JsonResponse({
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
@csrf_exempt
def change_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            old_password = data.get('old_password')
            new_password = data.get('new_password')

            if not request.user.check_password(old_password):
                return JsonResponse({'error': 'Mot de passe actuel incorrect.'}, status=400)

            request.user.set_password(new_password)
            request.user.save()

            update_session_auth_hash(request, request.user)

            return JsonResponse({'message': 'Mot de passe changé avec succès.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

from django.http import JsonResponse

@csrf_exempt 
@login_required 
def save_profile(request):
    """Mise à jour du profil utilisateur"""
    if request.method == 'POST':
        user = request.user 

        first_name = request.POST.get('first_name', user.first_name)
        last_name = request.POST.get('last_name', user.last_name)
        email = request.POST.get('email', user.email)
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()
        return JsonResponse({'message': 'Profil mis à jour avec succès !'})

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
