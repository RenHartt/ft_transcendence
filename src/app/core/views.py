from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import logout as auth_logout
from django.views.decorators.cache import never_cache
from django.contrib import messages
from django.utils.translation import gettext as _
from django.http import JsonResponse
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.shortcuts import render, redirect
from django.http import HttpResponseNotFound
import logging
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import update_session_auth_hash
import json
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from .models import Friendship
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.db import models
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.core.cache import cache
from django.utils.translation import get_language

User = get_user_model()
logger = logging.getLogger('core')

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
        return render(request, 'my_app/404.html')   

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

def tictactoe(request):
    return render(request, 'my_app/tictactoe.html')

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
            logger.warning(f'❌ Formulaire invalide: {form.errors}')
    else:
        form = CustomUserCreationForm()
    return render(request, 'my_app/register.html', {'form': form})

def custom404(request, exception):
    return render(request, 'my_app/404.html', status=404)

def test_csrf(request):
    return JsonResponse({'csrf_token': request.COOKIES.get('csrftoken', 'Not Found')})

def profile(request):
    if request.method == 'GET':
        pending_requests = Friendship.objects.filter(
            receiver=request.user, is_accepted=False
            ).values(
            'id',
            'requester__username',
            )
        friends = Friendship.objects.filter(
            (models.Q(requester=request.user) | models.Q(receiver=request.user)) & models.Q(is_accepted=True)
        ).values(
            'id',
            'requester__username',
            'receiver__username',
            'requester__is_logged_in',
            'receiver__is_logged_in',
            )

        return JsonResponse({
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'is_logged_in': request.user.is_logged_in,
            'pending_requests': list(pending_requests),
            'friends': list(friends),
        })
    else:
        return HttpResponse(status=405)

def test_language(request):
    logger.info(f"Langue actuelle : {get_language()}")
    return HttpResponse(f"Langue actuelle : {get_language()}")

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

@csrf_exempt 
@login_required 
def save_profile(request):
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

@login_required
def send_friend_request(request):
    if request.method == 'POST':
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                username = data.get('username')
            else:
                username = request.POST.get('username')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        if not username:
            return JsonResponse({'error': 'Username is required'}, status=400)

        receiver = get_object_or_404(User, username=username)

        if receiver == request.user:
            return JsonResponse({'error': 'You cannot send a friend request to yourself'}, status=400)

        friendship, created = Friendship.objects.get_or_create(
            requester=request.user,
            receiver=receiver
        )

        if created:
            return JsonResponse({'message': 'Friend request sent successfully.'}, status=200)
        else:
            return JsonResponse({'message': 'Friend request already exists.'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
def accept_friend_request(request, request_id):
    friendship = get_object_or_404(Friendship, id=request_id, receiver=request.user)
    if not friendship.is_accepted:
        friendship.is_accepted = True
        friendship.save()
    return JsonResponse({'message': 'Friend request accepted.'}, status=200)

@login_required
def decline_friend_request(request, request_id):
    friendship = get_object_or_404(Friendship, id=request_id, receiver=request.user)
    friendship.delete()
    return JsonResponse({'message': 'Friend request declined.'}, status=200)

@login_required
def friend_list(request):
    friends = Friendship.objects.filter(
        (models.Q(requester=request.user) | models.Q(receiver=request.user)) & models.Q(is_accepted=True)
    )
    return render('index')

@login_required
def friend_requests(request):
    pending_requests = Friendship.objects.filter(receiver=request.user, is_accepted=False)
    return render('index')

@login_required
def handleFriendRequest(request, request_id):
    friendship = get_object_or_404(Friendship, id=request_id, receiver=request.user)
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'accept':
            friendship.is_accepted = True
            friendship.save()
            return redirect('friend_requests')
        elif action == 'decline':
            friendship.delete()
            return redirect('friend_requests')
    return render('index')

@login_required
def remove_friend(request, friend_id):
    if request.method == 'POST':
        logger.info(f"Suppression de l'ami {friend_id}")
        friendship = get_object_or_404(Friendship, id=friend_id, is_accepted=True)
        friendship.delete()
        return JsonResponse({'message': 'Ami supprimé avec succès.'}, status=200)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
