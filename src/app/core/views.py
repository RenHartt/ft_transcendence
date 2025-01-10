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
from .models import Friendship

logger = logging.getLogger('core')

def index(request):
    logger.info('Index core')
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
        form = CustomUserCreationForm(request.POST)
        if request.method == 'POST':
            form = CustomUserCreationForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('/?page=login')
        return render(request, 'my_app/register.html', {'form': form})  

    elif page == 'tictactoe':
        return render(request, 'my_app/tictactoe.html')

    else:
        return HttpResponseNotFound("Page not found")


@never_cache
def load_page(request, page_name):
    logger.info('load_page core')
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

def tictactoe(request):
    return render(request, 'my_app/tictactoe.html')

def login(request):
    logger.info('login core')
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
    logger.info('📢 register() appelée')
    logger.info(f'📝 Méthode: {request.method}')

    if request.method == 'POST':
        logger.info('📨 Formulaire POST reçu')
        form = CustomUserCreationForm(request.POST)
        
        if form.is_valid():
            logger.info('✅ Formulaire valide, création de l\'utilisateur...')
            form.save()
            return redirect('/?page=login')
        else:
            logger.warning(f'❌ Formulaire invalide: {form.errors}')
    else:
        logger.info('🛑 Requête GET, affichage du formulaire')
        form = CustomUserCreationForm()  # ✅ Crée un formulaire vierge

    return render(request, 'my_app/register.html', {'form': form})  # ✅ Affiche bien le formulaire





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

@csrf_exempt
@login_required
def add_friend(request):
    """Ajouter un ami"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            friend_username = data.get('username')

            if not friend_username:
                return JsonResponse({'error': 'Nom d\'utilisateur manquant'}, status=400)

            friend = User.objects.filter(username=friend_username).first()
            if not friend:
                return JsonResponse({'error': 'Utilisateur introuvable'}, status=404)

            if friend == request.user:
                return JsonResponse({'error': 'Vous ne pouvez pas vous ajouter vous-même en ami.'}, status=400)

            if Friendship.objects.filter(user=request.user, friend=friend).exists():
                return JsonResponse({'error': 'Cet utilisateur est déjà votre ami.'}, status=400)

            Friendship.objects.create(user=request.user, friend=friend)
            Friendship.objects.create(user=friend, friend=request.user)

            return JsonResponse({'message': 'Ami ajouté avec succès !'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Requête invalide (JSON mal formé)'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
